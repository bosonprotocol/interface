import { subgraph } from "@bosonprotocol/react-kit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../../lib/routing/routes";
import { Profile } from "../../../../lib/utils/hooks/lens/graphql/generated";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useSellerCurationListFn } from "../../../../lib/utils/hooks/useSellers";
import { CreateYourProfile as CreateYourProfileType } from "../../../product/utils";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import { ChooseProfileType } from "./ChooseProfileType";
import LensProfile from "./Lens/LensProfile";
import { getLensProfileInfo } from "./Lens/utils";
import { LensProfileType } from "./Lens/validationSchema";
import CreateYourProfile from "./Regular/CreateYourProfile";

interface Props {
  initialRegularCreateProfile: CreateYourProfileType;
  onRegularProfileCreated: (createValues: CreateYourProfileType) => void;
  // useLens: boolean;
  seller?: subgraph.SellerFieldsFragment;
  lensProfile?: Profile;
}

export default function CreateProfileModal({
  initialRegularCreateProfile,
  onRegularProfileCreated,
  // useLens,
  seller,
  lensProfile: selectedProfile
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
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
      <LensProfile
        onSubmit={(id, lensProfile, overrides?: LensProfileType) => {
          hideModal(lensProfile);
          if (lensProfile) {
            onRegularProfileCreated({
              createYourProfile: {
                ...getLensProfileInfo(lensProfile),
                ...overrides,
                logo: undefined
              }
            });
          }
          if (id !== "") {
            shouldRedirectToCustomBetaPage(id);
          }
        }}
        seller={seller || null}
        lensProfile={selectedProfile}
        changeToRegularProfile={() => setProfileType("regular")}
      />
    ) : (
      <CreateYourProfile
        initial={initialRegularCreateProfile}
        onSubmit={(regularProfile) => {
          onRegularProfileCreated(regularProfile);
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
