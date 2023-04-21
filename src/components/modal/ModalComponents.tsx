/* eslint @typescript-eslint/no-explicit-any: "off" */
import CancelExchangeModal from "./components/Chat/CancelExchangeModal";
import EscalateModal from "./components/Chat/components/EscalateModal/EscalateModal";
import MakeProposalModal from "./components/Chat/MakeProposal/MakeProposalModal";
import ResolveDisputeModal from "./components/Chat/ResolveDisputeModal";
import CompleteExchange from "./components/CompleteExchange";
import CreateProductDraft from "./components/CreateProductDraft";
import CreateProfileModal from "./components/CreateProfile/CreateProfileModal";
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import DisputeModal from "./components/DisputeModal/DisputeModal";
import DisputeResolverDecideModal from "./components/DisputeResolver/DisputeResolverDecideModal";
import DisputeResolverRefuseModal from "./components/DisputeResolver/DisputeResolverRefuseModal";
import ExchangePolicyDetailsModal from "./components/ExchangePolicyDetails";
import ExpireVoucherModal from "./components/ExpireVoucherModal";
import ExportExchangesWithDeliveryModal from "./components/ExportExchangesWithDeliveryModal";
import InvalidRoleModal from "./components/InvalidRoleModal";
import ManageFunds from "./components/ManageFunds";
import ProductCreateSuccess from "./components/ProductCreateSuccess";
import ProgressBarModal from "./components/ProgressBarModal";
import RedeemModal from "./components/RedeemModal/RedeemModal";
import RedeemSuccessModal from "./components/RedeemModal/RedeemSuccessModal";
import { RelistOfferModal } from "./components/RelistOfferModal/RelistOfferModal";
import RetractDisputeModal from "./components/RetractDisputeModal";
import RevokeProduct from "./components/RevokeProduct";
import FinanceDeposit from "./components/SellerFinance/FinanceDeposit";
import FinanceWithdraw from "./components/SellerFinance/FinanceWithdraw";
import RecentTransactionsModal from "./components/Transactions/RecentTransactionsModal/RecentTransactionsModal";
import TransactionFailedModal from "./components/Transactions/TransactionFailedModal/TransactionFailedModal";
import TransactionSubmittedModal from "./components/Transactions/TransactionSubmittedModal/TransactionSubmittedModal";
import WaitingForConfirmationModal from "./components/Transactions/WaitingForConfirmationModal/WaitingForConfirmationModal";
import Upload from "./components/Upload";
import VoidProduct from "./components/VoidProduct";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CANCEL_EXCHANGE: "CANCEL_EXCHANGE",
  COMPLETE_EXCHANGE: "COMPLETE_EXCHANGE",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  CREATE_PRODUCT_DRAFT: "CREATE_PRODUCT_DRAFT",
  CREATE_PROFILE: "CREATE_PROFILE",
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  DISPUTE_RESOLUTION_DECIDE_MODAL: "DISPUTE_RESOLUTION_DECIDE_MODAL",
  DISPUTE_RESOLUTION_REFUSE_MODAL: "DISPUTE_RESOLUTION_REFUSE_MODAL",
  ESCALATE_MODAL: "ESCALATE_MODAL",
  EXCHANGE_POLICY_DETAILS: "EXCHANGE_POLICY_DETAILS",
  EXPIRE_VOUCHER_MODAL: "EXPIRE_VOUCHER_MODAL",
  FINANCE_DEPOSIT_MODAL: "FINANCE_DEPOSIT_MODAL",
  FINANCE_WITHDRAW_MODAL: "FINANCE_WITHDRAW_MODAL",
  INVALID_ROLE: "INVALID_ROLE",
  MAKE_PROPOSAL: "MAKE_PROPOSAL",
  MANAGE_FUNDS_MODAL: "MANAGE_FUNDS_MODAL",
  PRODUCT_CREATE_SUCCESS: "PRODUCT_CREATE_SUCCESS",
  RAISE_DISPUTE: "RAISE_DISPUTE",
  RECENT_TRANSACTIONS: "RECENT_TRANSACTIONS",
  REDEEM_SUCCESS: "REDEEM_SUCCESS",
  REDEEM: "REDEEM",
  RESOLVE_DISPUTE: "RESOLVE_DISPUTE",
  RETRACT_DISPUTE: "RETRACT_DISPUTE",
  REVOKE_PRODUCT: "REVOKE_PRODUCT",
  TRANSACTION_SUBMITTED: "TRANSACTION_SUBMITTED",
  UPLOAD_MODAL: "UPLOAD_MODAL",
  VOID_PRODUCT: "VOID_PRODUCT",
  WAITING_FOR_CONFIRMATION: "WAITING_FOR_CONFIRMATION",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM",
  PROGRESS_BAR: "PROGRESS_BAR",
  EXPORT_EXCHANGES_WITH_DELIVERY: "EXPORT_EXCHANGES_WITH_DELIVERY",
  RELIST_OFFER: "RELIST_OFFER"
} as const;

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CANCEL_EXCHANGE]: CancelExchangeModal,
  [MODAL_TYPES.COMPLETE_EXCHANGE]: CompleteExchange,
  [MODAL_TYPES.TRANSACTION_FAILED]: TransactionFailedModal,
  [MODAL_TYPES.CREATE_PRODUCT_DRAFT]: CreateProductDraft,
  [MODAL_TYPES.CREATE_PROFILE]: CreateProfileModal,
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.DISPUTE_RESOLUTION_DECIDE_MODAL]: DisputeResolverDecideModal,
  [MODAL_TYPES.DISPUTE_RESOLUTION_REFUSE_MODAL]: DisputeResolverRefuseModal,
  [MODAL_TYPES.ESCALATE_MODAL]: EscalateModal,
  [MODAL_TYPES.EXCHANGE_POLICY_DETAILS]: ExchangePolicyDetailsModal,
  [MODAL_TYPES.EXPIRE_VOUCHER_MODAL]: ExpireVoucherModal,
  [MODAL_TYPES.FINANCE_DEPOSIT_MODAL]: FinanceDeposit,
  [MODAL_TYPES.FINANCE_WITHDRAW_MODAL]: FinanceWithdraw,
  [MODAL_TYPES.INVALID_ROLE]: InvalidRoleModal,
  [MODAL_TYPES.MAKE_PROPOSAL]: MakeProposalModal,
  [MODAL_TYPES.MANAGE_FUNDS_MODAL]: ManageFunds,
  [MODAL_TYPES.PRODUCT_CREATE_SUCCESS]: ProductCreateSuccess,
  [MODAL_TYPES.RAISE_DISPUTE]: DisputeModal,
  [MODAL_TYPES.RECENT_TRANSACTIONS]: RecentTransactionsModal,
  [MODAL_TYPES.REDEEM_SUCCESS]: RedeemSuccessModal,
  [MODAL_TYPES.REDEEM]: RedeemModal,
  [MODAL_TYPES.RESOLVE_DISPUTE]: ResolveDisputeModal,
  [MODAL_TYPES.RETRACT_DISPUTE]: RetractDisputeModal,
  [MODAL_TYPES.REVOKE_PRODUCT]: RevokeProduct,
  [MODAL_TYPES.TRANSACTION_SUBMITTED]: TransactionSubmittedModal,
  [MODAL_TYPES.UPLOAD_MODAL]: Upload,
  [MODAL_TYPES.VOID_PRODUCT]: VoidProduct,
  [MODAL_TYPES.WAITING_FOR_CONFIRMATION]: WaitingForConfirmationModal,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem,
  [MODAL_TYPES.PROGRESS_BAR]: ProgressBarModal,
  [MODAL_TYPES.EXPORT_EXCHANGES_WITH_DELIVERY]:
    ExportExchangesWithDeliveryModal,
  [MODAL_TYPES.RELIST_OFFER]: RelistOfferModal
} as const;
