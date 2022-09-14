import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import OfferList from "../../components/offers/OfferList";
import {
  ExploreQueryParameters,
  UrlParameters
} from "../../lib/routing/parameters";
import { Offer } from "../../lib/types/offer";
import { useOffers } from "../../lib/utils/hooks/offers";
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
  orderBy?: string;
}

const updatePageIndexInUrl =
  (
    navigate: ReturnType<typeof useKeepQueryParamsNavigate> // eslint-disable-line
  ) =>
  (
    index: number,
    queryParams: { [x in keyof typeof ExploreQueryParameters]: string }
  ): void => {
    const queryParamsUrl = new URLSearchParams( // eslint-disable-line
      Object.entries(queryParams).filter(([, value]) => value !== "")
    ).toString();
    // if (index === 0) {
    //   navigate({
    //     pathname: BosonRoutes.Products,
    //     search: queryParamsUrl
    //   });
    // } else {
    //   navigate({
    //     pathname: generatePath(BosonRoutes.ExplorePageByIndex, {
    //       [UrlParameters.page]: index + 1 + ""
    //     }),
    //     search: queryParamsUrl
    //   });
    // }
  };

const DEFAULT_PAGE = 0;

const extractFiltersWithDefaults = (props: Props): Props => {
  return {
    brand: props.brand || "",
    name: props.name || "",
    exchangeTokenAddress: props.exchangeTokenAddress || "",
    sellerId: props.sellerId || "",
    orderDirection: props.orderDirection || undefined,
    orderBy: props.orderBy || undefined
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
    (index: number) =>
      updatePageIndexInUrl(navigate)(index, {
        name: name ?? "",
        currency: exchangeTokenAddress ?? "",
        seller: sellerId ?? "",
        orderDirection: orderDirection ?? "",
        orderBy: orderBy ?? ""
      }),
    [navigate, name, exchangeTokenAddress, sellerId, orderDirection, orderBy]
  );
  const initialPageIndex = Math.max(
    0,
    params[UrlParameters.page]
      ? Number(params[UrlParameters.page]) - 1
      : DEFAULT_PAGE
  );
  const [pageIndex, setPageIndex] = useState(initialPageIndex);

  const OFFERS_PER_PAGE = useMemo(() => {
    if (props.rows) {
      return 4 * props.rows;
    }
    return 4;
  }, [props.rows]);

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
    first: OFFERS_PER_PAGE * 2,
    skip: OFFERS_PER_PAGE * pageIndex,
    orderBy: props.orderBy || "createdAt",
    orderDirection: props.orderDirection
      ? props.orderDirection
      : ("asc" as const)
  };
  const {
    data: currentAndNextPageOffers,
    isLoading,
    isError,
    isFetched
  } = useOffers(useOffersPayload);

  const prevProps = usePrevious(props);
  const {
    brand: prevBrand,
    name: prevName,
    exchangeTokenAddress: prevExchangeTokenAddress,
    sellerId: prevSellerId
  } = extractFiltersWithDefaults(prevProps || {});

  useEffect(() => {
    if (isFetched && !currentAndNextPageOffers?.length) {
      /**
       * if you go directly to a page without any offers,
       * you'll be redirected to the first page
       */
      setPageIndex(DEFAULT_PAGE);
      updateUrl(DEFAULT_PAGE);
    }
  }, [currentAndNextPageOffers, isFetched, updateUrl]);

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
  const { data: firstPageOffers } = useOffers(
    {
      ...useOffersPayload
      // TODO: 1 offer should be enough once we can request offers with valid metadata directly
      // first: 1,
      // skip: 0
    },
    {
      enabled: pageIndex > 0 && !currentAndNextPageOffers?.length
    }
  );
  const offers = currentAndNextPageOffers?.slice(0, OFFERS_PER_PAGE);

  return (
    <Container>
      <OfferList
        offers={offers}
        isError={isError}
        isLoading={isLoading}
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
            isNextEnabled={
              (currentAndNextPageOffers?.length || 0) >= OFFERS_PER_PAGE + 1
            }
            isPreviousEnabled={(firstPageOffers?.length || 0) > 0}
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
