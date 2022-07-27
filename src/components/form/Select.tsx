/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField } from "formik";
import Select from "react-select";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Error from "./Error";
import type { SelectProps } from "./types";
import { checkIfValueIsEmpty } from "./utils";

const customStyles = (error: any) => ({
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 0,
    padding: "0.25rem",
    boxShadow: `inset 0px 0px 0px 2px  ${colors.border}`,
    ":hover": {
      borderColor: colors.secondary,
      borderWidth: "1px"
    },
    background: colors.white,
    border: state.isFocused
      ? `1px solid ${colors.secondary}`
      : !checkIfValueIsEmpty(error)
      ? `1px solid ${colors.red}`
      : `1px solid transparent`
  }),
  container: (provided: any) => ({
    ...provided,
    zIndex: zIndex.Select,
    width: "100%"
  }),
  option: (provided: any, state: any) => ({
    ...provided,
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
  })
});

export default function SelectComponent({
  name,
  options,
  placeholder = "Choose...",
  isClearable = true,
  isSearchable = true,
  ...props
}: SelectProps) {
  const [field, meta, helpers] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const handleChange = (option: any) => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }

    helpers.setValue(option);
  };

  return (
    <>
      <Select
        styles={customStyles(errorMessage)}
        {...field}
        {...props}
        options={options}
        value={field.value}
        onChange={handleChange}
        isSearchable={isSearchable}
        isClearable={isClearable}
      />
      <Error display={displayError} message={errorMessage} />{" "}
    </>
  );
}
