import { useField } from "formik";
import React from "react";

import Error from "./Error";
import { FieldTextArea } from "./Field.styles";
import type { TextareaProps } from "./types";

export default function Textarea({ name, ...props }: TextareaProps) {
  const [field, meta] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";
  return (
    <>
      <FieldTextArea error={errorMessage} {...field} {...props} />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
