import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback } from "react";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../lib/config";
import { BosonRoutes } from "../../../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useSellerCurationListFn } from "../../../../lib/utils/hooks/useSellers";
import { CreateYourProfile as CreateYourProfileType } from "../../../product/utils";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import LensProfile from "./Lens/LensProfile";
import { getLensProfileInfo } from "./Lens/utils";
import { LensProfileType } from "./Lens/validationSchema";
import CreateYourProfile from "./Regular/CreateYourProfile";

interface Props {
  initialRegularCreateProfile: CreateYourProfileType;
  onRegularProfileCreated: (createValues: CreateYourProfileType) => void;
  isSeller: boolean;
}

const showLensVersion =
  [80001, 137].includes(CONFIG.chainId) && CONFIG.lens.enabled;

export default function CreateProfileModal({
  initialRegularCreateProfile,
  onRegularProfileCreated,
  isSeller
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const { hideModal } = useModal();
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
    return showLensVersion ? (
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
        isSeller={isSeller}
      />
    ) : (
      <CreateYourProfile
        initial={initialRegularCreateProfile}
        onSubmit={(regularProfile) => {
          onRegularProfileCreated(regularProfile);
          hideModal();
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRegularCreateProfile, onRegularProfileCreated]);

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

  return <Component />;
}
