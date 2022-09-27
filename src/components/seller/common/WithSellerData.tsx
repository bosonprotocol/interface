import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import React from "react";
import styled from "styled-components";

import { Offer } from "../../../lib/types/offer";
import { useOffers } from "../../../lib/utils/hooks/offers/useOffers";
import { Exchange, useExchanges } from "../../../lib/utils/hooks/useExchanges";
import {
  ExchangeTokensProps,
  useExchangeTokens
} from "../../../lib/utils/hooks/useExchangeTokens";
import {
  SellerProps,
  useSellerDeposit
} from "../../../lib/utils/hooks/useSellerDeposit";
import useFunds, { FundsProps } from "../../../pages/account/funds/useFunds";
import { useConvertionRate } from "../../convertion-rate/useConvertionRate";
import Loading from "../../ui/Loading";
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
  funds: FundsProps;
  exchangesTokens: ExchangesTokensProps;
  sellerDeposit: SellerDepositProps;
  offersBacked: OffersBackedProps;
}
export function WithSellerData<P>(
  WrappedComponent: React.ComponentType<P & WithSellerDataProps>
) {
  const ComponentWithSellerData = (props: P) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const sellerId = props.sellerId;
    const {
      store: { tokens }
    } = useConvertionRate();

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
    const exchangesTokens = useExchangeTokens({
      sellerId
    });
    const sellerDeposit = useSellerDeposit(
      {
        sellerId
      },
      { enabled: !!sellerId }
    );
    const funds = useFunds(sellerId, tokens);

    const newProps = {
      offers,
      exchanges,
      exchangesTokens,
      sellerDeposit,
      funds
    };

    const offersBacked = useOffersBacked({ ...newProps });

    if (
      offers.isLoading ||
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
