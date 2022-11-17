import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import React, { useMemo } from "react";
import styled from "styled-components";

import { Offer } from "../../../lib/types/offer";
import { useOffers } from "../../../lib/utils/hooks/offers/useOffers";
import useInfinityProducts from "../../../lib/utils/hooks/product/useInfinityProducts";
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
interface OffersBackedProps {
  offersBacked: (number | null)[];
  calcOffersBacked: {
    [x: string]: string;
  };
  sellerLockedFunds: {
    [x: string]: string;
  };
  threshold: number;
  displayWarning: boolean;
}

export interface WithSellerDataProps {
  exchanges: ExchangesProps;
  offers: OffersProps;
  products: ReturnType<typeof useInfinityProducts>;
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
    const sellerId = props.sellerId;
    const sellerRoles = useSellerRoles(sellerId);
    const {
      store: { tokens }
    } = useConvertionRate();

    const products = useInfinityProducts(
      {
        showVoided: true,
        showExpired: true
      },
      {
        enableCurationList: false
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
