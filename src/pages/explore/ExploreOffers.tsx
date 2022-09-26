import { useCallback, useEffect, useMemo, useState } from "react";
import { generatePath, useParams } from "react-router-dom";
import styled from "styled-components";

import OfferList from "../../components/offers/OfferList";
import { useSortByPrice } from "../../components/price/useSortByPrice";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { Offer } from "../../lib/types/offer";
import { useInfiniteOffers } from "../../lib/utils/hooks/offers/useInfiniteOffers";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { usePrevious } from "../../lib/utils/hooks/usePrevious";
import Pagination from "./Pagination";

const Container = styled.div`
  display: block;
`;

const PaginationWrapper = styled.div``;

interface Props {
  name?: string;
  brand?: string;
  exchangeTokenAddress?: Offer["exchangeToken"]["address"];
  sellerId?: Offer["seller"]["id"];
  hidePagination?: boolean;
  rows?: number;
  breadcrumbs?: boolean;
  orderDirection?: "asc" | "desc";
  orderBy: string;
  exchangeOrderBy?: string;
  sortOrderByParameter?: string;
  sortOrderDirectionParameter?: string;
  sortExchangeOrderByParameter?: string;
  sortValidFromDate_lte?: string;
  sortValue?: string | undefined;
  queryState?: {
    sortValue: string;
    sortOrderByParameter: string;
    sortOrderDirectionParameter: string;
    sortExchangeOrderByParameter: string;
    sortValidFromDate_lte: string;
  };
}

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
        pathname: BosonRoutes.ExplorePage,
        search: queryParamsUrl
      });
    } else {
      navigate({
        pathname: generatePath(BosonRoutes.ExplorePageByIndex, {
          [UrlParameters.page]: index + 1 + ""
        }),
        search: queryParamsUrl
      });
    }
  };

const DEFAULT_PAGE = 0;

const OFFERS_PER_PAGE = 4;

const extractFiltersWithDefaults = (props: Props): Props => {
  return {
    brand: props.brand || "",
    name: props.name || "",
    exchangeTokenAddress: props.exchangeTokenAddress || "",
    sellerId: props.sellerId || "",
    orderDirection: props.orderDirection,
    orderBy: props.orderBy || "",
    exchangeOrderBy: props.exchangeOrderBy || "",
    sortOrderDirectionParameter: props.sortOrderDirectionParameter,
    sortOrderByParameter: props.sortOrderByParameter,
    sortExchangeOrderByParameter: props.sortExchangeOrderByParameter,
    sortValidFromDate_lte: props.sortValidFromDate_lte || "",
    sortValue: "",
    queryState: props.queryState
  };
};
export default function ExploreOffers(props: Props) {
  const {
    brand,
    name,
    exchangeTokenAddress,
    sellerId,
    orderDirection,
    orderBy
  } = extractFiltersWithDefaults(props);
  const params = useParams();
  const navigate = useKeepQueryParamsNavigate();

  const updateUrl = useCallback(
    (index: number) => {
      return updatePageIndexInUrl(navigate)(index, {
        value: props?.queryState?.sortValue || props.sortValue || "",
        orderDirection:
          (props?.queryState?.sortOrderDirectionParameter as "asc" | "desc") ||
          (props.sortOrderDirectionParameter as "asc" | "desc || "),
        orderBy:
          props?.queryState?.sortOrderByParameter ||
          props.sortOrderByParameter ||
          "",
        exchangeOrderBy:
          props?.queryState?.sortExchangeOrderByParameter ||
          props.sortExchangeOrderByParameter ||
          "",
        validFromDate_lte:
          props?.queryState?.sortValidFromDate_lte ||
          props.sortValidFromDate_lte ||
          ""
      });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      props.queryState,
      props.sortExchangeOrderByParameter,
      props.sortOrderByParameter,
      props.sortOrderDirectionParameter,
      props.sortValidFromDate_lte
    ]
  );
  const initialPageIndex = Math.max(
    0,
    params[UrlParameters.page]
      ? Number(params[UrlParameters.page]) - 1
      : DEFAULT_PAGE
  );
  const [allOffers, setAllOffers] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [pageIndex2, setPageIndex2] = useState(initialPageIndex);

  // const OFFERS_PER_PAGE = useMemo(() => {
  //   if (props.rows) {
  //     return 4 * props.rows;
  //   }
  //   return 4;
  // }, [props.rows]);

  const parseOrderBy = useMemo(() => {
    if (
      props.orderBy === "priceLowToHigh" ||
      props.orderBy === "priceHightToLow" ||
      props.orderBy === "committedDate" ||
      props.orderBy === "redeemedDate"
    ) {
      return "createdAt";
    }
    return props.orderBy || "createdAt";
  }, [props.orderBy]);

  const useOffersPayload = {
    brand,
    name,
    voided: false,
    valid: true,
    exchangeTokenAddress,
    quantityAvailable_gte: 1,
    sellerId,
    // TODO: comment this out once we can request offers with valid metadata directly as requesting 1 extra offer should be enough
    // first: OFFERS_PER_PAGE + 1,
    first:
      props.orderBy === "priceLowToHigh" || props.orderBy === "priceHightToLow"
        ? 99
        : OFFERS_PER_PAGE * 2,
    skip: OFFERS_PER_PAGE * pageIndex,
    orderBy: parseOrderBy,
    orderDirection: props.orderDirection
      ? props.orderDirection
      : ("asc" as const),
    exchangeOrderBy: props.exchangeOrderBy !== "" ? props.exchangeOrderBy : ""
  };

  const prevProps = usePrevious(props);
  const {
    brand: prevBrand,
    name: prevName,
    exchangeTokenAddress: prevExchangeTokenAddress,
    sellerId: prevSellerId
  } = extractFiltersWithDefaults(prevProps || {});

  useEffect(() => {
    /**
     * if the filters change, you should be redirected to the first page
     */
    if (
      brand !== prevBrand ||
      name !== prevName ||
      exchangeTokenAddress !== prevExchangeTokenAddress ||
      sellerId !== prevSellerId
    ) {
      setPageIndex(DEFAULT_PAGE);
      updateUrl(DEFAULT_PAGE);
    }
  }, [
    brand,
    name,
    exchangeTokenAddress,
    sellerId,
    prevBrand,
    prevName,
    prevExchangeTokenAddress,
    prevSellerId,
    updateUrl
  ]);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    ...rest
  } = useInfiniteOffers(
    {
      first: OFFERS_PER_PAGE + 1
    },
    {
      keepPreviousData: true
    }
  );
  const offersWithOneExtra = data?.pages[data.pages.length - 1];
  const thereAreMoreOffers =
    (offersWithOneExtra?.length || 0) >= OFFERS_PER_PAGE + 1;

  useEffect(() => {
    if (isLoading || !thereAreMoreOffers || isFetchingNextPage) {
      return;
    } else {
      const nextPageIndex = pageIndex2 + 1;
      setPageIndex2(nextPageIndex);
      fetchNextPage({ pageParam: nextPageIndex * OFFERS_PER_PAGE });
    }
  }, [
    isLoading,
    thereAreMoreOffers,
    fetchNextPage,
    pageIndex2,
    isFetchingNextPage
  ]);

  useEffect(() => {
    if (thereAreMoreOffers === false) {
      const allOffers =
        data?.pages.flatMap((page) => {
          const allButLast =
            page.length === OFFERS_PER_PAGE + 1
              ? page.slice(0, page.length - 1)
              : page;
          return allButLast;
        }) || [];
      setAllOffers(allOffers);
    }
  }, [thereAreMoreOffers]); // eslint-disable-line

  const sortingOrder = useMemo(() => {
    if (props.orderBy === "priceHightToLow") {
      return "desc";
    }
    if (props.orderBy === "priceLowToHigh") {
      return "asc";
    }
    return "desc";
  }, [props.orderBy]);

  const { offerArray } = useSortByPrice({
    offers: allOffers,
    order: sortingOrder,
    isSortable:
      props.orderBy === "priceLowToHigh" || props.orderBy === "priceHightToLow"
  });

  useEffect(() => {
    if (props.queryState) {
      updateUrl(pageIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, props.queryState]);

  return (
    <Container>
      <OfferList
        offers={offerArray?.slice(0, OFFERS_PER_PAGE)}
        isError={isError}
        isLoading={isLoading || isFetchingNextPage}
        action="commit"
        showInvalidOffers={false}
        itemsPerRow={{
          xs: 1,
          s: 2,
          m: 4,
          l: 4,
          xl: 4
        }}
        breadcrumbs={props.breadcrumbs}
      />
      {!props.hidePagination && (
        <PaginationWrapper>
          <Pagination
            defaultPage={pageIndex}
            isNextEnabled={(offerArray?.length || 0) >= OFFERS_PER_PAGE + 1}
            isPreviousEnabled={(offerArray?.length || 0) > 0}
            onChangeIndex={(index) => {
              setPageIndex(index);
              updateUrl(index);
            }}
          />
        </PaginationWrapper>
      )}
    </Container>
  );
}
