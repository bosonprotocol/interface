/* eslint @typescript-eslint/no-explicit-any: "off" */
import React from "react";

import { FieldInput, FieldTextArea } from "./Field.styles";

export enum FieldType {
  Input = "input",
  Textarea = "textarea"
}

export interface Props {
  className?: string;
  fieldType?: FieldType;
  placeholder?: string;
  disabled?: boolean;
  error?: any;
  [x: string]: any;
}

export default function Field({
  fieldType = FieldType.Input,
  ...props
}: Props) {
  const render = () =>
    ({
      [FieldType.Input]: <FieldInput {...props} />,
      [FieldType.Textarea]: <FieldTextArea {...props} />
    }[fieldType]);

  return render();
}
