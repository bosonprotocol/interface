import { Warning } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../../lib/config";
import { colors } from "../../../../../lib/styles/colors";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useCustomCreateLensProfileMumbai from "../../../../../lib/utils/hooks/lens/profile/useCustomCreateLensProfileMumbai";
import useCustomCreateLensProfilePolygon from "../../../../../lib/utils/hooks/lens/profile/useCustomCreateLensProfilePolygon";
import useCreateSeller from "../../../../../lib/utils/hooks/offer/useCreateSeller";
import useUpdateSeller from "../../../../../lib/utils/hooks/offer/useUpdateSeller";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import Collapse from "../../../../collapse/Collapse";
import SimpleError from "../../../../error/SimpleError";
import { Spinner } from "../../../../loading/Spinner";
import SuccessTransactionToast from "../../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import { BosonAccount } from "../bosonAccount/validationSchema";
import { authTokenTypes } from "./const";
import ProfileMultiSteps from "./ProfileMultiSteps";
import { LensProfileType } from "./validationSchema";

interface Props {
  profile?: Profile | null;
  values: LensProfileType;
  bosonAccount: BosonAccount;
  onSubmit: (id: string, lensProfile: Profile | null | undefined) => void;
  setStepBasedOnIndex: (index: number) => void;
}

export default function CreateBosonLensAccountSummary({
  profile,
  values,
  bosonAccount,
  onSubmit,
  setStepBasedOnIndex
}: Props) {
  const logoImage = values?.logo?.[0]?.src || "";
  const coverPicture = values?.coverPicture?.[0]?.src || "";
  const isExistingLensAccount = !!profile;
  const [lensProfileToSubmit, setLensProfileToSubmit] = useState<
    Profile | null | undefined
  >(profile);
  const [isCreatedLensProfile, setCreatedLensProfile] =
    useState<boolean>(false);

  const usingExistingLensProfile = !!profile;
  const { address } = useAccount();
  const { data: admins } = useSellers(
    {
      admin: address
    },
    {
      enabled: !!address
    }
  );
  const seller = admins?.[0];
  const hasAdminSellerAccount = !!seller;
  const hasLensHandleLinked = seller?.authTokenType === authTokenTypes.LENS;
  const alreadyHasRoyaltiesDefined = !!seller?.royaltyPercentage;
  const {
    isSuccess: isCreatedSellerAccount,
    isLoading: isCreatingSellerAccount,
    mutateAsync: createSellerAccount,
    isError: isCreateSellerError
  } = useCreateSeller();
  const {
    isSuccess: isUpdatedSellerAccount,
    isLoading: isUpdatingSellerAccount,
    mutateAsync: updateSeller,
    isError: isUpdateSellerError
  } = useUpdateSeller();
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
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useCreateFunc =
    CONFIG.chainId === 137
      ? useCustomCreateLensProfilePolygon
      : useCustomCreateLensProfileMumbai;

  const {
    create: createLensProfile,
    isLoading: isCreatingLensProfile,
    isError: isCreateLensError,

    isHandleTakenError,
    isSetLensProfileMetadataError
  } = useCreateFunc({
    values: values,
    onCreatedProfile: (profile: Profile) => {
      setLensProfileToSubmit(profile);
      setCreatedLensProfile(true);
    },
    enabled: !usingExistingLensProfile && !!values
  });

  const onSubmitWithArgs = useCallback(
    (action: string, id?: string) => {
      toast((t) => <SuccessTransactionToast t={t} action={action} />);
      onSubmit(id || "", lensProfileToSubmit);
    },
    [onSubmit, lensProfileToSubmit]
  );
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
        <>
          {isHandleTakenError && (
            <SimpleError
              errorMessage={`The handle you chose before has just been taken, please go back and select another one`}
            ></SimpleError>
          )}
          {isSetLensProfileMetadataError && (
            <SimpleError>
              <Typography
                fontWeight="600"
                $fontSize="1rem"
                lineHeight="1.5rem"
                style={{ display: "inline-block" }}
              >
                There has been an error while setting the metadata to your Lens
                profile, please edit via the Lens application on{" "}
                <a
                  href={`https://www.lensfrens.xyz/${values.handle}/edit`}
                  target="_blank"
                >
                  https://www.lensfrens.xyz/{values.handle}/edit
                </a>
              </Typography>
            </SimpleError>
          )}
          {(isCreateLensError || isUpdateSellerError || isCreateSellerError) &&
            !isHandleTakenError &&
            !isSetLensProfileMetadataError && (
              <SimpleError>
                <Typography
                  fontWeight="600"
                  $fontSize="1rem"
                  lineHeight="1.5rem"
                  style={{ display: "inline-block" }}
                >
                  There has been an error{" "}
                  {isCreateLensError
                    ? "while creating your Lens profile"
                    : isUpdateSellerError
                    ? "while updating your seller account"
                    : isCreateSellerError
                    ? "while creating your seller account"
                    : ""}
                  , please contact us on
                  <a href={`mailto:${CONFIG.defaultSupportEmail}`}>
                    {" "}
                    {CONFIG.defaultSupportEmail}{" "}
                  </a>
                  to explain your issue
                </Typography>
              </SimpleError>
            )}
        </>
        <CTAs
          hasLensHandle={!!lensProfileToSubmit}
          hasAdminSellerAccount={hasAdminSellerAccount}
          hasLensHandleLinked={hasLensHandleLinked}
          createSellerAccount={() =>
            createSellerAccount({
              address: address || "",
              royaltyPercentage: bosonAccount.secondaryRoyalties || 0,
              addressForRoyaltyPayment:
                bosonAccount.addressForRoyaltyPayment || "",
              name: values.name,
              description: values.description,
              authTokenId: lensProfileToSubmit?.id,
              authTokenType: authTokenTypes.LENS,
              profileLogoUrl: logoImage
            })
          }
          createLensProfile={createLensProfile}
          updateSellerAccount={() =>
            updateSeller({
              admin: address || "",
              clerk: seller?.clerk || "",
              assistant: seller?.assistant || "",
              treasury: seller?.treasury || "",
              authTokenId: lensProfileToSubmit?.id,
              authTokenType: authTokenTypes.LENS,
              sellerId: seller?.id || "0"
            })
          }
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
  createSellerAccount: () => ReturnType<
    ReturnType<typeof useCreateSeller>["mutateAsync"]
  >;
  createLensProfile: () => void;
  updateSellerAccount: () => ReturnType<
    ReturnType<typeof useUpdateSeller>["mutateAsync"]
  >;
  isCreatedSellerAccount: boolean;
  isCreatingSellerAccount: boolean;
  isCreatingLensProfile: boolean;
  isCreatedLensProfile: boolean;
  isUpdatingSellerAccount: boolean;
  isUpdatedSellerAccount: boolean;
  onSubmit: (action: string, id?: string) => void;
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
          <BosonButton
            variant="primaryFill"
            onClick={async () => {
              const data = await createSellerAccount();
              const createdSellerId = (data || "") as string;
              onSubmit("Create Seller Account", createdSellerId);
            }}
            disabled={isCreatingSellerAccount || isCreatedSellerAccount}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Seller Account
              </Typography>
              {isCreatingSellerAccount && <Spinner size={15} />}
            </Grid>
          </BosonButton>
        </Grid>
      );
    case !hasLensHandle && !hasAdminSellerAccount:
      return (
        <Grid justifyContent="center" gap="2.5rem">
          <BosonButton
            variant="primaryFill"
            onClick={() => {
              createLensProfile();
            }}
            disabled={isCreatingLensProfile || isCreatedLensProfile}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Lens Profile
              </Typography>
              {isCreatingLensProfile ? (
                <Spinner size={15} />
              ) : (
                <Typography
                  fontWeight="600"
                  $fontSize="0.75rem"
                  lineHeight="1.125rem"
                  opacity="0.5"
                >
                  Step 1/2
                </Typography>
              )}
            </Grid>
          </BosonButton>
          <BosonButton
            variant="primaryFill"
            onClick={async () => {
              const data = await createSellerAccount();
              const createdSellerId = (data || "") as string;
              onSubmit("Create Seller Account", createdSellerId);
            }}
            disabled={
              isCreatingSellerAccount ||
              isCreatedSellerAccount ||
              isCreatingLensProfile ||
              !isCreatedLensProfile
            }
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Seller Account
              </Typography>
              {isCreatingSellerAccount ? (
                <Spinner size={15} />
              ) : (
                <Typography
                  fontWeight="600"
                  $fontSize="0.75rem"
                  lineHeight="1.125rem"
                  opacity="0.5"
                >
                  Step 2/2
                </Typography>
              )}
            </Grid>
          </BosonButton>
        </Grid>
      );
    case !hasLensHandle && hasAdminSellerAccount:
      return (
        <Grid justifyContent="center" gap="2.5rem">
          <BosonButton
            variant="primaryFill"
            onClick={() => {
              createLensProfile();
            }}
            disabled={isCreatingLensProfile || isCreatedLensProfile}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Lens Profile
              </Typography>
              {isCreatingLensProfile ? (
                <Spinner size={15} />
              ) : (
                <Typography
                  fontWeight="600"
                  $fontSize="0.75rem"
                  lineHeight="1.125rem"
                  opacity="0.5"
                >
                  Step 1/2
                </Typography>
              )}
            </Grid>
          </BosonButton>
          <BosonButton
            variant="primaryFill"
            disabled={
              isUpdatingSellerAccount ||
              isUpdatedSellerAccount ||
              !isCreatedLensProfile
            }
            onClick={async () => {
              await updateSellerAccount();
              onSubmit("Update Seller Account");
            }}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Update Seller Account
              </Typography>
              {isUpdatingSellerAccount ? (
                <Spinner size={15} />
              ) : (
                <Typography
                  fontWeight="600"
                  $fontSize="0.75rem"
                  lineHeight="1.125rem"
                  opacity="0.5"
                >
                  Step 2/2
                </Typography>
              )}
            </Grid>
          </BosonButton>
        </Grid>
      );
    case hasLensHandle && hasAdminSellerAccount && !hasLensHandleLinked:
      return (
        <Grid justifyContent="center" gap="2.5rem">
          <BosonButton
            variant="primaryFill"
            onClick={async () => {
              await updateSellerAccount();
              onSubmit("Update Seller Account");
            }}
            disabled={isUpdatingSellerAccount}
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Update Seller Account
              </Typography>
              {isUpdatingSellerAccount && <Spinner size={15} />}
            </Grid>
          </BosonButton>
        </Grid>
      );
    default:
      return <></>;
  }
}
