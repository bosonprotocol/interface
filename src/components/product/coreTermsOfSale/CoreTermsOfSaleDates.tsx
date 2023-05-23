import React from "react";

import { Datepicker, FormField } from "../../form";

interface CoreTermsOfSaleDatesProps {
  prefix?: string;
}

export const CoreTermsOfSaleDates: React.FC<CoreTermsOfSaleDatesProps> = ({
  prefix
}) => {
  const fixedPrefix = prefix ? `${prefix}.` : "";
  return (
    <>
      <FormField
        title="Offer validity period"
        required
        subTitle="The offer validity period is the time in which buyers can commit to your offer."
      >
        <Datepicker
          name={`${fixedPrefix}offerValidityPeriod`}
          period
          selectTime
          minDate={null}
        />
      </FormField>
      <FormField
        title="Redemption period"
        required
        subTitle="The redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Datepicker
          name={`${fixedPrefix}redemptionPeriod`}
          period
          selectTime
          minDate={null}
        />
      </FormField>
    </>
  );
};
