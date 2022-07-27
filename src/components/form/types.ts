export interface BaseProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface DatepickerProps extends BaseProps {
  data?: string;
}

export type CheckboxProps = BaseProps & { text?: string };

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
}

export type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement>;

export interface SelectDataProps {
  name: string;
  value: string;
}

export interface SelectContentProps {
  children: React.ReactNode | JSX.Element;
}

export interface SelectProps extends BaseProps {
  data: Array<SelectDataProps>;
  multiple?: boolean;
}

export interface UploadProps extends BaseProps {
  accept?: string;
  multiple?: boolean;
  trigger?: React.ReactNode | JSX.Element;
  onFilesSelect?: (files: File[]) => void;
}
