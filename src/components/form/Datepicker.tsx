import type { Dayjs } from "dayjs";
import { useField } from "formik";

import DatePicker from "../datepicker/DatePicker";
import Error from "./Error";
import type { DatepickerProps } from "./types";

export default function Datepicker({
  name,
  period = false,
  selectTime = false,
  ...rest
}: DatepickerProps) {
  const [field, meta, helpers] = useField(name);

  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const handleChange = (date: Dayjs | Array<Dayjs | null> | null) => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(date);
  };

  return (
    <>
      <DatePicker
        onChange={handleChange}
        error={errorMessage}
        period={period}
        selectTime={selectTime}
        initialValue={field.value}
        {...rest}
      />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
