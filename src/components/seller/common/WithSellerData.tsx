import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import { subgraph } from "@bosonprotocol/react-kit";
import React, { useMemo } from "react";
import styled from "styled-components";

import { CONFIG } from "../../../lib/config";
import { Offer } from "../../../lib/types/offer";
import { useOffers } from "../../../lib/utils/hooks/offers/useOffers";
import useProducts from "../../../lib/utils/hooks/product/useProducts";
import { Exchange, useExchanges } from "../../../lib/utils/hooks/useExchanges";
import {
  ExchangeTokensProps,
  useExchangeTokens
} from "../../../lib/utils/hooks/useExchangeTokens";
import {
  SellerProps,
  useSellerDeposit
} from "../../../lib/utils/hooks/useSellerDeposit";
import {
  SellerRolesProps,
  useSellerRoles
} from "../../../lib/utils/hooks/useSellerRoles";
import useFunds, { FundsProps } from "../../../pages/account/funds/useFunds";
import { useConvertionRate } from "../../convertion-rate/useConvertionRate";
import Loading from "../../ui/Loading";
import { SellerInsideProps } from "../SellerInside";
import useOffersBacked from "./useOffersBacked";

export const Wrapper = styled.div`
  text-align: center;
`;

interface QueryProps {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}
interface ExchangesProps extends QueryProps {
  data: Exchange[] | undefined;
}
interface OffersProps extends QueryProps {
  data: Offer[] | undefined;
}
interface ExchangesTokensProps extends QueryProps {
  data: ExchangeTokensProps[] | undefined;
}
interface SellerDepositProps extends QueryProps {
  data: SellerProps | undefined;
}
export interface BackedProps {
  token: string;
  value: number | null;
}
export interface OffersBackedProps {
  offersBacked: BackedProps[];
  calcOffersBacked: {
    [x: string]: string;
  };
  sellerLockedFunds: {
    [x: string]: string;
  };
  threshold: number;
  displayWarning: boolean;
  offersBackedFn: (fund: subgraph.FundsEntityFieldsFragment) => number | null;
}

export interface WithSellerDataProps {
  exchanges: ExchangesProps;
  offers: OffersProps;
  products: ReturnType<typeof useProducts>;
  funds: FundsProps;
  exchangesTokens: ExchangesTokensProps;
  sellerDeposit: SellerDepositProps;
  offersBacked: OffersBackedProps;
  sellerRoles: SellerRolesProps;
}
export function WithSellerData(
  WrappedComponent: React.ComponentType<SellerInsideProps & WithSellerDataProps>
) {
  const ComponentWithSellerData = (props: SellerInsideProps) => {
    const sellerId = CONFIG.mockSellerId || props.sellerId;
    const sellerRoles = useSellerRoles(sellerId);
    const {
      store: { tokens }
    } = useConvertionRate();

    const products = useProducts(
      {
        productsFilter: {
          sellerId
        }
      },
      {
        enabled: !!sellerId,
        enableCurationList: false,
        refetchOnMount: true
      }
    );

    const offers = useOffers({
      sellerId,
      first: 1000,
      orderBy: "createdAt",
      orderDirection: "desc"
    });
    const exchanges = useExchanges({
      sellerId,
      disputed: null
    });
    const exchangesTokens = useExchangeTokens(
      {
        sellerId
      },
      {
        enabled: !!sellerId
      }
    );
    const sellerDeposit = useSellerDeposit(
      {
        sellerId
      },
      { enabled: !!sellerId }
    );
    const funds = useFunds(sellerId, tokens);

    const newProps = useMemo(
      () => ({
        sellerId,
        offers,
        products,
        exchanges,
        exchangesTokens,
        sellerDeposit,
        funds,
        sellerRoles
      }),
      [
        sellerId,
        offers,
        products,
        exchanges,
        exchangesTokens,
        sellerDeposit,
        funds,
        sellerRoles
      ]
    );

    const offersBacked = useOffersBacked({ ...newProps });

    if (
      offers.isLoading ||
      products.isLoading ||
      exchanges.isLoading ||
      exchangesTokens.isLoading ||
      sellerDeposit.isLoading
    ) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }
    return (
      <WrappedComponent {...props} {...newProps} offersBacked={offersBacked} />
    );
  };
  return ComponentWithSellerData;
}
