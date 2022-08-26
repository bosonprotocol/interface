import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useField } from "formik";
import React from "react";

import DatePicker from "../datepicker/DatePicker";
import Error from "./Error";
import type { DatepickerProps } from "./types";

export default function DatepickerComponent({
  name,
  period = false,
  setIsFormValid,
  ...rest
}: DatepickerProps) {
  const [field, meta, helpers] = useField(name);
  const [offerValidityPeriodFields] = useField(
    "coreTermsOfSale.offerValidityPeriod"
  );

  let errorMessage = meta.error && meta.touched ? meta.error : "";
  let displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const handleChange = (date: Dayjs | Array<Dayjs | null>) => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(date);
  };

  if (
    field.name === "coreTermsOfSale.redemptionPeriod" &&
    period &&
    setIsFormValid
  ) {
    const offerValidityPeriodLastDate = dayjs(
      offerValidityPeriodFields.value[1]
    );
    const redemptionPeriodLastDate = dayjs(field.value[1]);
    const isNotValid = redemptionPeriodLastDate.isBefore(
      offerValidityPeriodLastDate
    );
    setIsFormValid(!isNotValid);
    if (isNotValid) {
      errorMessage =
        "Redemption period has to be after or equal to validity period";
      displayError = true;
    }
  }

  return (
    <>
      <DatePicker
        onChange={handleChange}
        error={errorMessage}
        period={period}
        initialValue={field.value}
        {...rest}
      />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
