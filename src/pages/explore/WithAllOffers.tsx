import { BigNumber, utils } from "ethers";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";
import { ParsedQuery } from "query-string";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import ConvertionRateContext from "../../components/convertion-rate/ConvertionRateContext";
import { LayoutRoot } from "../../components/Layout";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { convertPrice } from "../../lib/utils/convertPrice";
import { useInfiniteOffers } from "../../lib/utils/hooks/offers/useInfiniteOffers";
import { useIsCustomStoreValueChanged } from "../custom-store/useIsCustomStoreValueChanged";
import ExploreSelect from "./ExploreSelect";
import useSearchParams from "./useSearchParams";

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 auto 4rem auto;
  overflow: hidden;
`;
const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  align-items: center;
  justify-content: center;
  ${breakpoint.m} {
    flex-direction: row;
  }
`;
const ExploreOffersContainer = styled.div<{ $isPrimaryBgChanged: boolean }>`
  background: ${({ $isPrimaryBgChanged }) =>
    $isPrimaryBgChanged ? "var(--primaryBgColor)" : colors.lightGrey};
  padding: 3rem 0 4rem 0;
  min-height: 55.5vh;
`;
export const Wrapper = styled.div`
  text-align: center;
`;
interface ExtendedOffer extends Offer {
  convertedPrice?: string;
}
export interface FilterOptions {
  orderDirection?: "asc" | "desc";
  orderBy?: string;
  isSortable?: boolean;
  validFromDate?: string;
  validUntilDate?: string;
  exchangeOrderBy?: string;
  validFromDate_lte?: string;
}
export interface WithAllOffersProps {
  offers?: ExtendedOffer[];
  isLoading?: boolean;
  isError?: boolean;
  showoffPage?: number;
  offersPerPage?: number;
  params?: ParsedQuery<string>;
  handleChange: (name: string, value: string) => void;
  pageOptions: {
    itemsPerPage: number;
    pagination: boolean;
    type: string[];
  };
  filterOptions?: FilterOptions;
}
const DEFAULT_PAGE = 0;
const OFFERS_PER_PAGE = 999;
const SHOWOFF_PAGE = 4;
const ITEMS_PER_PAGE = 12;
export function WithAllOffers<P>(
  WrappedComponent: React.ComponentType<WithAllOffersProps>
) {
  const ComponentWithAllOffers = (props: P) => {
    const { store } = useContext(ConvertionRateContext);

    const location = useLocation();
    const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);
    const { params, handleChange } = useSearchParams();

    const isPrimaryBgColorChanged =
      useIsCustomStoreValueChanged("primaryBgColor");

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
      const filterByName = params?.[ExploreQueryParameters.name] || false;
      const sortByParam =
        params?.[ExploreQueryParameters.sortBy]?.includes("price:asc") ||
        params?.[ExploreQueryParameters.sortBy]?.includes("price:desc") ||
        params?.[ExploreQueryParameters.sortBy]?.includes("createdAt:desc") ||
        params?.[ExploreQueryParameters.sortBy]?.includes(
          "validFromDate:desc"
        ) ||
        params?.[ExploreQueryParameters.sortBy]?.includes(
          "committedDate:desc"
        ) ||
        params?.[ExploreQueryParameters.sortBy]?.includes("redeemedDate:desc")
          ? params?.[ExploreQueryParameters.sortBy]
          : false;

      let payload;
      const basePayload = {
        orderDirection: "",
        orderBy: "",
        isSortable: false
      };

      if (filterByName !== false) {
        payload = {
          ...basePayload,
          name: filterByName
        };
      }
      if (sortByParam !== false) {
        const [orderBy, orderDirection] = (sortByParam as string).split(":");
        if (orderBy === "committedDate" || orderBy === "redeemedDate") {
          payload = {
            ...basePayload,
            ...payload,
            orderDirection: orderDirection,
            orderBy: "createdAt",
            exchangeOrderBy: orderBy,
            isSortable: true
          };
        } else if (orderBy === "validFromDate") {
          payload = {
            ...basePayload,
            ...payload,
            orderDirection: orderDirection,
            orderBy: orderBy,
            validFromDate_lte: `${Math.floor(Date.now() / 1000)}`
          };
        } else {
          payload = {
            ...basePayload,
            ...payload,
            orderDirection: orderDirection,
            orderBy: orderBy === "price" ? "createdAt" : orderBy,
            exchangeOrderBy: orderBy,
            isSortable: orderBy === "price"
          };
        }
      }
      return pick(payload, [
        "name",
        "exchangeOrderBy",
        "isSortable",
        "orderBy",
        "orderDirection",
        "validFromDate_lte"
      ]) as FilterOptions;
    }, [params]);

    const {
      data,
      isLoading,
      isError,
      isFetchingNextPage,
      refetch,
      fetchNextPage
    } = useInfiniteOffers(
      { first: OFFERS_PER_PAGE + 1, disableMemo: true, ...filterOptions },
      {
        enabled: !!filterOptions?.orderBy,
        keepPreviousData: false
      }
    );

    useEffect(() => {
      if (filterOptions?.isSortable === false) {
        refetch();
      }
    }, [filterOptions]); // eslint-disable-line

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
          return {
            ...offer,
            convertedPrice: offerPrice.converted,
            committedDate:
              sortBy(offer.exchanges, "committedDate")[0]?.committedDate || "0",
            redeemedDate:
              sortBy(offer.exchanges, "redeemedDate")[0]?.redeemedDate || "0"
          };
        }) || [];

      return sortedArray as ExtendedOffer[];
    }, [data, store.rates]);

    return (
      <ExploreContainer>
        <LayoutRoot>
          <TopContainer>
            <Typography tag="h2" $fontSize="2.25rem">
              Explore products
            </Typography>
            <Grid justifyContent="flex-end">
              <ExploreSelect params={params} handleChange={handleChange} />
            </Grid>
          </TopContainer>
        </LayoutRoot>
        <ExploreOffersContainer $isPrimaryBgChanged={isPrimaryBgColorChanged}>
          <LayoutRoot>
            {isLoading || thereAreMoreOffers || isFetchingNextPage ? (
              <Wrapper>
                <Loading />
              </Wrapper>
            ) : (
              <WrappedComponent
                {...props}
                isLoading={
                  isLoading || thereAreMoreOffers || isFetchingNextPage
                }
                isError={isError}
                showoffPage={4}
                offersPerPage={10}
                params={params}
                handleChange={handleChange}
                pageOptions={pageOptions}
                filterOptions={filterOptions}
                offers={allOffers}
              />
            )}
          </LayoutRoot>
        </ExploreOffersContainer>
      </ExploreContainer>
    );
  };
  return ComponentWithAllOffers;
}
