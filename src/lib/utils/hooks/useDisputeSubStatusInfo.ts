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
        exchange?.dispute?.state === subgraph.DisputeState.Resolving &&
        exchange.redeemedDate &&
        exchange.offer.disputePeriodDuration &&
        dayjs(
          getDateTimestamp(exchange.redeemedDate) +
            getDateTimestamp(exchange.offer.disputePeriodDuration)
        ).isAfter(currentTime) &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Resolving";
        color = "";
        background = "";
      }
      if (
        exchange?.dispute?.state === subgraph.DisputeState.Retracted &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Retracted";
        color = "";
        background = "";
      }
      if (
        exchange?.dispute?.state === subgraph.DisputeState.Resolved &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Resolved";
        color = "";
        background = "";
      }
      if (
        exchange.state !== subgraph.ExchangeState.Completed &&
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
        exchange?.dispute?.state === subgraph.DisputeState.Escalated &&
        exchange.state !== subgraph.ExchangeState.Completed &&
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
        exchange.dispute?.state === subgraph.DisputeState.Decided &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Decided";
        color = "";
        background = "";
      }
      if (
        exchange.dispute?.state === subgraph.DisputeState.Refused &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Refused";
        color = "";
        background = "";
      }
      if (
        exchange.dispute?.state === subgraph.DisputeState.Escalated &&
        exchange.state !== subgraph.ExchangeState.Completed &&
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
