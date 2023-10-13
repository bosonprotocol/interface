import { EnvironmentType, subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { BigNumber } from "ethers";

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
    getDateTimestamp(exchange.redeemedDate) +
      getDateTimestamp(offer.disputePeriodDuration) <
    Date.now()
  );
};

const PROTOCOL_DEPLOYMENT_TIMES = {
  v221: {
    local: 0,
    testing: 0, // Freshly deployed in v2.2.1
    staging: 1683872305, // Friday, May 12, 2023 6:18:25 AM
    production: 1684495020 // Friday, May 19, 2023 11:17:00 AM
  }
};

export const getExchangeTokenId = (
  exchange: Exchange,
  envName: EnvironmentType
): string => {
  if (
    Number(exchange.committedDate) < PROTOCOL_DEPLOYMENT_TIMES.v221[envName]
  ) {
    // Before v2.2.1, tokenId = exchangeId
    return exchange.id;
  }
  // Since v2.2.1, tokenId = exchangeId | offerId << 128
  return BigNumber.from(exchange.offer.id).shl(128).add(exchange.id).toString();
};

export const getExchangeDisputeDates = (exchange: Exchange) => {
  const raisedDisputeAt = new Date(getDateTimestamp(exchange.disputedDate));
  const lastDayToResolveDispute = new Date(
    raisedDisputeAt.getTime() +
      getDateTimestamp(exchange.offer.resolutionPeriodDuration)
  );
  const totalDaysToResolveDispute = dayjs(lastDayToResolveDispute).diff(
    raisedDisputeAt,
    "day"
  );
  const daysLeftToResolveDispute = Math.max(
    0,
    dayjs(lastDayToResolveDispute).diff(new Date().getTime(), "day")
  );
  return {
    raisedDisputeAt,
    lastDayToResolveDispute,
    totalDaysToResolveDispute,
    daysLeftToResolveDispute
  };
};
