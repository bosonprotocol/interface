import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { useMemo } from "react";

// import { colors } from "../../styles/colors";
import { getDateTimestamp } from "../getDateTimestamp";
import { Exchange } from "./useExchanges";

// TODO: ADD MISSING COLORS AND BACKGROUND FOR SPECIFIC DISPUTE SUB STATUS
export function useDisputeSubStatusInfo(exchange: Exchange) {
  const disputeInfo = useMemo(() => {
    const currentTime = dayjs();
    let status = "";
    let color = "";
    let background = "";
    if (exchange?.disputed) {
      // RESOLVING
      if (
        exchange?.dispute?.state === subgraph.DisputeState.Resolving &&
        exchange.redeemedDate &&
        exchange.offer.fulfillmentPeriodDuration &&
        dayjs(
          getDateTimestamp(exchange.redeemedDate) +
            getDateTimestamp(exchange.offer.fulfillmentPeriodDuration)
        ).isAfter(currentTime) &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Resolving";
        color = "";
        background = "";
      }
      // RETRACTED
      if (
        exchange?.dispute?.state === subgraph.DisputeState.Retracted &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Retracted";
        color = "";
        background = "";
      }
      // RESOLVED
      if (
        exchange?.dispute?.state === subgraph.DisputeState.Resolved &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Resolved";
        color = "";
        background = "";
      }
      // DISPUTE EXPIRED
      if (
        exchange.state !== subgraph.ExchangeState.Completed &&
        exchange.redeemedDate &&
        exchange.offer.fulfillmentPeriodDuration &&
        dayjs(
          getDateTimestamp(exchange.redeemedDate) +
            getDateTimestamp(exchange.offer.fulfillmentPeriodDuration)
        ).isBefore(currentTime)
      ) {
        status = "Dispute expired";
        color = "";
        background = "";
      }
      // ESCALATED
      if (
        exchange?.dispute?.state === subgraph.DisputeState.Escalated &&
        exchange.state !== subgraph.ExchangeState.Completed &&
        exchange.dispute?.escalatedDate &&
        exchange.offer?.disputeResolver?.escalationResponsePeriod &&
        dayjs(
          getDateTimestamp(exchange.dispute.escalatedDate) +
            getDateTimestamp(
              exchange.offer.disputeResolver.escalationResponsePeriod
            )
        ).isAfter(currentTime)
      ) {
        status = "Escalated";
        color = "";
        background = "";
      }
      // DECIDED
      if (
        exchange.dispute?.state === subgraph.DisputeState.Decided &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Decided";
        color = "";
        background = "";
      }
      // REFUSED
      if (
        exchange.dispute?.state === subgraph.DisputeState.Refused &&
        exchange.state !== subgraph.ExchangeState.Completed
      ) {
        status = "Decided";
        color = "";
        background = "";
      }
      // ESCALATION EXPIRED NOT FINISHED
      if (
        exchange.dispute?.state === subgraph.DisputeState.Escalated &&
        exchange.state !== subgraph.ExchangeState.Completed &&
        exchange.dispute.escalatedDate &&
        exchange.offer.disputeResolver.escalationResponsePeriod &&
        dayjs(
          getDateTimestamp(exchange.dispute.escalatedDate) +
            getDateTimestamp(
              exchange.offer.disputeResolver.escalationResponsePeriod
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
