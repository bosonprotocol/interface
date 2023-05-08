import { Warning } from "phosphor-react";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../../lib/config";
import { colors } from "../../../../../lib/styles/colors";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useCreateSellerFromValues from "../../../../../lib/utils/hooks/seller/useCreateSellerFromValues";
import useUpdateSeller from "../../../../../lib/utils/hooks/seller/useUpdateSeller";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import { getIpfsGatewayUrl } from "../../../../../lib/utils/ipfs";
import Collapse from "../../../../collapse/Collapse";
import SimpleError from "../../../../error/SimpleError";
import { Spinner } from "../../../../loading/Spinner";
import SuccessTransactionToast from "../../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import { BosonAccount } from "../bosonAccount/validationSchema";
import { ProfileType } from "../const";
import { authTokenTypes, LensStep } from "./const";
import LensProfileMultiSteps from "./LensProfileMultiSteps";
import { LensProfileType } from "./validationSchema";

interface Props {
  profile?: Profile | null;
  values: LensProfileType;
  bosonAccount: BosonAccount;
  isEdit: boolean;
  onSubmit: (id: string) => void;
  setStepBasedOnIndex: (lensStep: LensStep) => void;
}
export default function CreateBosonLensAccountSummary({
  profile,
  values,
  bosonAccount,
  isEdit,
  onSubmit,
  setStepBasedOnIndex
}: Props) {
  const logo = values?.logo?.[0];
  const cover = values?.coverPicture?.[0];
  const logoImage = getIpfsGatewayUrl(logo?.src || "");
  const coverPicture = getIpfsGatewayUrl(cover?.src || "");

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
  } = useCreateSellerFromValues();
  const {
    isLoading: isUpdatingSellerAccount,
    mutateAsync: updateSeller,
    isError: isUpdateSellerError
  } = useUpdateSeller();
  const { updateProps, store } = useModal();
  useEffect(() => {
    if (isEdit) {
      updateProps<"EDIT_PROFILE">({
        ...store,
        modalProps: {
          ...store.modalProps,
          headerComponent: (
            <LensProfileMultiSteps
              profileOption={"edit"}
              activeStep={LensStep.SUMMARY}
              createOrViewRoyalties={
                alreadyHasRoyaltiesDefined ? "view" : "create"
              }
              setStepBasedOnIndex={setStepBasedOnIndex}
            />
          )
        }
      });
      return;
    }
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <LensProfileMultiSteps
            profileOption={"create"}
            activeStep={LensStep.SUMMARY}
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

  const onSubmitWithArgs = useCallback(
    (action: string, id?: string) => {
      toast((t) => <SuccessTransactionToast t={t} action={action} />);
      onSubmit(id || "");
    },
    [onSubmit]
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

                <Grid gap="1rem" justifyContent="flex-start">
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
                      Contact E-Mail *
                    </Typography>
                    <Typography
                      fontWeight="400"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      {values.email}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid gap="1rem" justifyContent="flex-start">
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
                      Choose a communication channel *
                    </Typography>
                    <Typography
                      fontWeight="400"
                      $fontSize="0.75rem"
                      lineHeight="1.125rem"
                    >
                      {values.contactPreference.label}
                    </Typography>
                  </Grid>
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

        {(isUpdateSellerError || isCreateSellerError) && (
          <SimpleError>
            <Typography
              fontWeight="600"
              $fontSize="1rem"
              lineHeight="1.5rem"
              style={{ display: "inline-block" }}
            >
              There has been an error{" "}
              {isUpdateSellerError
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

        <CTAs
          hasLensHandle={!!profile}
          hasAdminSellerAccount={hasAdminSellerAccount}
          hasLensHandleLinked={hasLensHandleLinked}
          createSellerAccount={() =>
            createSellerAccount({
              values,
              bosonAccount,
              authTokenId: profile?.id,
              authTokenType: authTokenTypes.LENS,
              kind: ProfileType.LENS
            })
          }
          updateSellerAccount={async () =>
            updateSeller({
              admin: address || "",
              clerk: seller?.clerk || "",
              assistant: seller?.assistant || "",
              treasury: seller?.treasury || "",
              authTokenId: profile?.id,
              authTokenType: authTokenTypes.LENS,
              sellerId: seller?.id || "0",
              metadataUri: seller?.metadataUri || ""
            })
          }
          isCreatedSellerAccount={isCreatedSellerAccount}
          isCreatingSellerAccount={isCreatingSellerAccount}
          isUpdatingSellerAccount={isUpdatingSellerAccount}
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
    ReturnType<typeof useCreateSellerFromValues>["mutateAsync"]
  >;
  updateSellerAccount: () => ReturnType<
    ReturnType<typeof useUpdateSeller>["mutateAsync"]
  >;
  isCreatedSellerAccount: boolean;
  isCreatingSellerAccount: boolean;
  isUpdatingSellerAccount: boolean;
  onSubmit: (action: string, id?: string) => void;
}

function CTAs({
  hasLensHandle,
  hasAdminSellerAccount,
  hasLensHandleLinked,
  createSellerAccount,
  updateSellerAccount,
  isCreatedSellerAccount,
  isCreatingSellerAccount,
  isUpdatingSellerAccount,
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
