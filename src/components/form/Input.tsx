import { useField } from "formik";

import Error from "./Error";
import { FieldInput } from "./Field.styles";
import type { InputProps } from "./types";

export default function Input({ name, ...props }: InputProps) {
  const [field, meta] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";
  console.log({ name, displayError, errorMessage, meta });
  return (
    <>
      <FieldInput error={errorMessage} {...field} {...props} />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
