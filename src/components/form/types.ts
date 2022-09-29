import { SingleValue } from "react-select";

export interface BaseProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface DatepickerProps extends BaseProps {
  data?: string;
  period?: boolean;
  selectTime?: boolean;
  setIsFormValid?: (isValid: boolean) => void;
}

export interface CheckboxProps extends BaseProps {
  text?: string;
}

export type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface ErrorProps {
  display?: boolean;
  message?: string;
}

export interface FormFieldProps {
  title: string;
  subTitle?: string | false;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode | string;
  style?: React.CSSProperties;
  theme?: string;
  valueToCopy?: {
    [key: string]: unknown;
  };
}

export type InputColorProps = BaseProps;

export type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement>;

export interface SelectDataProps<Value extends string = string> {
  label: string;
  value: Value;
  [others: string]: unknown;
}

export interface SelectContentProps {
  children: React.ReactNode | JSX.Element;
}

export type OnChange = (value: SingleValue<SelectDataProps>) => void;

export interface BaseSelectProps {
  options: Array<SelectDataProps>;
  placeholder?: string;
  defaultValue?: SelectDataProps | null;
  onChange?: OnChange;
}

export interface SelectProps extends BaseProps {
  isMulti?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: Array<SelectDataProps>;
  errorMessage?: string;
}

export interface UploadProps extends BaseProps {
  accept?: string;
  multiple?: boolean;
  trigger?: React.ReactNode | JSX.Element;
  maxSize?: number;
  onFilesSelect?: (files: File[]) => void;
  files?: File[];
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}
