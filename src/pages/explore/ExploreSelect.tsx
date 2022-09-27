import { ParsedQuery } from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { default as ReactSelect, StylesConfig } from "react-select";
import styled from "styled-components";

import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";

interface FilterValue {
  value: string;
  label: string;
}
const selectOptions = [
  {
    value: "price:desc",
    label: "Price Low to High ($)"
  },
  {
    value: "price:asc",
    label: "Price High to Low ($)"
  },
  {
    value: "createdAt:desc",
    label: "Recently Created"
  },
  {
    value: "validFromDate:desc",
    label: "Recently Live"
    // validFromDate_lte: `${Math.floor(Date.now() / 1000)}`
  },
  {
    value: "committedDate:desc",
    label: "Recently Commited"
    // exchangeOrderBy: "committedDate",
  },
  {
    value: "redeemedDate:desc",
    label: "Recently Redeemed"
    // exchangeOrderBy: "redeemedDate",
  }
] as const;

const customStyles: StylesConfig<
  {
    value: string;
    label: string;
  },
  false
> = {
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    boxShadow: "none",
    ":hover": {
      borderColor: colors.secondary,
      borderWidth: "0"
    },
    background: "none",
    border: "none"
  }),
  container: (provided, state) => ({
    ...provided,
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "static",
    width: "100%",
    padding: 0,
    backgound: "none"
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0
  }),
  menu: (provided) => ({
    ...provided,
    position: "absolute",
    left: "0"
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? "0.5" : "1",
    background:
      state.isSelected || state.isFocused ? colors.lightGrey : colors.white,
    color: state.isSelected ? colors.secondary : colors.black
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0
  })
};

const SelectFilterWrapper = styled.div`
  position: relative;
  min-width: 10.125rem;
  max-height: 2.5rem;
  padding: 0.5rem 0 0.5rem 70px;
  display: flex;
  align-items: center;
  width: max-content;
`;

interface Props {
  params?: ParsedQuery<string>;
  handleChange: (name: string, value: string) => void;
}
export default function ExploreSelect({ params, handleChange }: Props) {
  const location = useLocation();
  const DEFAULT_FILTER =
    params?.[ExploreQueryParameters.sortBy] || "validFromDate:desc";
  const [filter, setFilter] = useState<FilterValue | null>(
    selectOptions.find((f) => f.value === DEFAULT_FILTER) || null
  );

  useEffect(() => {
    if (filter?.value) {
      handleChange(ExploreQueryParameters.sortBy, filter?.value);
    }
  }, [filter]); // eslint-disable-line

  useEffect(() => {
    const defaultParams = params?.[ExploreQueryParameters.sortBy] || false;
    if (filter?.value && defaultParams === false) {
      handleChange(ExploreQueryParameters.sortBy, filter?.value);
    }
  }, [location]); // eslint-disable-line

  return (
    <SelectFilterWrapper>
      <Typography fontWeight="600" color={colors.darkGrey}>
        Sort:
      </Typography>
      <ReactSelect
        styles={customStyles}
        isSearchable={false}
        placeholder=""
        value={filter}
        options={selectOptions}
        // eslint-disable-next-line
        onChange={(option: any) => {
          if (option !== null) {
            setFilter(option);
          }
        }}
      />
    </SelectFilterWrapper>
  );
}
