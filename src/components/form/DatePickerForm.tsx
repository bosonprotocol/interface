import type { Dayjs } from "dayjs";
import { useField } from "formik";
import { useForm } from "lib/utils/hooks/useForm";

import DatePicker from "../datepicker/DatePicker";
import Error from "./Error";
import type { DatepickerProps } from "./types";

export default function DatePickerForm({
  name,
  period = false,
  selectTime = false,
  ...rest
}: DatepickerProps) {
  const { handleBlur } = useForm();
  const [field, meta, helpers] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const handleChange = (
    date: Dayjs | Array<Dayjs | null> | null | undefined
  ) => {
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
        onBlur={handleBlur}
        onClick={() => {
          if (!meta.touched) {
            helpers.setTouched(true);
          }
        }}
        {...rest}
        name={name}
      />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
