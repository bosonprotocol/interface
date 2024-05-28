import { BaseInput } from "@bosonprotocol/react-kit";
import { useField, useFormikContext } from "formik";
import { forwardRef } from "react";
import { inputTheme } from "theme";

import Error from "./Error";
import type { InputProps } from "./types";

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <BaseInput {...props} ref={ref} theme={inputTheme} />;
});

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
