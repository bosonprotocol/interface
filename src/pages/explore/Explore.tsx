import { ArrowRight } from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { generatePath } from "react-router-dom";
import { default as ReactSelect, StylesConfig } from "react-select";
import styled from "styled-components";

import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import {
  CollectionsQueryParameters,
  ExploreQueryParameters
} from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useCollections } from "../../lib/utils/hooks/useCollections";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import ExploreOffers from "./ExploreOffers";
import { WithAllOffers, WithAllOffersProps } from "./WithAllOffers";

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
    label: "Recently Created",
    exchangeOrderBy: "",
    validFromDate_lte: ""
  },
  {
    value: "3",
    orderDirection: "desc",
    orderBy: "validFromDate",
    label: "Recently Live",
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
const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 4rem auto;
  overflow: hidden;
`;

const SelectFilterWrapper = styled.div`
  position: relative;
  min-width: 10.125rem;
  max-height: 2.5rem;
  padding: 0.5rem 0 0.5rem 70px;
  display: flex;
  align-items: center;
  width: max-content;
`;

const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  align-items: center;
  justify-content: center;
  ${breakpoint.m} {
    flex-direction: row;
  }
`;

const ExploreOffersContainer = styled.div`
  background: ${colors.lightGrey};
  padding: 0 3.125rem 3.125rem 3.125rem;
`;

const CreatorsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 25% 25% 25% 25%;
  grid-gap: 0.5rem;
`;

const ViewMoreButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.secondary};
  width: 6.875rem;
  font-size: 1rem;
  font-weight: 600;
`;

function Explore(props: WithAllOffersProps) {
  console.log("props ========", props);

  const [nameQueryParameter] = useQueryParameter(ExploreQueryParameters.name);
  const [currencyQueryParameter] = useQueryParameter(
    ExploreQueryParameters.currency
  );
  const [sellerQueryParameter] = useQueryParameter(
    ExploreQueryParameters.seller
  );

  const [nameToSearch, setNameToSearch] = useState<string>(nameQueryParameter);
  // eslint-disable-next-line
  const [sortQueryParameter, setSortQueryParameter] = useQueryParameter(
    ExploreQueryParameters.orderDirection
  );

  const parseQueryParameter = useMemo(
    () => (sortQueryParameter ? sortQueryParameter : 3),
    [sortQueryParameter]
  );

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

  const [sortValue, setSortValue] = useQueryParameter(
    CollectionsQueryParameters.value
  );

  const [queryState, setQueryState] = useState({
    sortValue: sortValue || "",
    sortExchangeOrderByParameter: sortExchangeOrderByParameter || "",
    sortOrderByParameter: sortOrderByParameter || "",
    sortOrderDirectionParameter: sortOrderDirectionParameter || "",
    sortValidFromDate_lte: sortValidFromDate_lte || ""
  });

  const [filter, setFilter] = useState<FilterValue>(
    queryState.sortValue
      ? selectOptions[parseInt(queryState.sortValue)]
      : selectOptions[3]
  );
  const navigate = useKeepQueryParamsNavigate();

  useEffect(() => {
    setNameToSearch(nameQueryParameter);
  }, [nameQueryParameter]);

  const [selectedToken] = useState<string>(currencyQueryParameter);

  const [selectedSeller] = useState<string>(sellerQueryParameter);

  const updatePageIndexInUrl =
    (
      navigate: ReturnType<typeof useKeepQueryParamsNavigate> // eslint-disable-line
    ) =>
    (
      index: number,
      queryParams: {
        value: string;
        orderDirection: "asc" | "desc";
        orderBy: string;
        exchangeOrderBy: string;
        validFromDate_lte: string;
      }
    ): void => {
      const queryParamsUrl = new URLSearchParams( // eslint-disable-line
        Object.entries(queryParams)
      ).toString();

      if (index === 0) {
        navigate({
          pathname: BosonRoutes.Explore,
          search: queryParamsUrl
        });
      } else {
        navigate({
          pathname: generatePath(BosonRoutes.Explore, {}),
          search: queryParamsUrl
        });
      }
    };

  const updateUrl = useCallback(
    (index: number) => {
      return updatePageIndexInUrl(navigate)(index, {
        value: queryState.sortValue || sortValue,
        orderDirection:
          (queryState.sortOrderDirectionParameter as "asc" | "desc") ||
          (sortOrderDirectionParameter as "asc" | "desc"),
        orderBy: queryState.sortOrderByParameter || sortOrderByParameter,
        exchangeOrderBy:
          queryState.sortExchangeOrderByParameter ||
          sortExchangeOrderByParameter,
        validFromDate_lte:
          queryState.sortValidFromDate_lte || sortValidFromDate_lte
      });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      queryState,
      sortExchangeOrderByParameter,
      sortOrderByParameter,
      sortOrderDirectionParameter,
      sortValidFromDate_lte
    ]
  );

  const parseOrderBy = useMemo(() => {
    if (
      filter.orderBy === "priceLowToHigh" ||
      filter.orderBy === "priceHightToLow"
    ) {
      return "createdAt";
    }
    return filter.orderBy || "createdAt";
  }, [filter.orderBy]);

  const useCollectionPayload = {
    orderDirection: filter.orderDirection,
    orderBy: parseOrderBy,
    exchangeOrderBy:
      filter.exchangeOrderBy !== "" ? filter.exchangeOrderBy : "",
    validFromDate_lte: filter.validFromDate_lte
  };
  const { data } = useCollections({
    ...useCollectionPayload
  });

  const collections = useMemo(() => {
    const filtered = data?.filter((item) => item.offers.length > 0);

    if (filtered && filtered.length > 0) {
      return filtered.slice(0, 4);
    }

    if (data) {
      return data.slice(0, 4);
    }
  }, [data]);

  useEffect(() => {
    console.log(queryState);
    if (queryState) {
      updateUrl(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState]);

  return (
    <ExploreContainer>
      <TopContainer>
        <Typography tag="h2" $fontSize="2.25rem">
          Explore
        </Typography>
        <Grid justifyContent="flex-end">
          <SelectFilterWrapper>
            <Typography fontWeight="600" color={colors.darkGrey}>
              Sort:
            </Typography>
            <ReactSelect
              styles={customStyles}
              isSearchable={false}
              placeholder=""
              value={{ value: filter.value, label: filter.label }}
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
                setQueryState({
                  sortValue: option.value,
                  sortExchangeOrderByParameter: option.exchangeOrderBy,
                  sortOrderByParameter: option.orderBy,
                  sortOrderDirectionParameter: option.orderDirection,
                  sortValidFromDate_lte: option.validFromDate_lte
                });
              }}
            />
          </SelectFilterWrapper>
        </Grid>
      </TopContainer>
      <ExploreOffersContainer>
        <ExploreOffers
          name={nameToSearch}
          exchangeTokenAddress={selectedToken}
          sellerId={selectedSeller}
          hidePagination
          orderDirection={filter.orderDirection}
          orderBy={filter.orderBy}
          exchangeOrderBy={filter.exchangeOrderBy}
        />
      </ExploreOffersContainer>
      <ExploreOffersContainer>
        <Grid>
          <Typography
            $fontSize="32px"
            fontWeight="600"
            margin="0.67em 0 0.67em 0"
          >
            Sellers
          </Typography>
          <ViewMoreButton
            onClick={() => {
              if (sortQueryParameter) {
                navigate({
                  pathname: `${BosonRoutes.Sellers}/selectedOption=${sortQueryParameter}`
                });
              } else {
                navigate({
                  pathname: `${BosonRoutes.Sellers}`
                });
              }
            }}
          >
            View more <ArrowRight size={22} />
          </ViewMoreButton>
        </Grid>
        <CreatorsGrid>
          {collections &&
            collections.map((collection) => (
              <CollectionsCard key={collection.id} collection={collection} />
            ))}
        </CreatorsGrid>
      </ExploreOffersContainer>
    </ExploreContainer>
  );
}

const ExploreWithAllOffers = WithAllOffers(Explore);

function ExploreWrapper() {
  return <ExploreWithAllOffers />;
}
export default ExploreWrapper;
