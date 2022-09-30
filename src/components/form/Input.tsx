import { useField, useFormikContext } from "formik";

import Error from "./Error";
import { FieldInput } from "./Field.styles";
import type { InputProps } from "./types";

export default function Input({ name, ...props }: InputProps) {
  const { status } = useFormikContext();
  const [field, meta] = useField(name);
  const errorText = meta.error || status?.[name];
  const errorMessage = errorText && meta.touched ? errorText : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";
  return (
    <>
      <FieldInput error={errorMessage} {...field} {...props} />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
