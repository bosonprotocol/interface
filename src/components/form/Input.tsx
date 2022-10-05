import { useField } from "formik";

import Error from "./Error";
import { FieldInput } from "./Field.styles";
import type { InputProps } from "./types";

export default function Input({ name, prefix, ...props }: InputProps) {
  const [field, meta] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  return (
    <>
      <FieldInput
        error={errorMessage}
        {...field}
        {...props}
        value={prefix ? `${prefix} ${field.value}` : `${field.value}`}
      />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
