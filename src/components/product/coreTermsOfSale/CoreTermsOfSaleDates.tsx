import { Datepicker, FormField, Input } from "components/form";
import { Select } from "components/form/Select";
import { SwitchForm } from "components/form/Switch";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import { useForm } from "lib/utils/hooks/useForm";
import React, { useEffect } from "react";

import { OPTIONS_PERIOD } from "../utils";

interface CoreTermsOfSaleDatesProps {
  prefix: "variantsCoreTermsOfSale" | "coreTermsOfSale";
}
const gridProps = {
  justifyContent: "flex-end"
} as const;
export const CoreTermsOfSaleDates: React.FC<CoreTermsOfSaleDatesProps> = ({
  prefix
}) => {
  const { values, setFieldValue } = useForm();
  const fixedPrefix = `${prefix}.`;
  const infiniteExpirationOffers = !!values[prefix].infiniteExpirationOffers;
  useEffect(() => {
    if (!infiniteExpirationOffers) {
      setFieldValue(`${fixedPrefix}voucherValidDurationInDays`, undefined);
    }
  }, [infiniteExpirationOffers, setFieldValue, fixedPrefix]);
  return (
    <>
      <FormField
        title="Offer validity period"
        required
        subTitle="The offer validity period is the time in which buyers can commit to your offer."
        titleIcon={
          <SwitchForm
            name={`${fixedPrefix}infiniteExpirationOffers`}
            gridProps={gridProps}
            leftChildren
            label={() => (
              <Typography
                color={colors.secondary}
                $fontSize="0.8rem"
                cursor="pointer"
              >
                {infiniteExpirationOffers
                  ? "Offers with no expiration date"
                  : "Offers with expiration date"}
              </Typography>
            )}
          />
        }
      >
        <Datepicker
          key={infiniteExpirationOffers + "offerValidityPeriod"}
          name={`${fixedPrefix}offerValidityPeriod`}
          period={!infiniteExpirationOffers}
          selectTime
          minDate={null}
        />
      </FormField>
      <FormField
        title="Redemption period"
        required
        subTitle="The redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Grid gap="1rem" flexDirection="column" alignItems="flex-start">
          <Grid flexDirection="column" alignItems="flex-start">
            <Datepicker
              key={infiniteExpirationOffers + "redemptionPeriod"}
              name={`${fixedPrefix}redemptionPeriod`}
              period={!infiniteExpirationOffers}
              selectTime
              minDate={null}
              isClearable={infiniteExpirationOffers}
              placeholder={
                infiniteExpirationOffers ? "Redeemption start date" : undefined
              }
            />
          </Grid>
          {infiniteExpirationOffers && (
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography tag="p">
                Enter the amount of days the buyer will be able to redeem from,
                either the commit date or the redemption start date (if
                specified).
              </Typography>
              <Grid gap="1rem" alignItems="flex-start">
                <Grid flexDirection="column" alignItems="flex-start">
                  <Input
                    name={`${fixedPrefix}voucherValidDurationInDays`}
                    type="number"
                    min={0}
                  />
                </Grid>
                <Select options={OPTIONS_PERIOD} value={OPTIONS_PERIOD[0]} />
              </Grid>
            </Grid>
          )}
        </Grid>
      </FormField>
    </>
  );
};
