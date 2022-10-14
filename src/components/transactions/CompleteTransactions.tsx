import { subgraph } from "@bosonprotocol/core-sdk";
import { useMemo } from "react";
import { generatePath } from "react-router-dom";

import { BosonRoutes, OffersRoutes } from "../../lib/routing/routes";
import { useCompletedTransactions } from "../../lib/utils/hooks/transactions/useCompletedTransactions";
import Grid from "../ui/Grid";
import Loading from "../ui/Loading";
import TransactionsTable from "./TransactionsTable";

const buildTransactionLabelAndPath = (
  eventLog: subgraph.BaseEventLogFieldsFragment
): { label: string; pathname?: string } => {
  switch (eventLog.type) {
    case subgraph.EventType.BuyerCommitted:
      return {
        label: `Committed to offer with id: ${
          (eventLog as subgraph.ExchangeEventLog).exchange.offer.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.ExchangeEventLog).exchange.id
        })
      };
    case subgraph.EventType.BuyerCreated:
      return { label: "Buyer created" };
    case subgraph.EventType.DisputeDecided:
      return {
        label: `Decided dispute with id: ${
          (eventLog as subgraph.DisputeEventLog).dispute.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.DisputeEventLog).dispute.id
        })
      };
    case subgraph.EventType.DisputeEscalated:
      return {
        label: `Escalated dispute with id: ${
          (eventLog as subgraph.DisputeEventLog).dispute.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.DisputeEventLog).dispute.id
        })
      };
    case subgraph.EventType.DisputeRaised:
      return {
        label: `Raised dispute with id: ${
          (eventLog as subgraph.DisputeEventLog).dispute.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.DisputeEventLog).dispute.id
        })
      };
    case subgraph.EventType.DisputeResolved:
      return {
        label: `Resolved dispute with id: ${
          (eventLog as subgraph.DisputeEventLog).dispute.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.DisputeEventLog).dispute.id
        })
      };
    case subgraph.EventType.EscalatedDisputeRefused:
      return {
        label: `Refused dispute with id: ${
          (eventLog as subgraph.DisputeEventLog).dispute.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.DisputeEventLog).dispute.id
        })
      };
    case subgraph.EventType.ExchangeCompleted:
      return {
        label: `Complete exchange with id: ${
          (eventLog as subgraph.DisputeEventLog).dispute.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.DisputeEventLog).dispute.id
        })
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
        label: `Created offer with id: ${
          (eventLog as subgraph.OfferEventLog).offer.id
        }`,
        pathname: generatePath(OffersRoutes.OfferDetail, {
          id: (eventLog as subgraph.OfferEventLog).offer.id
        })
      };
    case subgraph.EventType.OfferVoided:
      return {
        label: `Voided offer with id: ${
          (eventLog as subgraph.OfferEventLog).offer.id
        }`,
        pathname: generatePath(OffersRoutes.OfferDetail, {
          id: (eventLog as subgraph.OfferEventLog).offer.id
        })
      };

    case subgraph.EventType.VoucherCanceled:
      return {
        label: `Canceled offer with id: ${
          (eventLog as subgraph.ExchangeEventLog).exchange.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.ExchangeEventLog).exchange.id
        })
      };

    case subgraph.EventType.VoucherRedeemed:
      return {
        label: `Redeemed offer with id: ${
          (eventLog as subgraph.ExchangeEventLog).exchange.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.ExchangeEventLog).exchange.id
        })
      };

    case subgraph.EventType.VoucherRevoked:
      return {
        label: `Revoked voucher with id: ${
          (eventLog as subgraph.ExchangeEventLog).exchange.id
        }`,
        pathname: generatePath(BosonRoutes.Exchange, {
          id: (eventLog as subgraph.ExchangeEventLog).exchange.id
        })
      };
    case subgraph.EventType.SellerUpdated:
      return { label: `Seller updated` };
    case subgraph.EventType.SellerCreated:
      return { label: `Seller created` };
    default:
      return { label: `Unknown transaction ${eventLog.type}` };
  }
};

const buildTableData = (
  eventLogs: Array<
    subgraph.BaseEventLogFieldsFragment & { accountType: string }
  >
) => {
  return eventLogs.map((log) => {
    const { label, pathname } = buildTransactionLabelAndPath(log);
    console.log({ label, pathname });
    return {
      accountType: log.accountType,
      transactionLabel: label,
      date: log.timestamp,
      hash: log.hash,
      pathname
    };
  });
};

export const CompletedTransactions = () => {
  // TODO: implement infinite scroll for table
  const { data } = useCompletedTransactions();

  const tableData = useMemo(() => buildTableData(data || []), [data]);

  if (data === undefined) {
    return <Loading />;
  }

  return (
    <Grid
      flexDirection="column"
      alignItems="flex-start"
      gap="0.75rem"
      margin="0 0 2rem 0"
    >
      <TransactionsTable transactions={tableData} />
    </Grid>
  );
};
