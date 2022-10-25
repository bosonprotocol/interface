import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";

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
                 return  !!dayjs(disputePeriodTime).isBefore(
      dayjs()
    );
  }

  return false;
};

export const isExchangeCompletableByBuyer = (exchange: Exchange) => {
  return (
    exchange.state === subgraph.ExchangeState.Redeemed &&
    !exchange.finalizedDate
  );
};
