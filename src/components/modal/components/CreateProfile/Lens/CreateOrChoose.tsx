import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { ReactComponent as LensLogo } from "../../../../../../src/assets/lens-logo.svg";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useGetLensProfiles from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
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
  const { address = "" } = useAccount();
  const { data: admins } = useSellers(
    {
      admin: address
    },
    {
      enabled: !!address
    }
  );
  const seller = admins?.[0];
  const alreadyHasRoyaltiesDefined = !!seller?.royaltyPercentage;
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
            createOrViewRoyalties={
              alreadyHasRoyaltiesDefined ? "view" : "create"
            }
            key="CreateOrChoose"
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [cursor, setCursor] = useState<string>();
  const { data: profileData, isSuccess } = useGetLensProfiles(
    {
      ownedBy: [address],
      limit: 50,
      ...(cursor && { cursor })
    },
    {
      enabled: !!address
    }
  );

  useEffect(() => {
    if (isSuccess && profileData?.pageInfo.next && !!profileData.items.length) {
      setCursor(profileData.pageInfo.next);
    }
  }, [isSuccess, profileData?.items.length, profileData?.pageInfo.next]);

  const [lensProfiles, setLensProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (profileData?.items.length) {
      setLensProfiles([...(profileData?.items as Profile[])]);
    }
  }, [profileData?.items]);
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
        {lensProfiles.map((profile, index) => {
          return (
            <Button
              theme="white"
              onClick={() => onChooseUseExisting(profile as Profile)}
              key={`lens_profile_${profile.id}_${index}`}
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
