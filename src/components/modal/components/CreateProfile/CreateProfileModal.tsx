import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect } from "react";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../lib/config";
import { BosonRoutes } from "../../../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { CreateYourProfile as CreateYourProfileType } from "../../../product/utils";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import LensProfile from "./Lens/LensProfile";
import CreateYourProfile from "./Regular/CreateYourProfile";

interface Props {
  initialRegularCreateProfile: CreateYourProfileType;
  onRegularProfileCreated: (createValues: CreateYourProfileType) => void;
}

const showLensVersion =
  [80001, 137].includes(CONFIG.chainId) && CONFIG.lens.enabled;

export default function CreateProfileModal({
  initialRegularCreateProfile,
  onRegularProfileCreated
}: Props) {
  useEffect(() => {
    console.log("mount profile modal");
  }, []);
  console.log("regular values inside modal", initialRegularCreateProfile);
  const { hideModal } = useModal();
  const { address = "" } = useAccount();

  const Component = useCallback(() => {
    return showLensVersion ? (
      <LensProfile
        onSubmit={() => {
          hideModal();
        }}
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

  const navigate = useKeepQueryParamsNavigate();
  if (!address) {
    return (
      <>
        <Typography>
          To create a profile you must first connect your wallet
        </Typography>
        <Grid>
          <ConnectButton />

          <Button
            theme="bosonSecondary"
            onClick={() => navigate({ pathname: BosonRoutes.Root })}
          >
            Go back to the home page
          </Button>
        </Grid>
      </>
    );
  }

  return <Component />;
}
