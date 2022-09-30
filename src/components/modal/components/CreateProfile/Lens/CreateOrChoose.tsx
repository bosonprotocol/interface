import { useAccount } from "wagmi";

import { ReactComponent as LensLogo } from "../../../../../../src/assets/lens-logo.svg";
import type { Profile } from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import useGetLensProfiles from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import GridContainer from "../../../../ui/GridContainer";
import Typography from "../../../../ui/Typography";

interface Props {
  onChooseCreateNew: () => void;
  onChooseUseExisting: (profile: Profile) => void;
}

export default function CreateOrChoose({
  onChooseCreateNew,
  onChooseUseExisting
}: Props) {
  const { address = "" } = useAccount();
  const { data: profileData } = useGetLensProfiles(
    {
      ownedBy: [address]
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
        {profileData?.profiles.items.map((profile) => {
          return (
            <Button
              theme="white"
              onClick={() => onChooseUseExisting(profile)}
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
