import { useEffect } from "react";
import { useAccount } from "wagmi";

import { ReactComponent as LensLogo } from "../../../../../../src/assets/lens-logo.svg";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useGetLensProfiles from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import GridContainer from "../../../../ui/GridContainer";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import ProfileMultiSteps from "./ProfileMultiSteps";

interface Props {
  onChooseCreateNew: () => void;
  onChooseUseExisting: (profile: Profile) => void;
}

export default function CreateOrChoose({
  onChooseCreateNew,
  onChooseUseExisting
}: Props) {
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect={null}
            activeStep={0}
            createOrViewRoyalties={null}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { address = "" } = useAccount();
  const { data: profileData } = useGetLensProfiles(
    {
      ownedBy: [address],
      limit: 50
    },
    {
      enabled: !!address
    }
  );

  return (
    <Grid flexDirection="column">
      <Typography>
        For your journey as a seller reputation is key. Boson Protocol allows
        sellers to directly link their Lens profile to their Boson account.{" "}
      </Typography>
      <GridContainer
        itemsPerRow={{
          xs: 2,
          s: 2,
          m: 2,
          l: 2,
          xl: 2
        }}
        style={{ width: "100%", margin: "1rem 0" }}
      >
        <Button theme="white" onClick={() => onChooseCreateNew()}>
          <Grid flexDirection="column" gap="1rem" padding="1rem">
            <LensLogo />
            <Typography>Create new Profile</Typography>
          </Grid>
        </Button>
        {profileData?.items.map((profile) => {
          return (
            <Button
              theme="white"
              onClick={() => onChooseUseExisting(profile as Profile)}
              key={profile.id}
            >
              <Grid flexDirection="column" gap="1rem" padding="1rem">
                <Typography
                  fontWeight="600"
                  $fontSize="1.25rem"
                  lineHeight="150%"
                  style={{
                    wordBreak: "break-all"
                  }}
                >
                  {profile.handle}
                </Typography>
                <Typography>Use existing Lens Profile</Typography>
              </Grid>
            </Button>
          );
        })}
      </GridContainer>
    </Grid>
  );
}
