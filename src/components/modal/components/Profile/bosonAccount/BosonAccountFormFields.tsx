/* eslint-disable @typescript-eslint/no-unused-vars */
import { useField } from "formik";
import styled from "styled-components";

import { colors } from "../../../../../lib/styles/colors";
import SimpleError from "../../../../error/SimpleError";
import { FormField, Input } from "../../../../form";
import Error from "../../../../form/Error";
import BosonButton from "../../../../ui/BosonButton";
import { Grid } from "../../../../ui/Grid";
import { GridContainer } from "../../../../ui/GridContainer";
import { Typography } from "../../../../ui/Typography";

interface Props {
  onBackClick: () => void;
  alreadyHasRoyaltiesDefined: boolean;
  isError: boolean;
  submitButtonText?: string;
  isEdit: boolean;
}
const StyledFormField = styled(FormField)`
  [data-subheader] {
    height: 30px;
  }
`;

const inputHeight = "51px";
export default function BosonAccountFormFields({
  onBackClick,
  alreadyHasRoyaltiesDefined,
  isError,
  submitButtonText,
  isEdit
}: Props) {
  const [
    fieldSecondaryRoyalties,
    metaSecondaryRoyalties,
    helpersSecondaryRoyalties
  ] = useField<number>("secondaryRoyalties");

  const [fieldAddressForRoyaltyPayment, , helpersAddressForRoyaltyPayment] =
    useField<string>("addressForRoyaltyPayment");

  return (
    <>
      <GridContainer
        itemsPerRow={{
          xs: 1,
          s: 2,
          m: 2,
          l: 2,
          xl: 2
        }}
      >
        <StyledFormField
          title="Secondary royalties"
          subTitle="Boson Protocol implements EIP-2981 which enables secondary royalties across NFT marketplaces."
          required
          style={{
            justifyContent: "space-between"
          }}
        >
          <Grid flexDirection="column" alignItems="flex-start">
            <Grid>
              <Grid
                style={{
                  background: colors.lightGrey,
                  border: `1px solid ${colors.border}`,
                  height: inputHeight
                }}
                gap="0.5rem"
                justifyContent="space-between"
              >
                <Grid flexDirection="column">
                  <Input
                    name="secondaryRoyalties"
                    placeholder=""
                    disabled={alreadyHasRoyaltiesDefined || isEdit}
                    style={{
                      border: "none",
                      textAlign: "right"
                    }}
                    hideError
                    type="number"
                    step="0.01"
                    onChange={(event) => {
                      if (!event.target.valueAsNumber) {
                        helpersAddressForRoyaltyPayment.setValue("");
                      }
                      helpersSecondaryRoyalties.setValue(
                        event.target.valueAsNumber
                      );
                    }}
                  />
                </Grid>
                <div style={{ padding: "1rem" }}>%</div>
              </Grid>
            </Grid>
            <Error
              display={!!metaSecondaryRoyalties.error}
              message={metaSecondaryRoyalties.error}
            />
          </Grid>
        </StyledFormField>
        <StyledFormField
          title="Address for royalty payments"
          subTitle="This address will receive royalty payments"
          required={!!fieldSecondaryRoyalties.value}
        >
          <>
            <Input
              name="addressForRoyaltyPayment"
              placeholder="f.e. 0x930fn3jr9dnW..."
              style={{ height: inputHeight }}
              disabled={
                !fieldSecondaryRoyalties.value || alreadyHasRoyaltiesDefined
              }
            />
          </>
        </StyledFormField>
      </GridContainer>
      {isError && (
        <Grid margin="0 0 2rem 0">
          <SimpleError>
            <Typography
              fontWeight="600"
              fontSize="1rem"
              lineHeight="1.5rem"
              style={{ display: "inline-block" }}
            >
              There was an error when fetching your royalties configuration.
            </Typography>
          </SimpleError>
        </Grid>
      )}
      <Grid justifyContent="flex-start" gap="2rem">
        <BosonButton
          variant="accentInverted"
          type="button"
          onClick={onBackClick}
        >
          Back
        </BosonButton>
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={
            !!fieldSecondaryRoyalties.value &&
            !fieldAddressForRoyaltyPayment.value &&
            !alreadyHasRoyaltiesDefined
          }
        >
          {submitButtonText ?? "Next"}
        </BosonButton>
      </Grid>
    </>
  );
}
