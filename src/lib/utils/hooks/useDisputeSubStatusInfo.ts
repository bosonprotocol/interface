import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { useMemo } from "react";

import { getDateTimestamp } from "../getDateTimestamp";
import { Exchange } from "./useExchanges";

// TODO: ADD MISSING COLORS AND BACKGROUND FOR SPECIFIC DISPUTE SUB STATUS
export function useDisputeSubStatusInfo(exchange: Exchange | null) {
  const disputeInfo = useMemo(() => {
    const currentTime = dayjs();
    let status = "";
    let color = "";
    let background = "";
    if (!exchange) {
      return {
        status,
        color,
        background
      };
    }
    if (exchange?.disputed) {
      if (
        exchange?.dispute?.state === subgraph.DisputeState.RESOLVING &&
        exchange.redeemedDate &&
        exchange.offer.disputePeriodDuration &&
        dayjs(
          getDateTimestamp(exchange.redeemedDate) +
            getDateTimestamp(exchange.offer.disputePeriodDuration)
        ).isAfter(currentTime) &&
        exchange.state !== subgraph.ExchangeState.COMPLETED
      ) {
        status = "Resolving";
        color = "";
        background = "";
      }
      if (
        exchange?.dispute?.state === subgraph.DisputeState.RETRACTED &&
        exchange.state !== subgraph.ExchangeState.COMPLETED
      ) {
        status = "Retracted";
        color = "";
        background = "";
      }
      if (
        exchange?.dispute?.state === subgraph.DisputeState.RESOLVED &&
        exchange.state !== subgraph.ExchangeState.COMPLETED
      ) {
        status = "Resolved";
        color = "";
        background = "";
      }
      if (
        exchange.state !== subgraph.ExchangeState.COMPLETED &&
        exchange.redeemedDate &&
        exchange.offer.disputePeriodDuration &&
        dayjs(
          getDateTimestamp(exchange.redeemedDate) +
            getDateTimestamp(exchange.offer.disputePeriodDuration)
        ).isBefore(currentTime)
      ) {
        status = "Dispute expired";
        color = "";
        background = "";
      }
      if (
        exchange?.dispute?.state === subgraph.DisputeState.ESCALATED &&
        exchange.state !== subgraph.ExchangeState.COMPLETED &&
        exchange.dispute?.escalatedDate &&
        exchange.offer?.disputeResolver?.escalationResponsePeriod &&
        dayjs(
          getDateTimestamp(exchange.dispute.escalatedDate) +
            getDateTimestamp(
              exchange.offer?.disputeResolver?.escalationResponsePeriod
            )
        ).isAfter(currentTime)
      ) {
        status = "Escalated";
        color = "";
        background = "";
      }
      if (
        exchange.dispute?.state === subgraph.DisputeState.DECIDED &&
        exchange.state !== subgraph.ExchangeState.COMPLETED
      ) {
        status = "Decided";
        color = "";
        background = "";
      }
      if (
        exchange.dispute?.state === subgraph.DisputeState.REFUSED &&
        exchange.state !== subgraph.ExchangeState.COMPLETED
      ) {
        status = "Refused";
        color = "";
        background = "";
      }
      if (
        exchange.dispute?.state === subgraph.DisputeState.ESCALATED &&
        exchange.state !== subgraph.ExchangeState.COMPLETED &&
        exchange.dispute.escalatedDate &&
        exchange?.offer?.disputeResolver?.escalationResponsePeriod &&
        dayjs(
          getDateTimestamp(exchange.dispute.escalatedDate) +
            getDateTimestamp(
              exchange.offer?.disputeResolver?.escalationResponsePeriod
            )
        ).isBefore(currentTime)
      ) {
        status = "Escalation expired";
      }
    }
    return {
      status,
      color,
      background
    };
  }, [exchange]);

  return {
    ...disputeInfo
  };
}
