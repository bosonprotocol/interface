import { subgraph } from "@bosonprotocol/core-sdk";
import { generatePath } from "react-router-dom";

import { BosonRoutes, OffersRoutes } from "../routing/routes";

export type EventLog = Omit<subgraph.BaseEventLogFieldsFragment, "account"> & {
  exchange?: {
    id: string;
    offer?: {
      id: string;
    };
  };
  dispute?: {
    id: string;
  };
  offer?: {
    id: string;
  };
};

const buildTransactionLabelAndPath = (
  eventLog: EventLog
): { label: string; pathname?: string } => {
  const offerId = eventLog.offer?.id || eventLog.exchange?.offer?.id;
  const offerPath = offerId
    ? generatePath(OffersRoutes.OfferDetail, {
        id: offerId
      })
    : "/";

  const exchangeOrDisputeId = eventLog.exchange?.id || eventLog.dispute?.id;
  const exchangeOrDisputePath = exchangeOrDisputeId
    ? generatePath(BosonRoutes.Exchange, {
        id: exchangeOrDisputeId
      })
    : "/";

  switch (eventLog.type) {
    case subgraph.EventType.BuyerCommitted:
      return {
        label: `Committed to offer with id: ${offerId}`,
        pathname: offerPath
      };
    case subgraph.EventType.BuyerCreated:
      return { label: "Buyer created" };
    case subgraph.EventType.DisputeDecided:
      return {
        label: `Decided dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DisputeEscalated:
      return {
        label: `Escalated dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DisputeRetracted:
      return {
        label: `Retracted dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DisputeTimeoutExtended:
      return {
        label: `Dispute timeout extended with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DisputeRaised:
      return {
        label: `Raised dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DisputeResolved:
      return {
        label: `Resolved dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.EscalatedDisputeRefused:
      return {
        label: `Refused dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.ExchangeCompleted:
      return {
        label: `Complete exchange with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.FundsDeposited:
      return { label: `Funds deposited` };
    case subgraph.EventType.FundsEncumbered:
      return { label: `Funds encumbered` };
    case subgraph.EventType.FundsReleased:
      return { label: `Funds released` };
    case subgraph.EventType.FundsWithdrawn:
      return { label: `Funds withdrawn` };
    case subgraph.EventType.OfferCreated:
      return {
        label: `Created offer with id: ${offerId || "pending"}`,
        pathname: offerPath
      };
    case subgraph.EventType.OfferVoided:
      return {
        label: `Voided offer with id: ${offerId}`,
        pathname: offerPath
      };
    case subgraph.EventType.VoucherCanceled:
      return {
        label: `Canceled offer with id: ${offerId}`,
        pathname: offerPath
      };
    case subgraph.EventType.VoucherRedeemed:
      return {
        label: `Redeemed offer with id: ${offerId}`,
        pathname: offerPath
      };
    case subgraph.EventType.VoucherRevoked:
      return {
        label: `Revoked voucher with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.VoucherExpired:
      return {
        label: `Expired voucher with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.SellerUpdated:
      return { label: `Seller updated` };
    case subgraph.EventType.SellerCreated:
      return { label: `Seller created` };
    default:
      return { label: `Unknown transaction ${eventLog.type}` };
  }
};

export const buildTableData = (
  eventLogs: Array<EventLog & { accountType: string }>
) => {
  return eventLogs.map((log) => {
    const { label, pathname } = buildTransactionLabelAndPath(log);
    return {
      accountType: log.accountType,
      transactionLabel: label,
      date: log.timestamp,
      hash: log.hash,
      pathname
    };
  });
};
