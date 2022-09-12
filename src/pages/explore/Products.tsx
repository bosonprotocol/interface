import React, { useEffect, useState } from "react";
import ReactSelect, { StylesConfig } from "react-select";
import styled from "styled-components";

import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import ExploreOffers from "./ExploreOffers";

interface FilterValue {
  value: "asc" | "desc";
  label: string;
}

const selectOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" }
] as const;

const ExploreOffersContainer = styled.div`
  background: ${colors.lightGrey};
  padding: 0 3.125rem 3.125rem 3.125rem;
`;

const Container = styled.div`
  position: relative;
`;

const SelectFilterWrapper = styled.div`
  display: flex;
  width: fit-content;
  position: absolute;
  right: 0.75rem;
  margin-top: 3.25rem;
  align-items: center;
`;

function Products() {
  const [filter, setFilter] = useState<FilterValue>(selectOptions[0]);
  const [sortQueryParameter, setSortQueryParameter] = useQueryParameter(
    ExploreQueryParameters.orderDirection
  );
  useEffect(() => {
    if (sortQueryParameter) {
      setFilter(
        selectOptions.filter((option) => option.value === sortQueryParameter)[0]
      );
    }
  }, [sortQueryParameter]);

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

  const [nameQueryParameter] = useQueryParameter(ExploreQueryParameters.name);

  const [currencyQueryParameter] = useQueryParameter(
    ExploreQueryParameters.currency
  );

  const [selectedToken] = useState<string>(currencyQueryParameter);
  const [sellerQueryParameter] = useQueryParameter(
    ExploreQueryParameters.seller
  );

  const [brandSelect] = useState<string>("");
  const [nameToSearch] = useState<string>(nameQueryParameter);

  const [selectedSeller] = useState<string>(sellerQueryParameter);

  return (
    <Container>
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
          onChange={(option) => {
            setFilter(option as typeof selectOptions[number]);
            setSortQueryParameter(option?.value || "");
          }}
        />
      </SelectFilterWrapper>
      <ExploreOffersContainer>
        <ExploreOffers
          name={nameToSearch}
          exchangeTokenAddress={selectedToken}
          sellerId={selectedSeller}
          brand={brandSelect}
          rows={3}
          breadcrumbs={true}
          orderDirection={filter.value}
        />
      </ExploreOffersContainer>
    </Container>
  );
}

export default Products;
