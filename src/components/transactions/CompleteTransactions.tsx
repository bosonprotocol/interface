import { useMemo } from "react";

import {
  CompleteTransactionLogs,
  useGetCompletedTxLogsByWallet
} from "../../lib/utils/hooks/getTransactions/getTransactions";
import Grid from "../ui/Grid";
import Loading from "../ui/Loading";
import TransactionsTable from "./TransactionsTable";
enum AccountType {
  BUYER = "Buyer",
  SELLER = "Seller",
  DISPUTE_RESOLVER = "Dispute resolver"
}

enum OfferTransactions {
  BUYER_COMMITTED = "BUYER_COMMITTED", // offer
  OFFER_CREATED = "OFFER_CREATED", //offer
  OFFER_VOIDED = "OFFER_VOIDED" // offer
}

export enum TransctionTypes {
  BUYER_COMMITTED = "BUYER_COMMITTED", // offer
  OFFER_CREATED = "OFFER_CREATED", //offer
  OFFER_VOIDED = "OFFER_VOIDED", // offer
  FUNDS_ENCUMBERED = "FUNDS_ENCUMBERED", // other
  VOUCHER_REDEEMED = "VOUCHER_REDEEMED", // exchange
  DISPUTE_RESOLVED = "DISPUTE_RESOLVED", // exchange
  DISPUTE_DECIDED = "DISPUTE_DECIDED", // exchange
  FUNDS_RELEASED = "FUNDS_RELEASED", // exchange
  DISPUTE_RAISED = "DISPUTE_RAISED", // exchange
  DISPUTE_ESCALATED = "DISPUTE_ESCALATED", // exchange
  ESCALATED_DISPUTE_REFUSED = "ESCALATED_DISPUTE_REFUSED", // exchange
  VOUCHER_REVOKED = "VOUCHER_REVOKED", // exchange
  VOUCHER_CANCELED = "VOUCHER_CANCELED", // exchange
  FUNDS_WITHDRAWN = "FUNDS_WITHDRAWN", // other
  BUYER_CREATED = "BUYER_CREATED", // other
  EXCHANGE_COMPLETED = "EXCHANGE_COMPLETED", // exchange
  FUNDS_DEPOSITED = "FUNDS_DEPOSITED",
  SELLER_CREATED = "SELLER_CREATED",
  UPDATE_SELLER = "UPDATE_SELLER"
}

const buildTransaction = (type: TransctionTypes): string => {
  switch (type) {
    case TransctionTypes.BUYER_COMMITTED:
      return "Committed to offer";
    case TransctionTypes.BUYER_CREATED:
      return "Buyer created";
    case TransctionTypes.DISPUTE_DECIDED:
      return "Decided dispute";
    case TransctionTypes.DISPUTE_ESCALATED:
      return "Escalated dispute";
    case TransctionTypes.DISPUTE_RAISED:
      return "Raised dispute";
    case TransctionTypes.DISPUTE_RESOLVED:
      return "Resolved dispute";
    case TransctionTypes.ESCALATED_DISPUTE_REFUSED:
      return "Refused dispute";
    case TransctionTypes.EXCHANGE_COMPLETED:
      return "Complete exchange";
    case TransctionTypes.FUNDS_DEPOSITED:
      return "Funds deposited";
    case TransctionTypes.FUNDS_ENCUMBERED:
      return "Funds encumbered";
    case TransctionTypes.FUNDS_RELEASED:
      return "Funds released";
    case TransctionTypes.FUNDS_WITHDRAWN:
      return "Funds Withdrawn";
    case TransctionTypes.OFFER_CREATED:
      return "Created offer";
    case TransctionTypes.OFFER_VOIDED:
      return "Voided offer";
    case TransctionTypes.VOUCHER_CANCELED:
      return "Canceled voucher";
    case TransctionTypes.VOUCHER_REDEEMED:
      return "Redeemed voucher";
    case TransctionTypes.VOUCHER_REVOKED:
      return "Revoked voucher";
    case TransctionTypes.SELLER_CREATED:
      return "Seller created";
    case TransctionTypes.UPDATE_SELLER:
      return "Seller updated";
    default:
      return `Not supported transaction ${type}`;
  }
};

const buildTableData = (data?: CompleteTransactionLogs) => {
  const buyers =
    data?.buyers[0]?.logs?.map((tx) => {
      const splitId = tx.id.split("-");
      const offerExchangeId = splitId[1];
      const buyerSellerID = splitId[2];

      return {
        account: AccountType.BUYER,
        transaction: buildTransaction(tx.type),
        date: tx.timestamp,
        executed: tx.executedBy,
        hash: tx.hash,
        offerExchangeId,
        buyerSellerID,
        isOffer: Object.values(OfferTransactions).includes(
          tx.type as unknown as OfferTransactions
        )
      };
    }) || [];

  const sellers =
    data?.sellers[0]?.logs?.map((tx) => {
      const splitId = tx.id.split("-");
      const offerExchangeId = splitId[1];
      const buyerSellerID = splitId[2];
      return {
        account: AccountType.SELLER,
        transaction: buildTransaction(tx.type),
        date: tx.timestamp,
        executed: tx.executedBy,
        hash: tx.hash,
        offerExchangeId,
        buyerSellerID,
        isOffer: Object.values(OfferTransactions).includes(
          tx.type as unknown as OfferTransactions
        )
      };
    }) || [];

  const disputeResolvers =
    data?.disputeResolvers[0]?.logs?.map((tx) => {
      const splitId = tx.id.split("-");
      const offerExchangeId = splitId[1];
      const buyerSellerID = splitId[2];
      return {
        account: AccountType.DISPUTE_RESOLVER,
        transaction: buildTransaction(tx.type),
        date: tx.timestamp,
        executed: tx.executedBy,
        hash: tx.hash,
        offerExchangeId,
        buyerSellerID,
        isOffer: Object.values(OfferTransactions).includes(
          tx.type as unknown as OfferTransactions
        )
      };
    }) || [];

  /**
   * TODO: this is not the best performante sort algorithm, good enought for the
   * amount of transaction that we have for
   * launch
   */
  const mixedList = [...buyers, ...sellers, ...disputeResolvers].sort(
    (a, b) => {
      return parseInt(b.date) - parseInt(a.date);
    }
  );

  return mixedList;
};

export const CompletedTransactions = () => {
  const { data } = useGetCompletedTxLogsByWallet();
  const tableData = useMemo(() => (data ? buildTableData(data) : []), [data]);

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
