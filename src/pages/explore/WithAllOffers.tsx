import { subgraph } from "@bosonprotocol/react-kit";
import pick from "lodash/pick";
import { ParsedQuery } from "query-string";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { LayoutRoot } from "../../components/Layout";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import type { Offer } from "../../lib/types/offer";
import useProducts from "../../lib/utils/hooks/product/useProducts";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
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
interface PriceDetails {
  value: string;
  exchangeToken: {
    decimals: string;
    symbol: string;
  };
}
export interface OfferAdditional {
  isValid?: boolean;
  status?: string;
  uuid?: string;
  title?: string;
  brandName?: string;
  lowPrice?: string;
  highPrice?: string;
  priceDetails?: {
    low?: PriceDetails;
    high?: PriceDetails;
  };
  committedDate?: string;
  redeemedDate?: string;
  convertedPrice?: string;
  additional?: {
    product: subgraph.ProductV1Product;
    variants: subgraph.OfferFieldsFragment[];
  };
}
export type ExtendedOffer = OfferAdditional & Offer;
export interface SellerAdditional {
  title?: string;
  brandName?: string;
  createdAt?: string;
  validFromDate?: string;
  committedDate?: string;
  redeemedDate?: string;
  lowPrice?: string;
  highPrice?: string;
  additional?: {
    images: string[];
  };
  offers?: ExtendedOffer[];
  numExchanges?: number;
}
export type ExtendedSeller = SellerAdditional & subgraph.ProductV1Seller;
export interface FilterOptions {
  name?: string;
  sellerCurationList?: string[];
  orderDirection?: "asc" | "desc";
  orderBy?: string;
  validFromDate?: string;
  validUntilDate?: string;
  exchangeOrderBy?: string;
  validFromDate_lte?: string;
}
export interface ExtendedProducts {
  products?: ExtendedOffer[];
  sellers?: ExtendedSeller[];
  isLoading?: boolean;
  isError?: boolean;
}
export interface WithAllOffersProps {
  products?: ExtendedProducts;
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
const SHOWOFF_PAGE = 4;
const ITEMS_PER_PAGE = 12;
export function WithAllOffers<P>(
  WrappedComponent: React.ComponentType<WithAllOffersProps>
) {
  const ComponentWithAllOffers = (props: P) => {
    const location = useLocation();
    const { params, handleChange } = useSearchParams();

    const isPrimaryBgColorChanged =
      useIsCustomStoreValueChanged("primaryBgColor");
    const sellerCurationListString =
      useCustomStoreQueryParameter("sellerCurationList");

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
      const sellerCurationList = sellerCurationListString
        .split(",")
        .filter(isTruthy);

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

      let payload = {
        name: "",
        sellerCurationList,
        orderDirection: "",
        exchangeOrderBy: "",
        orderBy: ""
      };

      if (filterByName !== false) {
        payload = {
          ...payload,
          name: filterByName as string
        };
      }
      if (sellerCurationList) {
        payload = {
          ...payload,
          sellerCurationList
        };
      }
      if (sortByParam !== false) {
        const [orderBy, orderDirection] = (sortByParam as string).split(":");
        payload = {
          ...payload,
          orderBy,
          exchangeOrderBy: orderBy as string,
          orderDirection
        };
      }
      return pick(payload, [
        "name",
        "exchangeOrderBy",
        "orderBy",
        "orderDirection",
        "validFromDate_lte",
        "sellerCurationList"
      ]) as FilterOptions;
    }, [params, sellerCurationListString]);

    const products = useProducts(
      {
        onlyNotVoided: true,
        onlyValid: true
      },
      {
        enableCurationList: true,
        withNumExchanges: true
      }
    );
    const { isLoading, isError } = products;

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
            {isLoading ? (
              <Wrapper>
                <Loading />
              </Wrapper>
            ) : (
              <WrappedComponent
                {...props}
                isLoading={isLoading}
                isError={isError}
                showoffPage={4}
                offersPerPage={10}
                params={params}
                handleChange={handleChange}
                pageOptions={pageOptions}
                filterOptions={filterOptions}
                products={products}
              />
            )}
          </LayoutRoot>
        </ExploreOffersContainer>
      </ExploreContainer>
    );
  };
  return ComponentWithAllOffers;
}
