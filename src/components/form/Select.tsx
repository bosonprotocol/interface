/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField } from "formik";
import Select, {
  ActionMeta,
  MultiValue,
  SingleValue,
  StylesConfig
} from "react-select";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { checkIfValueIsEmpty } from "../../lib/utils/checkIfValueIsEmpty";
import Error from "./Error";
import type { SelectDataProps, SelectProps } from "./types";

const StyledSelect = styled(Select)`
  * {
    font-size: 13.33px;
  }
  [class*="-indicatorContainer"] {
    padding: 6.92px; // to make selects less tall but as tall as inputs
  }
` as Select;

const customStyles = (error: any): StylesConfig<any, true> => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  singleValue: (provided: any, state: any) => {
    return {
      ...provided,
      fontSize: "13.33px"
    };
  },
  control: (provided: any, state: any) => {
    const before = state.selectProps.label
      ? {
          ":before": {
            content: `"${state.selectProps.label}"`,
            fontWeight: "600",
            paddingLeft: "1rem"
          }
        }
      : null;
    return {
      ...provided,
      borderRadius: 0,
      padding: "0.4rem 0.25rem",
      boxShadow: "none",
      ":hover": {
        borderColor: colors.secondary,
        borderWidth: "1px"
      },
      background: colors.lightGrey,
      border: state.isFocused
        ? `1px solid ${colors.secondary}`
        : !checkIfValueIsEmpty(error)
        ? `1px solid ${colors.orange}`
        : `1px solid ${colors.border}`,
      ...before
    };
  },
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
        ? colors.lightGrey
        : colors.white,
    color:
      state.isOptionSelected || state.isSelected
        ? colors.secondary
        : colors.black
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  multiValue: (base, state) => {
    return (state.data as Record<string, any>).isFixed
      ? { ...base, backgroundColor: colors.darkGrey }
      : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: "bold", color: colors.white, paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  }
});

export default function SelectComponent({
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
        styles={customStyles(displayErrorMessage)}
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
        isOptionDisabled={(option) => !!option.disabled}
      />
      <Error display={displayError} message={displayErrorMessage} />{" "}
    </>
  );
}
