import { subgraph } from "@bosonprotocol/react-kit";
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
    case subgraph.EventType.BUYER_COMMITTED:
      return {
        label: `Committed to offer with id: ${offerId}`,
        pathname: offerPath
      };
    case subgraph.EventType.BUYER_CREATED:
      return { label: "Buyer created" };
    case subgraph.EventType.DISPUTE_DECIDED:
      return {
        label: `Decided dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DISPUTE_ESCALATED:
      return {
        label: `Escalated dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DISPUTE_RETRACTED:
      return {
        label: `Retracted dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DISPUTE_TIMEOUT_EXTENDED:
      return {
        label: `Dispute timeout extended with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DISPUTE_RAISED:
      return {
        label: `Raised dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.DISPUTE_RESOLVED:
      return {
        label: `Resolved dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.ESCALATED_DISPUTE_REFUSED:
      return {
        label: `Refused dispute with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.EXCHANGE_COMPLETED:
      return {
        label: `Complete exchange with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.FUNDS_DEPOSITED:
      return { label: `Funds deposited` };
    case subgraph.EventType.FUNDS_ENCUMBERED:
      return { label: `Funds encumbered` };
    case subgraph.EventType.FUNDS_RELEASED:
      return { label: `Funds released` };
    case subgraph.EventType.FUNDS_WITHDRAWN:
      return { label: `Funds withdrawn` };
    case subgraph.EventType.OFFER_CREATED:
      return {
        label: `Created offer with id: ${offerId || "pending"}`,
        pathname: offerPath
      };
    case subgraph.EventType.OFFER_VOIDED:
      return {
        label: `Voided offer with id: ${offerId}`,
        pathname: offerPath
      };
    case subgraph.EventType.VOUCHER_CANCELED:
      return {
        label: `Canceled offer with id: ${offerId}`,
        pathname: offerPath
      };
    case subgraph.EventType.VOUCHER_REDEEMED:
      return {
        label: `Redeemed offer with id: ${offerId}`,
        pathname: offerPath
      };
    case subgraph.EventType.VOUCHER_REVOKED:
      return {
        label: `Revoked voucher with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.VOUCHER_EXPIRED:
      return {
        label: `Expired voucher with id: ${exchangeOrDisputeId}`,
        pathname: exchangeOrDisputePath
      };
    case subgraph.EventType.SELLER_UPDATED:
      return { label: `Seller updated` };
    case subgraph.EventType.SELLER_CREATED:
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
