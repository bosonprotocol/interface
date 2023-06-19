import { Warning } from "phosphor-react";
import { useState } from "react";

import { CONFIG } from "../../../../../lib/config";
import { colors } from "../../../../../lib/styles/colors";
import useCreateSellerFromValues from "../../../../../lib/utils/hooks/seller/useCreateSellerFromValues";
import { getIpfsGatewayUrl } from "../../../../../lib/utils/ipfs";
import Collapse from "../../../../collapse/Collapse";
import SimpleError from "../../../../error/SimpleError";
import { Spinner } from "../../../../loading/Spinner";
import { CreateProfile } from "../../../../product/utils";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { BosonAccount } from "../bosonAccount/validationSchema";
import { ProfileType } from "../const";

interface Props {
  values: CreateProfile;
  bosonAccount: BosonAccount;
  onSubmit: (createdSellerId: string) => Promise<void>;
}

export default function RegularProfileSummary({
  values,
  bosonAccount,
  onSubmit
}: Props) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const logo = values?.logo?.[0];
  const cover = values?.coverPicture?.[0];
  const logoImage = getIpfsGatewayUrl(logo?.src || "");
  const coverPicture = getIpfsGatewayUrl(cover?.src || "");
  const {
    isSuccess: isCreatedSellerAccount,
    isLoading: isCreatingSellerAccount,
    isError: isCreateSellerError,
    mutateAsync: createSeller
  } = useCreateSellerFromValues();

  return (
    <>
      <Typography $fontSize="2rem" fontWeight="600">
        Confirm Profile Information
      </Typography>
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
                  Profile
                </Typography>
              }
            >
              <Grid
                flexDirection="column"
                alignItems="flex-start"
                gap="1.625rem"
              >
                <Grid alignItems="flex-start">
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.375rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="0.75rem"
                      lineHeight="1.5rem"
                    >
                      Logo / profile picture *
                    </Typography>
                    <img
                      src={logoImage}
                      style={{
                        maxHeight: "80px",
                        maxWidth: "80px",
                        objectFit: "contain"
                      }}
                    />
                  </Grid>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.375rem"
                  >
                    <Typography
                      fontWeight="600"
                      $fontSize="0.75rem"
                      lineHeight="1.5rem"
                    >
                      Cover picture *
                    </Typography>
                    <img
                      src={coverPicture}
                      style={{
                        maxHeight: "80px",
                        maxWidth: "300px",
                        objectFit: "contain"
                      }}
                    />
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
                      Contact email *
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
                      Website / Social media link *
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
                    Secondary royalties *
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
                    Address for royalty payments{" "}
                    {(bosonAccount.secondaryRoyalties || 0) > 0 ? "*" : ""}
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
              Royalty share and payment information cannot be changed after
              creating your seller account. Profile information can be edited or
              changed at anytime.
            </Typography>
          </Grid>
        </Grid>
        <>
          {isCreateSellerError && (
            <SimpleError>
              <Typography
                fontWeight="600"
                $fontSize="1rem"
                lineHeight="1.5rem"
                style={{ display: "inline-block" }}
              >
                There has been an error while creating your seller account,
                please contact us on
                <a href={`mailto:${CONFIG.defaultSupportEmail}`}>
                  {" "}
                  {CONFIG.defaultSupportEmail}{" "}
                </a>
                to explain your issue
              </Typography>
            </SimpleError>
          )}
        </>
        <Grid justifyContent="center" gap="2.5rem">
          <BosonButton
            variant="primaryFill"
            onClick={async () => {
              setSubmitting(true);
              try {
                const data = await createSeller({
                  values,
                  bosonAccount,
                  kind: ProfileType.REGULAR
                });

                const createdSellerId = (data || "") as string;
                await onSubmit(createdSellerId);
              } catch (error) {
                console.error(error);
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={
              isCreatingSellerAccount || isCreatedSellerAccount || submitting
            }
          >
            <Grid gap="1.0625rem">
              <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
                Create Seller Account
              </Typography>
              {(isCreatingSellerAccount || submitting) && <Spinner size={15} />}
            </Grid>
          </BosonButton>
        </Grid>
      </Grid>
    </>
  );
}
