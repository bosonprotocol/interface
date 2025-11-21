import { useCustomStoreQueryParameter } from "pages/custom-store/useCustomStoreQueryParameter";
import { ParsedQuery } from "query-string";
import { SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CSSObjectWithLabel,
  default as ReactSelect,
  StylesConfig
} from "react-select";
import styled, { css } from "styled-components";

import { Typography } from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";

interface FilterValue {
  value: string;
  label: string;
}
const selectOptions = [
  {
    value: "price:asc",
    label: "Price Low to High ($)"
  },
  {
    value: "price:desc",
    label: "Price High to Low ($)"
  },
  {
    value: "createdAt:desc",
    label: "Recently Created"
  },
  {
    value: "validFromDate:desc",
    label: "Recently Live"
  },
  {
    value: "committedDate:desc",
    label: "Recently Committed"
  },
  {
    value: "redeemedDate:desc",
    label: "Recently Redeemed"
  }
] as const;

const customStyles: StylesConfig<
  {
    value: string;
    label: string;
  },
  false
> = {
  control: (provided) =>
    ({
      ...provided,
      cursor: "pointer",
      borderRadius: 0,
      boxShadow: "none",
      ":hover": {
        borderColor: colors.violet,
        borderWidth: "0"
      },
      background: "none",
      border: "none"
    }) as CSSObjectWithLabel,
  container: (provided, state) =>
    ({
      ...provided,
      zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
      position: "static",
      width: "100%",
      padding: 0,
      backgound: "none"
    }) as CSSObjectWithLabel,
  valueContainer: (provided) =>
    ({
      ...provided,
      padding: 0
    }) as CSSObjectWithLabel,
  menu: (provided) =>
    ({
      ...provided,
      position: "absolute",
      left: "0"
    }) as CSSObjectWithLabel,
  option: (provided, state) =>
    ({
      ...provided,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: state.isDisabled ? "0.5" : "1",
      background:
        state.isSelected || state.isFocused ? colors.greyLight : colors.white,
      color: state.isSelected ? colors.violet : colors.black
    }) as CSSObjectWithLabel,
  indicatorSeparator: () => ({
    display: "none"
  }),
  dropdownIndicator: (provided) =>
    ({
      ...provided,
      padding: 0
    }) as CSSObjectWithLabel
};

const SelectFilterWrapper = styled.div<{ $color: string }>`
  position: relative;
  min-width: 10.125rem;
  max-height: 2.5rem;
  padding: 0.5rem 0 0.5rem 70px;
  display: flex;
  align-items: center;
  width: max-content;
  ${({ $color }) => css`
    [class$="-ValueContainer"] > *,
    [class$="-indicatorContainer"] {
      color: ${$color};
    }
  `}
`;

interface Props {
  params?: ParsedQuery<string>;
  handleChange: (name: string, value: string) => void;
}
export default function ExploreSelect({ params, handleChange }: Props) {
  const textColor = useCustomStoreQueryParameter("textColor");
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
    <SelectFilterWrapper $color={textColor}>
      <Typography fontWeight="600" color={textColor}>
        Sort:
      </Typography>
      <ReactSelect
        styles={customStyles}
        isSearchable={false}
        placeholder=""
        value={filter}
        options={selectOptions}
        onChange={(option: SetStateAction<FilterValue | null>) => {
          if (option !== null) {
            setFilter(option);
          }
        }}
      />
    </SelectFilterWrapper>
  );
}
