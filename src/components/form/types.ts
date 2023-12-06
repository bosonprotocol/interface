import type { DatePickerProps } from "components/datepicker/DatePicker";
import { CSSProperties, ReactNode } from "react";
import { MultiValue, SingleValue } from "react-select";

import { UploadFileType } from "./Upload/types";

type BaseProps = {
  name: string;
  placeholder?: string;
  disabled?: boolean;
  hideError?: boolean;
};

export type DatepickerProps = BaseProps &
  Pick<
    DatePickerProps,
    "period" | "minDate" | "maxDate" | "isClearable" | "placeholder"
  > & {
    data?: string;
    selectTime?: boolean;
    setIsFormValid?: (isValid: boolean) => void;
  };

export type CheckboxProps = BaseProps & {
  text?: ReactNode;
};

export type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type ErrorProps = {
  display?: boolean;
  message?: string;
};

export type FormFieldProps = {
  title: string;
  titleIcon?: ReactNode;
  subTitle?: ReactNode | false;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode | string;
  style?: React.CSSProperties;
  theme?: string;
  valueToCopy?:
    | string
    | {
        [key: string]: unknown;
      };
};

export type InputColorProps = BaseProps;

export type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & { isClearable?: boolean };

export type TagsProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    onAddTag?: (tag: string) => void;
    onRemoveTag?: (tag: string) => void;
    label?: string;
    compareTags?: (tagA: string, tagB: string) => boolean;
    transform?: (tag: string) => string;
  };

export type SelectDataProps<Value extends string = string> = {
  label: string;
  value: Value;
  disabled?: boolean;
  isFixed?: boolean;
  [others: string]: unknown;
};

export type SelectContentProps = {
  children: React.ReactNode | JSX.Element;
};

type OnChange = (value: SingleValue<SelectDataProps>) => void;

export type BaseSelectProps = {
  options: Array<SelectDataProps>;
  placeholder?: string;
  defaultValue?: SelectDataProps | null;
  onChange?: OnChange;
};

export type SelectProps<IsMulti extends boolean> = BaseProps & {
  isMulti?: IsMulti;
  disabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: Array<SelectDataProps> | Readonly<Array<SelectDataProps>>;
  errorMessage?: string;
  onChange?: (
    option: IsMulti extends true
      ? MultiValue<SelectDataProps<string>>
      : SingleValue<SelectDataProps<string>>
  ) => void;
  label?: string;
  className?: string;
  classNamePrefix?: string;
};

export type UploadProps = BaseProps & {
  accept?: string;
  multiple?: boolean;
  trigger?: React.ReactNode | JSX.Element;
  maxSize?: number;
  onFilesSelect?: (files: UploadFileType[]) => void;
  files?: File[];
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  onLoadSinglePreviewImage?: (base64Uri: string) => void;
  withUpload?: boolean;
  onLoading?: (loading: boolean) => void;
  withEditor?: boolean;
  borderRadius?: number;
  width?: number;
  height?: number;
  imgPreviewStyle?: Pick<CSSProperties, "objectFit">;
};
