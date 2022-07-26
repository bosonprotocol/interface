import { useField } from "formik";
import { Check } from "phosphor-react";
import { useEffect, useRef } from "react";

import Error from "./Error";
import { CheckboxWrapper } from "./Field.styles";
import type { CheckboxProps } from "./types";

export default function Checkbox({ name, ...props }: CheckboxProps) {
  const [field, meta, helpers] = useField(name);
  const ref = useRef(field.value);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";
  const checkboxId = `checkbox-${name}`;

  useEffect(() => {
    console.log(ref.current, field.value);
    if (ref.current !== field.value) {
      if (!meta.touched) {
        helpers.setTouched(true);
      }
    }
  }, [field.value]); // eslint-disable-line

  return (
    <>
      <CheckboxWrapper htmlFor={checkboxId} error={errorMessage}>
        <input hidden id={checkboxId} type="checkbox" {...props} {...field} />
        <div>
          <Check size={16} />
        </div>
        <b>{name || "Checkbox"}</b>
      </CheckboxWrapper>
      <Error display={displayError} message={errorMessage} />{" "}
    </>
  );
}
