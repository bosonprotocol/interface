import { BigNumber, utils } from "ethers";
import omit from "lodash/omit";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import ConvertionRateContext from "../../components/convertion-rate/ConvertionRateContext";
import Loading from "../../components/ui/Loading";
import { CONFIG } from "../../lib/config";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { Offer } from "../../lib/types/offer";
import { convertPrice } from "../../lib/utils/convertPrice";
import { useInfiniteOffers } from "../../lib/utils/hooks/offers/useInfiniteOffers";
import useSearchParams from "./useSearchParams";

export const Wrapper = styled.div`
  text-align: center;
`;
interface ExtendedOffer extends Offer {
  convertedPrice?: string;
}
export interface WithAllOffersProps {
  offers?: ExtendedOffer[];
  isLoading?: boolean;
  isError?: any;
  showoffPage?: number;
  offersPerPage?: number;
  params?: any;
  handleChange?: any;
  pageOptions?: any;
  filterOptions?: any;
  refetch?: any;
}
const DEFAULT_PAGE = 0;
const OFFERS_PER_PAGE = 999;
const SHOWOFF_PAGE = 4;
const ITEMS_PER_PAGE = 10;
export function WithAllOffers<P>(
  WrappedComponent: React.ComponentType<WithAllOffersProps>
) {
  const ComponentWithAllOffers = (props: P) => {
    const { store } = useContext(ConvertionRateContext);

    const location = useLocation();
    const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);
    const { params, handleChange } = useSearchParams();

    const pageOptions = useMemo(() => {
      let options = {
        pagination: true,
        itemsPerPage: ITEMS_PER_PAGE || 10,
        type: ["Sellers", "Products"]
      };
      if (location?.pathname === BosonRoutes.Explore) {
        options = {
          ...options,
          pagination: false,
          itemsPerPage: SHOWOFF_PAGE || 4
        };
      }
      if (location?.pathname === BosonRoutes.Products) {
        options = {
          ...options,
          type: ["Products"]
        };
      }
      if (location?.pathname === BosonRoutes.Sellers) {
        options = {
          ...options,
          type: ["Sellers"]
        };
      }

      return options;
    }, [location.pathname]); // eslint-disable-line

    const filterOptions = useMemo(() => {
      const sortBy = params?.[ExploreQueryParameters.sortBy] || false;
      let payload = {
        orderDirection: "",
        orderBy: "",
        validFromDate: "",
        validUntilDate: "",
        exchangeOrderBy: "",
        validFromDate_lte: ""
      };

      if (sortBy !== false) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [orderBy, orderDirection] = sortBy.split(":");
        if (orderBy === "committedDate" || orderBy === "redeemedDate") {
          payload = {
            ...payload,
            orderDirection: orderDirection,
            orderBy: "createdAt",
            exchangeOrderBy: orderBy
          };
        } else if (orderBy === "validFromDate") {
          payload = {
            ...payload,
            orderDirection: orderDirection,
            orderBy: orderBy,
            validFromDate_lte: `${Math.floor(Date.now() / 1000)}`
          };
        } else {
          payload = {
            ...payload,
            orderDirection: orderDirection,
            orderBy: orderBy
          };
        }
      }
      return payload;
    }, [params]);

    const infinityParams = useMemo(
      () => ({
        first: OFFERS_PER_PAGE + 1,
        ...omit(filterOptions, ["validFromDate", "validUntilDate" ]) // prettier-ignore
      }),
      [filterOptions]
    );

    const {
      data,
      isLoading,
      isError,
      refetch,
      isFetchingNextPage,
      fetchNextPage
    } = useInfiniteOffers(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      infinityParams,
      {
        keepPreviousData: true
      }
    );

    useEffect(() => {
      if (infinityParams.orderBy !== "price") {
        refetch();
      }
    }, [infinityParams]); // eslint-disable-line

    const thereAreMoreOffers = useMemo(() => {
      const offersWithOneExtra = data?.pages[data.pages.length - 1];
      return (offersWithOneExtra?.length || 0) >= OFFERS_PER_PAGE + 1;
    }, [data]);

    useEffect(() => {
      if (isLoading || !thereAreMoreOffers || isFetchingNextPage) {
        return;
      } else {
        const nextPageIndex = pageIndex + 1;
        setPageIndex(nextPageIndex);
        fetchNextPage({ pageParam: nextPageIndex * OFFERS_PER_PAGE });
      }
    }, [
      isLoading,
      thereAreMoreOffers,
      fetchNextPage,
      pageIndex,
      isFetchingNextPage
    ]);

    const itemPrice = (value: string, decimals: string) => {
      try {
        return utils.formatUnits(
          BigNumber.from(value.toString()),
          Number(decimals)
        );
      } catch (e) {
        return null;
      }
    };

    const allOffers = useMemo(() => {
      const items = data?.pages.flatMap((page) => {
        const allButLast =
          page.length === OFFERS_PER_PAGE + 1
            ? page.slice(0, page.length - 1)
            : page;
        return allButLast;
      });

      const sortedArray =
        items?.map((offer: Offer) => {
          const offerPrice = convertPrice({
            price: itemPrice(offer.price, offer.exchangeToken.decimals),
            symbol: offer.exchangeToken.symbol.toUpperCase(),
            currency: CONFIG.defaultCurrency,
            rates: store.rates,
            fixed: 8
          });
          return { ...offer, convertedPrice: offerPrice.converted };
        }) || [];

      return sortedArray as ExtendedOffer[];
    }, [data, store.rates]);

    const allProps = {
      isLoading: isLoading || thereAreMoreOffers || isFetchingNextPage,
      isError,
      showoffPage: 4,
      offersPerPage: 10,
      offers: allOffers,
      params,
      handleChange,
      pageOptions,
      filterOptions,
      refetch
    };

    if (allProps.isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }
    return <WrappedComponent {...props} {...allProps} />;
  };
  return ComponentWithAllOffers;
}
