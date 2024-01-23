import { ClearButton } from "components/ui/ClearButton";
import { Grid } from "components/ui/Grid";
import { useField, useFormikContext } from "formik";
import { forwardRef, useMemo } from "react";
import styled from "styled-components";

import Error from "./Error";
import { FieldInput } from "./Field.styles";
import type { InputProps } from "./types";
const StyledFieldInput = styled(FieldInput)`
  padding-right: calc(1rem + 12px);
`;
const StyledClearButton = styled(ClearButton)`
  top: 1px;
  height: calc(100% - 2px);
  margin-left: 0;
`;
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, isClearable, ...props }, ref) => {
    const { status, setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const errorText = meta.error || status?.[name];
    const errorMessage = errorText && meta.touched ? errorText : "";
    const displayError =
      typeof errorMessage === typeof "string" && errorMessage !== "";
    const InputComponent = useMemo(() => {
      return isClearable ? (
        <Grid style={{ position: "relative" }}>
          <StyledFieldInput
            error={errorMessage}
            {...field}
            {...props}
            ref={ref}
          />
          {isClearable && (
            <StyledClearButton onClick={() => setFieldValue(name, "")} />
          )}
        </Grid>
      ) : (
        <FieldInput error={errorMessage} {...field} {...props} ref={ref} />
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorMessage, field, isClearable, name, props, ref]);
    return (
      <>
        {InputComponent}
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
