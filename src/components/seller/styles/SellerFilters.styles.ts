import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import Grid from "../../ui/Grid";

export const InputWrapper = styled(Grid)`
  flex: 1;
  gap: 1rem;

  padding: 0.45rem 1.5rem;
  max-height: 2.5rem;
  background: ${colors.border};
`;

export const Input = styled.input`
  width: 100%;
  background: transparent;
  border: 0px solid ${colors.border};

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;

  &:focus {
    outline: none;
  }
`;

/**
 * NOTE: Do note remove this codebase because will be activated back soon
 *
 */
// const SelectFilterWrapper = styled.div`
//   position: relative;
//   min-width: 10.125rem;
//   max-height: 2.5rem;
//   background: ${colors.lightGrey};
//   padding: 0.5rem 0.75rem 0.5rem 1rem;
//   display: flex;
//   align-items: center;
// `;

export const SearchFilterWrapper = styled.div`
  min-width: 34.1rem;
`;

// const SelectTitle = styled.strong`
//   display: block;
// `;

// const selectOptions = [
//   { value: "1", label: "Show all" },
//   { value: "2", label: "Jonas to add" }
// ];

// const customStyles: StylesConfig<
//   {
//     value: string;
//     label: string;
//   },
//   false
// > = {
//   control: (provided) => ({
//     ...provided,
//     borderRadius: 0,
//     boxShadow: "none",
//     ":hover": {
//       borderColor: colors.secondary,
//       borderWidth: "1px"
//     },
//     background: "none",
//     border: "none"
//   }),
//   container: (provided, state) => ({
//     ...provided,
//     zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
//     position: "static",
//     width: "100%",
//     padding: 0
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     padding: 0
//   }),
//   menu: (provided) => ({
//     ...provided,
//     position: "absolute",
//     left: "0"
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     cursor: state.isDisabled ? "not-allowed" : "pointer",
//     opacity: state.isDisabled ? "0.5" : "1",
//     background:
//       state.isSelected || state.isFocused ? colors.lightGrey : colors.white,
//     color: state.isSelected ? colors.secondary : colors.black
//   }),
//   indicatorSeparator: () => ({
//     display: "none"
//   }),
//   dropdownIndicator: (provided) => ({
//     ...provided,
//     padding: 0
//   })
// };
