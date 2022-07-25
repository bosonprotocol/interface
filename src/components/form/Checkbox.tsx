import { Check } from "phosphor-react";

import { newId } from "../../lib/utils/newId";
import { Props } from "./Field";
import { CheckboxWrapper } from "./Field.styles";

export default function Checkbox({ name, ...props }: Props) {
  const checkboxId = newId("checkbox-");
  return (
    <CheckboxWrapper htmlFor={checkboxId}>
      <input {...props} type="checkbox" hidden id={checkboxId} />
      <div>
        <Check size={16} />
      </div>
      <b>{name || "Checkbox"}</b>
    </CheckboxWrapper>
  );
}
