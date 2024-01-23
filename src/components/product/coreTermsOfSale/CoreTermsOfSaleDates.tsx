import { Datepicker, FormField, Input } from "components/form";
import { Select } from "components/form/Select";
import { SwitchForm } from "components/form/Switch";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
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
        title={
          infiniteExpirationOffers
            ? "Offer start date"
            : "Offer validity period"
        }
        required
        subTitle={
          infiniteExpirationOffers
            ? "The offer start date is the date from when buyers can commit to your offer."
            : "The offer validity period is the time in which buyers can commit to your offer."
        }
        titleIcon={
          <SwitchForm
            name={`${fixedPrefix}infiniteExpirationOffers`}
            gridProps={gridProps}
            leftChildren
            invertValue
            label={() => (
              <Typography
                color={colors.secondary}
                fontSize="0.8rem"
                cursor="pointer"
              >
                Set an expiration date for this offer
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
        title={
          infiniteExpirationOffers
            ? "Redemption start date"
            : "Redemption period"
        }
        required={!infiniteExpirationOffers}
        subTitle={
          infiniteExpirationOffers
            ? "The redemption start date is the date from when buyers can redeem the rNFT for the physical item. If unspecified, it will default to start when the buyer commits to your offer."
            : "The redemption period is the time in which buyers can redeem the rNFT for the physical item."
        }
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
        </Grid>
      </FormField>
      {infiniteExpirationOffers && (
        <FormField
          title="Redemption duration"
          required
          subTitle="The redemption duration is the number of days a buyer has to redeem the rNFT for the physical item, from the later of the commit date or the redemption start date."
        >
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
        </FormField>
      )}
    </>
  );
};
