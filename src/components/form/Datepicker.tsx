import type { Dayjs } from "dayjs";
import { useField } from "formik";
import React from "react";

import DatePicker from "../datepicker/DatePicker";
import Error from "./Error";
import type { DatepickerProps } from "./types";

export default function DatepickerComponent({ name }: DatepickerProps) {
  const [, meta, helpers] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const handleChange = (date: Dayjs) => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(date);
  };

  return (
    <>
      <DatePicker onChange={handleChange} error={errorMessage} />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
