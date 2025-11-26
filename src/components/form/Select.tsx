/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField } from "formik";
import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import { zIndex } from "lib/styles/zIndex";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import ReactSelect, {
  ActionMeta,
  CSSObjectWithLabel,
  MultiValue,
  SingleValue,
  StylesConfig
} from "react-select";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { checkIfValueIsEmpty } from "../../lib/utils/checkIfValueIsEmpty";
import Error from "./Error";
import type { SelectDataProps, SelectProps } from "./types";

const StyledSelect = styled(ReactSelect)`
  * {
    font-size: 0.8331rem;
  }
  [class*="-indicatorContainer"] {
    padding: 6.92px; // to make selects less tall but as tall as inputs
  }
` as ReactSelect;

const customStyles = (
  error: any,
  { backgroundColor, textColor }: { backgroundColor: string; textColor: string }
): StylesConfig<any, boolean> => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  singleValue: (provided: any, state: any) => {
    return {
      ...provided,
      color: state.isDisabled ? colors.greyDark : textColor,
      fontSize: "13.33px"
    };
  },
  control: (provided: any, state: any) => {
    const before = state.selectProps.label
      ? {
          ":before": {
            content: `"${state.selectProps.label}"`,
            fontWeight: "600",
            paddingLeft: "1rem",
            color: textColor
          }
        }
      : null;
    return {
      ...provided,
      borderRadius: 0,
      padding: "0.4rem 0.25rem",
      boxShadow: "none",
      ":hover": {
        borderColor: colors.violet,
        borderWidth: "1px"
      },
      background: backgroundColor,
      border: state.isFocused
        ? `1px solid ${colors.violet}`
        : !checkIfValueIsEmpty(error)
          ? `1px solid ${colors.orange}`
          : `1px solid ${colors.border}`,
      ...before
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  container: (provided: any, state: any) => ({
    ...provided,
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "relative",
    width: "100%",
    minHeight: "25px"
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? "0.5" : "1",
    background:
      state.isOptionSelected || state.isSelected || state.isFocused
        ? colors.greyLight
        : colors.white,
    color:
      state.isOptionSelected || state.isSelected ? colors.violet : colors.black
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  multiValue: (base, state) => {
    return (state.data as Record<string, any>).isFixed
      ? ({ ...base, backgroundColor: backgroundColor } as CSSObjectWithLabel)
      : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? ({
          ...base,
          fontWeight: "bold",
          color: colors.white,
          paddingRight: 6
        } as CSSObjectWithLabel)
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed
      ? ({ ...base, display: "none" } as CSSObjectWithLabel)
      : base;
  },
  input(base) {
    return {
      ...base,
      color: textColor
    } as CSSObjectWithLabel;
  }
});

const useSelectColors = () => {
  const backgroundColor = colors.greyLight;
  const textColor = getColor1OverColor2WithContrast({
    color2: backgroundColor,
    color1: useCSSVariable("--buttonTextColor") || colors.greyDark
  });
  return {
    backgroundColor,
    textColor
  };
};

export function SelectForm({
  name,
  options,
  placeholder = "Choose...",
  isClearable = false,
  isSearchable = true,
  disabled = false,
  errorMessage,
  onChange,
  ...props
}: SelectProps<boolean>) {
  const [field, meta, helpers] = useField(name);
  const displayErrorMessage =
    meta.error && meta.touched && !errorMessage
      ? meta.error
      : meta.error && meta.touched && errorMessage
        ? errorMessage
        : "";

  const displayError =
    typeof displayErrorMessage === typeof "string" &&
    displayErrorMessage !== "";

  let handleChange:
    | ((
        newValue: MultiValue<SelectDataProps<string>> | null,
        actionMeta: ActionMeta<SelectDataProps<string>>
      ) => void)
    | ((newValue: SingleValue<SelectDataProps<string> | null>) => void);
  if (props.isMulti) {
    handleChange = (
      newValue: MultiValue<SelectDataProps<string>> | null,
      actionMeta: ActionMeta<SelectDataProps<string>>
    ) => {
      let newValueTemp: typeof newValue = newValue;
      if (!meta.touched) {
        helpers.setTouched(true);
      }
      switch (actionMeta.action) {
        case "remove-value":
        case "pop-value":
          if (actionMeta.removedValue.isFixed) {
            return;
          }
          break;
        case "clear":
          if (Array.isArray(field.value)) {
            newValueTemp = (field.value as any[]).filter((v) => v.isFixed);
          }
          break;
      }

      helpers.setValue(newValueTemp);
      onChange?.(newValueTemp);
    };
  } else {
    handleChange = (newValue: SingleValue<SelectDataProps<string> | null>) => {
      const newValueTemp: typeof newValue = newValue;
      if (!meta.touched) {
        helpers.setTouched(true);
      }

      helpers.setValue(newValueTemp);
      onChange?.(newValueTemp);
    };
  }

  const handleBlur = () => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
  };

  return (
    <>
      <StyledSelect
        styles={customStyles(displayErrorMessage, useSelectColors())}
        {...field}
        {...props}
        placeholder={placeholder}
        options={options}
        value={field.value}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={handleChange}
        onBlur={handleBlur}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={disabled}
        isOptionDisabled={(option: { disabled: boolean | undefined }) =>
          !!option.disabled
        }
      />
      <Error display={displayError} message={displayErrorMessage} />{" "}
    </>
  );
}
export default SelectForm;
export function Select({
  options,
  placeholder = "Choose...",
  isClearable = false,
  isSearchable = true,
  disabled = false,
  isMulti,
  displayErrorMessage,
  displayError,
  ...props
}: Omit<SelectProps<boolean>, "name"> & {
  displayError?: boolean;
  displayErrorMessage?: string;
  name?: string;
  value?: (typeof options)[number];
}) {
  return (
    <>
      <StyledSelect<(typeof options)[number], boolean>
        styles={customStyles(displayErrorMessage, useSelectColors())}
        {...props}
        placeholder={placeholder}
        options={options}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={disabled}
        isOptionDisabled={(option: { disabled: boolean | undefined }) =>
          !!option.disabled
        }
        isMulti={!!isMulti}
      />
      <Error display={displayError} message={displayErrorMessage} />{" "}
    </>
  );
}
