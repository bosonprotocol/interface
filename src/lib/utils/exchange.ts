import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";

import { getDateTimestamp } from "./getDateTimestamp";
import { Exchange } from "./hooks/useExchanges";

export const isExchangeCompletableBySeller = (exchange: Exchange) => {
  let isRedeemedAndFulfillmentPeriodInPast = false;

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
    isRedeemedAndFulfillmentPeriodInPast = !!dayjs(disputePeriodTime).isBefore(
      dayjs()
    );
  }

  return isRedeemedAndFulfillmentPeriodInPast;
};

export const isExchangeCompletableByBuyer = (exchange: Exchange) => {
  return (
    exchange.state === subgraph.ExchangeState.Redeemed &&
    !exchange.finalizedDate
  );
};
