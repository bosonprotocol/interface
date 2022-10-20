/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@bosonprotocol/react-kit";
import { useField } from "formik";

import { colors } from "../../../../../lib/styles/colors";
import SimpleError from "../../../../error/SimpleError";
import { FormField, Input } from "../../../../form";
import Error from "../../../../form/Error";
import Tooltip from "../../../../tooltip/Tooltip";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";

interface Props {
  onBackClick: () => void;
  alreadyHasRoyaltiesDefined: boolean;
  isError: boolean;
}

export default function BosonAccountFormFields({
  onBackClick,
  alreadyHasRoyaltiesDefined,
  isError
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
      <FormField
        title="Secondary Royalties"
        subTitle="Boson Protocol implements EIP-2981 which enables secondary royalties across NFT marketplaces."
        required
      >
        <Grid flexDirection="column" alignItems="flex-start">
          <Grid>
            <Grid
              style={{
                background: colors.lightGrey,
                border: `1px solid ${colors.border}`
              }}
              gap="0.5rem"
              justifyContent="space-between"
            >
              <Grid flexDirection="column">
                <Input
                  name="secondaryRoyalties"
                  placeholder=""
                  disabled={alreadyHasRoyaltiesDefined}
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
            <Tooltip content="Royalties are limited to 10%" size={16} />
          </Grid>
          <Error
            display={!!metaSecondaryRoyalties.error}
            message={metaSecondaryRoyalties.error}
          />
        </Grid>
      </FormField>
      <FormField
        title="Address for Royalty payment"
        subTitle="This address will receive royalty payments"
      >
        <Input
          name="addressForRoyaltyPayment"
          placeholder="f.e. 0x930fn3jr9dnW..."
          disabled={
            !fieldSecondaryRoyalties.value || alreadyHasRoyaltiesDefined
          }
        />
      </FormField>
      {isError && (
        <Grid margin="0 0 2rem 0">
          <SimpleError>
            <Typography
              fontWeight="600"
              $fontSize="1rem"
              lineHeight="1.5rem"
              style={{ display: "inline-block" }}
            >
              There was an error when fetching your royalties configuration.
            </Typography>
          </SimpleError>
        </Grid>
      )}
      <Grid justifyContent="flex-start" gap="2rem">
        <Button variant="accentInverted" type="button" onClick={onBackClick}>
          Back
        </Button>
        <Button
          variant="primaryFill"
          type="submit"
          disabled={
            !!fieldSecondaryRoyalties.value &&
            !fieldAddressForRoyaltyPayment.value &&
            !alreadyHasRoyaltiesDefined
          }
        >
          Next
        </Button>
      </Grid>
    </>
  );
}
