import { subgraph } from "@bosonprotocol/react-kit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../../lib/routing/routes";
import { getFixedBase64FromUrl } from "../../../../lib/utils/base64";
import { Profile } from "../../../../lib/utils/hooks/lens/graphql/generated";
import { useIpfsStorage } from "../../../../lib/utils/hooks/useIpfsStorage";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useSellerCurationListFn } from "../../../../lib/utils/hooks/useSellers";
import { CreateProfile } from "../../../product/utils";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import { ChooseProfileType } from "./ChooseProfileType";
import LensProfileFlow from "./Lens/LensProfileFlow";
import {
  getLensCoverPictureUrl,
  getLensProfileInfo,
  getLensProfilePictureUrl
} from "./Lens/utils";
import { LensProfileType } from "./Lens/validationSchema";
import { CreateRegularProfileFlow } from "./Regular/CreateRegularProfileFlow";

interface Props {
  initialRegularCreateProfile: CreateProfile;
  onRegularProfileCreated?: (createValues: CreateProfile) => void;
  seller?: subgraph.SellerFieldsFragment;
  lensProfile?: Profile;
}

export default function CreateProfileModal({
  initialRegularCreateProfile,
  onRegularProfileCreated,
  seller,
  lensProfile: selectedProfile
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const ipfsMetadataStorage = useIpfsStorage();
  const { hideModal } = useModal();
  const [profileType, setProfileType] = useState<
    undefined | "lens" | "regular"
  >(undefined);
  const { address = "" } = useAccount();
  const checkIfSellerIsInCurationList = useSellerCurationListFn();

  const shouldRedirectToCustomBetaPage = useCallback(
    (sellerId: string) => {
      const isAccountSeller = !!sellerId;
      const isSellerInCurationList = checkIfSellerIsInCurationList(sellerId);

      if (isAccountSeller && !isSellerInCurationList) {
        return navigate({ pathname: BosonRoutes.ClosedBeta });
      }
    },
    [checkIfSellerIsInCurationList, navigate]
  );

  const Component = useCallback(() => {
    return profileType === "lens" ? (
      <LensProfileFlow
        onSubmit={async (id, lensProfile, overrides?: LensProfileType) => {
          hideModal(lensProfile);
          if (lensProfile) {
            const coverPictureUrl = getLensCoverPictureUrl(lensProfile);
            const coverPictureBase64 = await getFixedBase64FromUrl(
              coverPictureUrl,
              ipfsMetadataStorage
            );
            if (!coverPictureBase64) {
              return;
            }
            const profilePictureUrl = getLensProfilePictureUrl(lensProfile);
            const profilePictureBase64 = await getFixedBase64FromUrl(
              profilePictureUrl,
              ipfsMetadataStorage
            );
            if (!profilePictureBase64) {
              return;
            }
            const createProfile: CreateProfile = {
              ...getLensProfileInfo(lensProfile),
              logo: [{ src: profilePictureBase64 }],
              coverPicture: [
                {
                  src: coverPictureBase64
                }
              ],
              ...overrides
            };
            onRegularProfileCreated?.(createProfile);
          }
          if (id !== "") {
            shouldRedirectToCustomBetaPage(id);
          }
        }}
        isEdit={false}
        seller={seller || null}
        lensProfile={selectedProfile}
        changeToRegularProfile={() => setProfileType("regular")}
      />
    ) : (
      <CreateRegularProfileFlow
        initialData={initialRegularCreateProfile}
        onSubmit={(regularProfile) => {
          onRegularProfileCreated?.(regularProfile);
          hideModal();
        }}
        changeToLensProfile={() => setProfileType("lens")}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRegularCreateProfile, onRegularProfileCreated, profileType]);

  if (!address) {
    return (
      <>
        <Typography>
          To create a profile you must first connect your wallet
        </Typography>
        <Grid>
          <ConnectButton />

          <BosonButton
            variant="accentInverted"
            onClick={() => navigate({ pathname: BosonRoutes.Root })}
          >
            Go back to the home page
          </BosonButton>
        </Grid>
      </>
    );
  }
  if (profileType === undefined) {
    return <ChooseProfileType setProfileType={setProfileType} />;
  }

  return <Component />;
}
