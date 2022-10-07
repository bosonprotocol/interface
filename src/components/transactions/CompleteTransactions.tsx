import {
  CompleteTransactionLogs,
  useGetCompletedTxLogsByWallet
} from "../../lib/utils/hooks/getTransactions/getTransactions";
import Grid from "../ui/Grid";
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
  SELLER_CREATED = "SELLER_CREATED"
}

const buildTransaction = (
  type: TransctionTypes,
  offerExchangeId: string
): string => {
  switch (type) {
    case TransctionTypes.BUYER_COMMITTED:
      return `Committed to offer with id: ${offerExchangeId}`;
    case TransctionTypes.BUYER_CREATED:
      return "Buyer created";
    case TransctionTypes.DISPUTE_DECIDED:
      return `Decided dispute with id: ${offerExchangeId}`;
    case TransctionTypes.DISPUTE_ESCALATED:
      return `Escalated dispute with id: ${offerExchangeId}`;
    case TransctionTypes.DISPUTE_RAISED:
      return `Raised dispute with id: ${offerExchangeId}`;
    case TransctionTypes.DISPUTE_RESOLVED:
      return `Resolved dispute with id: ${offerExchangeId}`;
    case TransctionTypes.ESCALATED_DISPUTE_REFUSED:
      return `Refused dispute with id: ${offerExchangeId}`;
    case TransctionTypes.EXCHANGE_COMPLETED:
      return `Complete exchange with id: ${offerExchangeId}`;
    case TransctionTypes.FUNDS_DEPOSITED:
      return `Funds deposited`;
    case TransctionTypes.FUNDS_ENCUMBERED:
      return `Funds encumbered`;
    case TransctionTypes.FUNDS_RELEASED:
      return `Funds released`;
    case TransctionTypes.FUNDS_WITHDRAWN:
      return `Funds Withdrawn}`;
    case TransctionTypes.OFFER_CREATED:
      return `Created offer with id: ${offerExchangeId}`;
    case TransctionTypes.OFFER_VOIDED:
      return `Voided offer with id: ${offerExchangeId}`;
    case TransctionTypes.VOUCHER_CANCELED:
      return `Canceled voucher with id: ${offerExchangeId}`;
    case TransctionTypes.VOUCHER_REDEEMED:
      return `Redeemed voucher with id: ${offerExchangeId}`;
    case TransctionTypes.VOUCHER_REVOKED:
      return `Revoked voucher with id: ${offerExchangeId}`;
    case TransctionTypes.SELLER_CREATED:
      return `Seller created`;
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
        transaction: buildTransaction(tx.type, offerExchangeId),
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
        transaction: buildTransaction(tx.type, offerExchangeId),
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
        transaction: buildTransaction(tx.type, offerExchangeId),
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

  return [...buyers, ...sellers, ...disputeResolvers];
};

export const CompletedTransactions = () => {
  const { data } = useGetCompletedTxLogsByWallet();

  const tableData = buildTableData(data);

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
