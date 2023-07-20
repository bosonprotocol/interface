import { useField, useFormikContext } from "formik";
import { forwardRef } from "react";

import Error from "./Error";
import { FieldInput } from "./Field.styles";
import type { InputProps } from "./types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, ...props }, ref) => {
    const { status } = useFormikContext();
    const [field, meta] = useField(name);
    const errorText = meta.error || status?.[name];
    const errorMessage = errorText && meta.touched ? errorText : "";
    const displayError =
      typeof errorMessage === typeof "string" && errorMessage !== "";

    return (
      <>
        <FieldInput error={errorMessage} {...field} {...props} ref={ref} />
        <Error
          display={!props.hideError && displayError}
          message={errorMessage}
        />
      </>
    );
  }
);

export const InputError = ({ name }: Pick<InputProps, "name">) => {
  const { status } = useFormikContext();
  const [, meta] = useField(name);
  const errorText = meta.error || status?.[name];
  const errorMessage = errorText && meta.touched ? errorText : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  return <Error display={displayError} message={errorMessage} />;
};

export default Input;
