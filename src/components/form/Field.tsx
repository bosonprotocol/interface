/* eslint @typescript-eslint/no-explicit-any: "off" */
import React from "react";

import Checkbox from "./Checkbox";
import { FieldInput, FieldTextArea } from "./Field.styles";
import FileUpload from "./FileUpload";
import Select from "./Select";

export enum FieldType {
  Checkbox = "checkbox",
  FileUpload = "upload",
  Input = "input",
  Select = "select",
  Textarea = "textarea"
}

export interface DataProps {
  name: string;
  value: string;
}

export interface Props {
  className?: string;
  fieldType?: FieldType;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  trigger?: React.ReactNode | JSX.Element;
  error?: any;
  fileMaxSize?: number;
  data?: Array<DataProps>;
  [x: string]: any;
}

export default function Field({
  fieldType = FieldType.Input,
  data,
  ...props
}: Props) {
  const render = () =>
    ({
      [FieldType.Checkbox]: <Checkbox data-type={fieldType} {...props} />,
      [FieldType.FileUpload]: <FileUpload data-type={fieldType} {...props} />,
      [FieldType.Input]: <FieldInput data-type={fieldType} {...props} />,
      [FieldType.Select]: (
        <Select data-type={fieldType} data={data} {...props} />
      ),
      [FieldType.Textarea]: <FieldTextArea data-type={fieldType} {...props} />
    }[fieldType]);

  return render();
}
