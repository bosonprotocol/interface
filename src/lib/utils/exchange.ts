import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";

import { Offer } from "../types/offer";
import { getDateTimestamp } from "./getDateTimestamp";
import { Exchange } from "./hooks/useExchanges";

export const isExchangeCompletableBySeller = (exchange: Exchange) => {
  const isFulfilled =
    exchange.redeemedDate &&
    !exchange.disputedDate &&
    exchange.offer.disputePeriodDuration &&
    exchange.state !== subgraph.ExchangeState.Completed;

  if (isFulfilled) {
    const disputePeriodTime = dayjs(
      getDateTimestamp(exchange.redeemedDate || "") +
        getDateTimestamp(exchange.offer.disputePeriodDuration)
    );
    return !!dayjs(disputePeriodTime).isBefore(dayjs());
  }

  return false;
};

export const isExchangeCompletableByBuyer = (exchange: Exchange) => {
  return (
    exchange.state === subgraph.ExchangeState.Redeemed &&
    !exchange.finalizedDate
  );
};

export const getHasExchangeDisputeResolutionElapsed = (
  exchange: Exchange | undefined,
  offer: Offer
): boolean => {
  if (!exchange) {
    return false;
  }
  return (
    Number(exchange.redeemedDate) * 1000 +
      Number(offer.disputePeriodDuration) * 1000 <
    Date.now()
  );
};
