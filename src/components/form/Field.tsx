/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField } from "formik";
import { Warning } from "phosphor-react";
import React from "react";

import { colors } from "../../lib/styles/colors";
import Typography from "../ui/Typography";
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
  fieldProps = {},
  data,
  ...props
}: Props) {
  const [field, meta] = useField(fieldProps);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError = fieldType !== FieldType.FileUpload;

  const render = () =>
    ({
      [FieldType.Checkbox]: (
        <Checkbox
          data-type={fieldType}
          error={errorMessage}
          {...field}
          {...props}
        />
      ),
      [FieldType.FileUpload]: (
        <FileUpload data-type={fieldType} error={errorMessage} {...props} />
      ),
      [FieldType.Input]: (
        <FieldInput
          data-type={fieldType}
          error={errorMessage}
          {...field}
          {...props}
        />
      ),
      [FieldType.Select]: (
        <Select
          data-type={fieldType}
          data={data}
          error={errorMessage}
          {...field}
          {...props}
        />
      ),
      [FieldType.Textarea]: (
        <FieldTextArea
          data-type={fieldType}
          error={errorMessage}
          {...field}
          {...props}
        />
      )
    }[fieldType]);

  return (
    <div>
      <div>{render()}</div>
      {errorMessage && displayError && (
        <Typography
          tag="p"
          style={{
            color: colors.red,
            margin: "0.25rem 0.5rem",
            fontWeight: "600",
            fontSize: "0.75rem"
          }}
        >
          <Warning size={16} weight="bold" color={colors.red} />
          &nbsp;&nbsp;
          {errorMessage}
        </Typography>
      )}
    </div>
  );
}
