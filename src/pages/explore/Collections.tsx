import React, { useCallback, useEffect, useMemo, useState } from "react";
import { generatePath, useParams } from "react-router-dom";
import ReactSelect, { StylesConfig } from "react-select";
import styled from "styled-components";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import {
  CollectionsQueryParameters,
  UrlParameters
} from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useCollections } from "../../lib/utils/hooks/useCollections";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Pagination from "./Pagination";

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
    orderDirection: "desc",
    orderBy: "createdAt",
    label: "Recently Created",
    exchangeOrderBy: "",
    validFromDate_lte: ""
  },
  {
    value: "1",
    orderDirection: "desc",
    orderBy: "validFromDate",
    label: "Recently Live",
    exchangeOrderBy: "",
    validFromDate_lte: `${Math.floor(Date.now() / 1000)}`
  },
  {
    value: "2",
    orderDirection: "desc",
    orderBy: "createdAt",
    label: "Recently Commited",
    exchangeOrderBy: "committedDate",
    validFromDate_lte: ""
  },
  {
    value: "3",
    orderDirection: "desc",
    orderBy: "createdAt",
    label: "Recently Redeemed",
    exchangeOrderBy: "redeemedDate",
    validFromDate_lte: ""
  }
] as const;

const DEFAULT_PAGE = 0;

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 4rem auto;
  overflow: hidden;
  background-color: ${colors.lightGrey};
  padding: 3.125rem;
`;

const CreatorsGrid = styled.div<{ $isLteS: boolean; $isLteXS: boolean }>`
  display: grid;
  width: 100%;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-columns: ${({ $isLteS }) => $isLteS && "50%"};
  grid-template-columns: ${({ $isLteXS }) => $isLteXS && "100%"};
  grid-gap: 0.5rem;
  grid-row-gap: 2rem;
`;

const SelectFilterWrapper = styled.div`
  position: relative;
  min-width: 10.125rem;
  max-height: 2.5rem;
  padding: 0.5rem 0 0.5rem 1rem;
  display: flex;
  align-items: center;
`;

const BreadcrumbsContainer = styled.div`
  display: block;
`;

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

function Collections() {
  const navigate = useKeepQueryParamsNavigate();
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
      : selectOptions[1]
  );

  const params = useParams();

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
          pathname: BosonRoutes.Sellers,
          search: queryParamsUrl
        });
      } else {
        navigate({
          pathname: generatePath(BosonRoutes.SellersByIndex, {
            [UrlParameters.page]: index + 1 + ""
          }),
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

  const initialPageIndex = Math.max(
    0,
    params[UrlParameters.page]
      ? Number(params[UrlParameters.page]) - 1
      : DEFAULT_PAGE
  );
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const OFFERS_PER_PAGE = 8;

  const parseOrderBy = useMemo(() => {
    if (
      filter?.orderBy === "priceLowToHigh" ||
      filter?.orderBy === "priceHightToLow"
    ) {
      return "createdAt";
    }
    return filter?.orderBy || "createdAt";
  }, [filter]);

  useEffect(() => {
    console.log("filter!", filter);
  }, [filter]);

  const useCollectionPayload = {
    first: OFFERS_PER_PAGE * 2,
    skip: OFFERS_PER_PAGE * pageIndex,
    orderDirection: filter?.orderDirection,
    orderBy: parseOrderBy,
    exchangeOrderBy:
      filter?.exchangeOrderBy !== "" ? filter?.exchangeOrderBy : "",
    validFromDate_lte: filter?.validFromDate_lte
  };
  const { data, isFetched } = useCollections({
    ...useCollectionPayload
  });

  const { isLteXS, isLteS } = useBreakpoints();

  const collections = useMemo(() => {
    const filtered = data?.filter((item) => item.offers.length > 0);

    if (filtered && filtered.length > 0) {
      return filtered;
    }

    if (data) {
      return data;
    }
  }, [data]);

  const currentAndNextPageOffers = useMemo(() => {
    if (data) {
      return data.length / 3;
    }
    return 1;
  }, [data]);

  useEffect(() => {
    if (isFetched && !data?.length) {
      /**
       * if you go directly to a page without any offers,
       * you'll be redirected to the first page
       */
      setPageIndex(DEFAULT_PAGE);
      updateUrl(DEFAULT_PAGE);
    }
  }, [currentAndNextPageOffers, data, data?.length, isFetched, updateUrl]);

  useEffect(() => {
    console.log(queryState);
    if (queryState) {
      updateUrl(pageIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, queryState]);

  return (
    <>
      <Grid>
        <Typography
          $fontSize="2.25rem"
          fontWeight="600"
          margin="1.375rem 0 0.67em 0"
        >
          Sellers
        </Typography>
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
      <ExploreContainer>
        <BreadcrumbsContainer>
          <Breadcrumbs
            steps={[
              {
                id: 0,
                label: "Explore",
                url: `${BosonRoutes.Explore}`,
                hightlighted: true
              },
              {
                id: 1,
                label: "All sellers",
                url: `${BosonRoutes.Sellers}`,
                hightlighted: false
              }
            ]}
            margin="-0.625rem 0 2rem 0"
          />
        </BreadcrumbsContainer>
        <CreatorsGrid $isLteS={isLteS} $isLteXS={isLteXS}>
          {collections &&
            collections.map((collection) => (
              <CollectionsCard key={collection.id} collection={collection} />
            ))}
        </CreatorsGrid>
      </ExploreContainer>
      <div>
        <Pagination
          defaultPage={pageIndex}
          isNextEnabled={(currentAndNextPageOffers || 0) >= 1 + 1}
          isPreviousEnabled={true}
          onChangeIndex={(index) => {
            setPageIndex(index);
            updateUrl(index);
          }}
        />
      </div>
    </>
  );
}

export default Collections;
