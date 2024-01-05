import { useAccount } from "lib/utils/hooks/connection/connection";
import { useEffect, useState } from "react";

import { BosonRoutes } from "../../../../../lib/routing/routes";
import { colors } from "../../../../../lib/styles/colors";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useGetLensProfiles from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import GridContainer from "../../../../ui/GridContainer";
import Loading from "../../../../ui/Loading";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import { LensStep } from "./const";
import LensProfileMultiSteps from "./LensProfileMultiSteps";

interface Props {
  onChooseUseExisting: (profile: Profile) => void;
  changeToRegularProfile: () => void;
  isEdit: boolean;
}

export default function ChooseLensProfile({
  changeToRegularProfile,
  onChooseUseExisting,
  isEdit
}: Props) {
  const { account: address = "" } = useAccount();
  const navigate = useKeepQueryParamsNavigate();
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
          <LensProfileMultiSteps
            profileOption={"create"}
            activeStep={LensStep.CHOOSE}
            createOrViewRoyalties={
              alreadyHasRoyaltiesDefined ? "view" : "create"
            }
            key="ChooseLensProfile"
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [cursor, setCursor] = useState<string>();
  const {
    data: profileData,
    isSuccess,
    isFetching
  } = useGetLensProfiles(
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
    <>
      <Grid flexDirection="column">
        <Typography>
          <div>
            You can directly link your Lens profile to your Boson account. If
            you wish to create a Lens profile, please go to{" "}
            <a href="https://claim.lens.xyz/" target="_blank" rel="noopener">
              https://claim.lens.xyz/
            </a>{" "}
            If you already have a Lens profile, they will be shown below.
          </div>
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
          {isFetching ? (
            <Grid>
              <Loading />
            </Grid>
          ) : (
            <>
              {lensProfiles.map((profile, index) => {
                return (
                  <Button
                    themeVal="white"
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
            </>
          )}
        </GridContainer>
        {!isFetching && !lensProfiles.length && (
          <Grid justifyContent="center">
            <Typography $fontSize="0.8rem" color={colors.grey}>
              No Lens profiles found
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid justifyContent="flex-start" gap="2rem" margin="2rem 0 0 0">
        {!isEdit && (
          <Button
            themeVal="orangeInverse"
            type="button"
            onClick={() => navigate({ pathname: BosonRoutes.Root })}
          >
            Back to home page
          </Button>
        )}
        <Button
          onClick={changeToRegularProfile}
          themeVal="blankSecondaryOutline"
        >
          Proceed without Lens
        </Button>
      </Grid>
    </>
  );
}
