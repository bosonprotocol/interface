import React, { useState } from "react";
import ReactSelect, { StylesConfig } from "react-select";
import styled from "styled-components";

import Typography from "../../components/ui/Typography";
import {
  CollectionsQueryParameters,
  ExploreQueryParameters
} from "../../lib/routing/parameters";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import ExploreOffers from "./ExploreOffers";

interface FilterValue {
  value: string;
  orderDirection: "asc" | "desc";
  orderBy: string;
  label: string;
  exchangeOrderBy: string;
  validFromDate_lte: string;
}

const selectOptions = [
  {
    value: "0",
    orderDirection: "asc",
    orderBy: "priceHightToLow",
    label: "Price Low to High ($)",
    exchangeOrderBy: "",
    validFromDate_lte: ""
  },
  {
    value: "1",
    orderDirection: "desc",
    orderBy: "priceLowToHigh",
    label: "Price High to Low ($)",
    exchangeOrderBy: "",
    validFromDate_lte: ""
  },
  {
    value: "2",
    orderDirection: "desc",
    orderBy: "createdAt",
    label: "Recently created",
    exchangeOrderBy: "",
    validFromDate_lte: ""
  },
  {
    value: "3",
    orderDirection: "desc",
    orderBy: "validFromDate",
    label: "Recently live",
    exchangeOrderBy: "",
    validFromDate_lte: `${Math.floor(Date.now() / 1000)}`
  },
  {
    value: "4",
    orderDirection: "desc",
    orderBy: "createdAt",
    label: "Recently Commited",
    exchangeOrderBy: "committedDate",
    validFromDate_lte: ""
  },
  {
    value: "5",
    orderDirection: "desc",
    orderBy: "createdAt",
    label: "Recently Redeemed",
    exchangeOrderBy: "redeemedDate",
    validFromDate_lte: ""
  }
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
  right: 0;
  margin-top: 2rem;
  align-items: center;
`;

function Products() {
  const [sortOrderByParameter, setSortOrderByParameter] = useQueryParameter(
    CollectionsQueryParameters.orderBy
  );
  const [sortOrderDirectionParameter, setSortOrderDirectionParameter] =
    useQueryParameter(CollectionsQueryParameters.orderDirection);

  const [sortExchangeOrderByParameter, setSortExchangeOrderByParameter] =
    useQueryParameter(CollectionsQueryParameters.exchangeOrderBy);

  const [sortValidFromDate_lte, setValidFromDate_lte] = useQueryParameter(
    CollectionsQueryParameters.validFromDate_lte
  );

  // const parseQueryParameter = useMemo(
  //   () => (sortQueryParameter ? Number(sortQueryParameter) : 0),
  //   [sortQueryParameter]
  // );

  const [filter, setFilter] = useState<FilterValue>(selectOptions[0]);

  // useEffect(() => {
  //   if (typeof selectOptions[parseQueryParameter] === "number") {
  //     setFilter(selectOptions[parseQueryParameter]);
  //   }
  // }, [parseQueryParameter]);
  // useEffect(() => {
  //   if (sortQueryParameter) {
  //     // setFilter(
  //     //   selectOptions.filter((option) => option.value === sortQueryParameter)[0]
  //     // );
  //   }
  // }, [sortQueryParameter]);

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
          // eslint-disable-next-line
          onChange={(option: any) => {
            // eslint-disable-line
            if (option !== null) {
              setFilter({
                value: option.value,
                orderDirection: option.orderDirection,
                orderBy: option.orderBy,
                label: option.label,
                exchangeOrderBy: option.exchangeOrderBy,
                validFromDate_lte: option.validFromDate_lte
              });
            }
            setSortOrderByParameter(option.orderBy);
            setSortOrderDirectionParameter(option.orderDirection);
            setSortExchangeOrderByParameter(option.exchangeOrderBy);
            setValidFromDate_lte(option.validFromDate_lte);
          }}
        />
      </SelectFilterWrapper>
      <ExploreOffersContainer>
        <ExploreOffers
          name={nameToSearch}
          exchangeTokenAddress={selectedToken}
          sellerId={selectedSeller}
          brand={brandSelect}
          rows={2}
          breadcrumbs={true}
          orderDirection={filter?.orderDirection}
          orderBy={filter?.orderBy}
          exchangeOrderBy={filter?.exchangeOrderBy}
          sortOrderByParameter={sortOrderByParameter}
          sortOrderDirectionParameter={sortOrderDirectionParameter}
          sortExchangeOrderByParameter={sortExchangeOrderByParameter}
          sortValidFromDate_lte={sortValidFromDate_lte}
        />
      </ExploreOffersContainer>
    </Container>
  );
}

export default Products;
