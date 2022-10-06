import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback } from "react";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../lib/config";
import { BosonRoutes } from "../../../../lib/routing/routes";
import { Profile } from "../../../../lib/utils/hooks/lens/graphql/generated";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { CreateYourProfile as CreateYourProfileType } from "../../../product/utils";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import LensProfile from "./Lens/LensProfile";
import CreateYourProfile from "./Regular/CreateYourProfile";

interface Props {
  initialRegularCreateProfile: CreateYourProfileType;
  onRegularProfileCreated: (createValues: CreateYourProfileType) => void;
  onUseLensProfile: (lensValues: Profile) => void;
}

const showLensVersion =
  [80001, 137].includes(CONFIG.chainId) && CONFIG.lens.enabled;

export default function CreateProfileModal({
  initialRegularCreateProfile,
  onRegularProfileCreated,
  onUseLensProfile
}: Props) {
  const { address = "" } = useAccount();

  const Component = useCallback(() => {
    return showLensVersion ? (
      <LensProfile onSubmit={onUseLensProfile} />
    ) : (
      <CreateYourProfile
        initial={initialRegularCreateProfile}
        onSubmit={onRegularProfileCreated}
      />
    );
  }, [initialRegularCreateProfile, onRegularProfileCreated, onUseLensProfile]);

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
