import { Warning } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../../lib/config";
import { colors } from "../../../../../lib/styles/colors";
import { loadAndSetImage } from "../../../../../lib/utils/base64";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useCustomCreateLensProfile from "../../../../../lib/utils/hooks/lens/profile/useCustomCreateLensProfile";
import useCreateSeller from "../../../../../lib/utils/hooks/offer/useCreateSeller";
import useUpdateSeller from "../../../../../lib/utils/hooks/offer/useUpdateSeller";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import Collapse from "../../../../collapse/Collapse";
import SimpleError from "../../../../error/SimpleError";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import { authTokenTypes } from "./const";
import ProfileMultiSteps from "./ProfileMultiSteps";
import { BosonAccount, LensProfileType } from "./validationSchema";

interface Props {
  profile?: Profile | null;
  values: LensProfileType;
  bosonAccount: BosonAccount;
  onSubmit: (profile: Profile, bosonAccount: BosonAccount) => void;
}

export default function CreateBosonLensAccountSummary({
  profile,
  values,
  bosonAccount,
  onSubmit
}: Props) {
  const isExistingLensAccount = !!profile;
  const [lensProfileToSubmit, setLensProfileToSubmit] = useState<
    Profile | null | undefined
  >(profile);
  const [logoImage, setLogoImage] = useState<string>("");
  const [coverPicture, setCoverPicture] = useState<string>("");
  const [isCreatedLensProfile, setCreatedLensProfile] =
    useState<boolean>(false);

  const usingExistingLensProfile = !!profile;
  const { address } = useAccount();
  const { data: admins } = useSellers({
    admin: address
  });
  const seller = admins?.[0];
  const hasAdminSellerAccount = !!seller;
  const hasLensHandleLinked = seller?.authTokenType === authTokenTypes.Lens;
  const alreadyHasRoyaltiesDefined = false; // TODO: seller.royalties;
  const {
    isFetched: isCreatedSellerAccount,
    isLoading: isCreatingSellerAccount,
    refetch: createSellerAccountWithArgs
  } = useCreateSeller(
    {
      address: address || "",
      royaltyPercentage: bosonAccount.secondaryRoyalties || 0,
      addressForRoyaltyPayment: bosonAccount.addressForRoyaltyPayment || "",
      lensValues: values,
      authTokenId: lensProfileToSubmit?.id,
      authTokenType: authTokenTypes.Lens
    },
    {
      enabled: false
    }
  );
  const {
    isFetched: isUpdatedSellerAccount,
    isLoading: isUpdatingSellerAccount,
    refetch: updateSellerAccountWithArgs,
    isError: isUpdateSellerError
  } = useUpdateSeller(
    {
      admin: address || "",
      clerk: seller?.clerk || "",
      operator: seller?.operator || "",
      treasury: seller?.treasury || "",
      authTokenId: lensProfileToSubmit?.id,
      authTokenType: authTokenTypes.Lens,
      sellerId: seller?.id || "0"
    },
    {
      enabled: false
    }
  );
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect={isExistingLensAccount ? "select" : "create"}
            activeStep={3}
            createOrViewRoyalties={
              alreadyHasRoyaltiesDefined ? "view" : "create"
            }
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    create: createLensProfile,
    isLoading: isCreatingLensProfile,
    isError: isCreateLensError
  } = useCustomCreateLensProfile({
    values: values,
    onCreatedProfile: (profile: Profile) => {
      setLensProfileToSubmit(profile);
      setCreatedLensProfile(true);
    },
    enabled: !usingExistingLensProfile && !!values
  });

  useEffect(() => {
    if (values.logo?.length) {
      loadAndSetImage(values.logo[0], setLogoImage);
    }
  }, [values.logo]);
  useEffect(() => {
    if (values.coverPicture?.length) {
      loadAndSetImage(values.coverPicture[0], setCoverPicture);
    }
  }, [values.coverPicture]);

  const onSubmitWithArgs = useCallback(() => {
    if (!lensProfileToSubmit) {
      console.error("Lens profile is falsy onSubmit, not calling onSubmit...");
      return;
    }
    onSubmit(lensProfileToSubmit, bosonAccount);
  }, [bosonAccount, lensProfileToSubmit, onSubmit]);
  return (
    <>
      <div>
        For your journey as a seller reputation is key. Boson Protocol allows
        sellers to directly link their Lens profile to their Boson account.
      </div>
      <Grid flexDirection="column" gap="2.625rem">
        <Grid flexDirection="column" gap="1rem">
          <Grid
            style={{ background: colors.lightGrey }}
            flexDirection="column"
            padding="1.5rem 2.5rem"
          >
            <Collapse
              title={
                <Typography
                  fontWeight="600"
                  $fontSize="1.25rem"
                  lineHeight="1.875rem"
                >
                  Lens Profile
                </Typography>
              }
            >
              <Grid
                flexDirection="column"
                alignItems="flex-start"
                gap="1.625rem"
              >
                <Grid>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.375rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="1rem"
                      lineHeight="1.5rem"
                    >
                      Logo / profile picture *
                    </Typography>
                    <img src={logoImage} height="50px" />
                  </Grid>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.375rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="1rem"
                      lineHeight="1.5rem"
                    >
                      Cover Picture *
                    </Typography>
                    <img src={coverPicture} height="50px" />
                  </Grid>
                </Grid>

                <Grid gap="1rem">
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.25rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      Your brand / name *
                    </Typography>
                    <Typography
                      fontWeight="400"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      {values.name}
                    </Typography>
                  </Grid>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.25rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      Lens Handle *
                    </Typography>
                    <Typography
                      fontWeight="400"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      {values.handle}
                    </Typography>
                  </Grid>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.25rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      Contact E-Mail
                    </Typography>
                    <Typography
                      fontWeight="400"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      {values.email}
                    </Typography>
                  </Grid>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.25rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      Website / Social media link
                    </Typography>
                    <Typography
                      fontWeight="400"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      {values.website}
                    </Typography>
                  </Grid>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.25rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      Legal trading name
                    </Typography>
                    <Typography
                      fontWeight="400"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      {values.legalTradingName}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  flexDirection="column"
                  alignItems="flex-start"
                  gap="0.25rem"
                >
                  <Typography
                    fontWeight="600"
                    $fontSize="0.75rem"
                    lineHeight="1.125rem"
                  >
                    Description *
                  </Typography>
                  <Typography
                    fontWeight="400"
                    $fontSize="0.75rem"
                    lineHeight="1.125rem"
                  >
                    {values.description}
                  </Typography>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
          <Grid
            style={{ background: colors.lightGrey }}
            flexDirection="column"
            padding="1.5rem 2.5rem"
          >
            <Collapse
              title={
                <Typography
                  fontWeight="600"
                  $fontSize="1.25rem"
                  lineHeight="1.875rem"
                >
                  Boson Account
                </Typography>
              }
            >
              <Grid justifyContent="flex-start">
                <Grid
                  flexDirection="column"
                  alignItems="flex-start"
                  gap="0.25rem"
                >
                  <Typography
                    fontWeight="600"
                    $fontSize="0.75rem"
                    lineHeight="1.125rem"
                  >
                    Secondary Royalties
                  </Typography>
                  <Typography
                    fontWeight="400"
                    $fontSize="0.75rem"
                    lineHeight="1.875rem"
                  >
                    {bosonAccount.secondaryRoyalties}%
                  </Typography>
                </Grid>
                <Grid
                  flexDirection="column"
                  alignItems="flex-start"
                  gap="0.25rem"
                >
                  <Typography
                    fontWeight="600"
                    $fontSize="0.75rem"
                    lineHeight="1.125rem"
                  >
                    Address for royalty payments
                  </Typography>
                  <Typography
                    fontWeight="400"
                    $fontSize="0.75rem"
                    lineHeight="1.875rem"
                  >
                    {bosonAccount.addressForRoyaltyPayment} &nbsp;
                  </Typography>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
        <Grid
          style={{ background: colors.black }}
          padding="1.625rem"
          gap="1rem"
          alignItems="flex-start"
        >
          <Warning size={20} color={colors.green} />
          <Grid flexDirection="column" alignItems="flex-start" gap="0.5rem">
            <Typography
              fontWeight="600"
              $fontSize="1rem"
              lineHeight="1.5rem"
              color={colors.white}
            >
              You wont be able to make changes after confirming
            </Typography>
            <Typography
              fontWeight="400"
              $fontSize="1rem"
              lineHeight="1.5rem"
              color={colors.lightGrey}
            >
              By selecting confirm, you agree to pay the above fees, accept the
              Boson seller agreement and Payments Terms of Use, acknowledge
              reading the User Privacy Notice and assume full responsibility for
              the item offered and the content of your listing.
            </Typography>
          </Grid>
        </Grid>
        {(isCreateLensError || isUpdateSellerError) && (
          <SimpleError
            errorMessage={`There has been an error while creating your Lens profile, please
          contact us on ${
            CONFIG || "testing-dispute-resolver@redeemeum.com"
          } to explain your issue`}
          ></SimpleError>
        )}
        <CTAs
          hasLensHandle={!!lensProfileToSubmit}
          hasAdminSellerAccount={hasAdminSellerAccount}
          hasLensHandleLinked={hasLensHandleLinked}
          createSellerAccount={createSellerAccountWithArgs}
          createLensProfile={createLensProfile}
          updateSellerAccount={updateSellerAccountWithArgs}
          isCreatedSellerAccount={isCreatedSellerAccount}
          isCreatingSellerAccount={isCreatingSellerAccount}
          isCreatingLensProfile={isCreatingLensProfile}
          isCreatedLensProfile={isCreatedLensProfile}
          isUpdatingSellerAccount={isUpdatingSellerAccount}
          isUpdatedSellerAccount={isUpdatedSellerAccount}
          onSubmit={onSubmitWithArgs}
        />
      </Grid>
    </>
  );
}

interface CTAsProps {
  hasLensHandle: boolean;
  hasAdminSellerAccount: boolean;
  hasLensHandleLinked: boolean;
  createSellerAccount: () => Promise<unknown>;
  createLensProfile: () => void;
  updateSellerAccount: () => Promise<unknown>;
  isCreatedSellerAccount: boolean;
  isCreatingSellerAccount: boolean;
  isCreatingLensProfile: boolean;
  isCreatedLensProfile: boolean;
  isUpdatingSellerAccount: boolean;
  isUpdatedSellerAccount: boolean;
  onSubmit: () => void;
}

function CTAs({
  hasLensHandle,
  hasAdminSellerAccount,
  hasLensHandleLinked,
  createSellerAccount,
  createLensProfile,
  updateSellerAccount,
  isCreatedSellerAccount,
  isCreatingSellerAccount,
  isCreatingLensProfile,
  isCreatedLensProfile,
  isUpdatingSellerAccount,
  isUpdatedSellerAccount,
  onSubmit
}: CTAsProps) {
  switch (true) {
    case hasLensHandle && !hasAdminSellerAccount:
      return (
        <Grid justifyContent="center" gap="2.5rem">
          <Button
            theme="primary"
            onClick={async () => {
              await createSellerAccount();
            }}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Seller Account
              </Typography>
            </Grid>
          </Button>
        </Grid>
      );
    case !hasLensHandle && !hasAdminSellerAccount:
      return (
        <Grid justifyContent="center" gap="2.5rem">
          <Button
            theme="primary"
            onClick={() => {
              createLensProfile();
            }}
            disabled={isCreatingLensProfile || isCreatedLensProfile}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Lens Profile
              </Typography>
              <Typography
                fontWeight="600"
                $fontSize="0.75rem"
                lineHeight="1.125rem"
                opacity="0.5"
              >
                Step 1/3
              </Typography>
            </Grid>
          </Button>
          <Button
            theme="primary"
            onClick={async () => {
              await createSellerAccount();
            }}
            disabled={
              isCreatingSellerAccount ||
              isCreatedSellerAccount ||
              isCreatingLensProfile
            }
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Seller Account
              </Typography>
              <Typography
                fontWeight="600"
                $fontSize="0.75rem"
                lineHeight="1.125rem"
                opacity="0.5"
              >
                Step 2/3
              </Typography>
            </Grid>
          </Button>
        </Grid>
      );
    case !hasLensHandle && hasAdminSellerAccount:
      return (
        <Grid justifyContent="center" gap="2.5rem">
          <Button
            theme="primary"
            onClick={() => {
              createLensProfile();
            }}
            disabled={isCreatingLensProfile || isCreatedLensProfile}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Lens Profile
              </Typography>
              <Typography
                fontWeight="600"
                $fontSize="0.75rem"
                lineHeight="1.125rem"
                opacity="0.5"
              >
                Step 1/2
              </Typography>
            </Grid>
          </Button>
          <Button
            theme="primary"
            disabled={
              isUpdatingSellerAccount ||
              isUpdatedSellerAccount ||
              !isCreatedLensProfile
            }
            onClick={async () => {
              await updateSellerAccount();
              onSubmit();
            }}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Update Seller Account
              </Typography>
              <Typography
                fontWeight="600"
                $fontSize="0.75rem"
                lineHeight="1.125rem"
                opacity="0.5"
              >
                Step 2/2
              </Typography>
            </Grid>
          </Button>
        </Grid>
      );
    case hasLensHandle && hasAdminSellerAccount && !hasLensHandleLinked:
      return (
        <Grid justifyContent="center" gap="2.5rem">
          <Button
            theme="primary"
            onClick={async () => {
              await updateSellerAccount();
              onSubmit();
            }}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Update Seller Account
              </Typography>
            </Grid>
          </Button>
        </Grid>
      );
    default:
      return <></>;
  }
}
