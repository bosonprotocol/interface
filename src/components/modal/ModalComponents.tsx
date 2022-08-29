/* eslint @typescript-eslint/no-explicit-any: "off" */
import CancelExchangeModal from "./components/Chat/CancelExchangeModal";
import InitializeChatModal from "./components/Chat/InitializeChatModal";
import MakeProposalModal from "./components/Chat/MakeProposal/MakeProposalModal";
import ResolveDisputeModal from "./components/Chat/ResolveDisputeModal";
import CreateProductDraft from "./components/CreateProductDraft";
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import DisputeModal from "./components/DisputeModal/DisputeModal";
import ProductCreateSuccess from "./components/ProductCreateSuccess";
import RedeemModal from "./components/RedeemModal/RedeemModal";
import FinanceDeposit from "./components/SellerFinance/FinanceDeposit";
import FinanceWithdraw from "./components/SellerFinance/FinanceWithdraw";
import Upload from "./components/Upload";
import VoidProduct from "./components/VoidProduct";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM",
  CANCEL_EXCHANGE: "CANCEL_EXCHANGE",
  RESOLVE_DISPUTE: "RESOLVE_DISPUTE",
  UPLOAD_MODAL: "UPLOAD_MODAL",
  MAKE_PROPOSAL: "MAKE_PROPOSAL",
  INITIALIZE_CHAT: "INITIALIZE_CHAT",
  DISPUTE_MODAL: "DISPUTE_MODAL",
  PRODUCT_CREATE_SUCCESS: "PRODUCT_CREATE_SUCCESS",
  CREATE_PRODUCT_DRAFT: "CREATE_PRODUCT_DRAFT",
  VOID_PRODUCT: "VOID_PRODUCT",
  REDEEM_MODAL: "REDEEM_MODAL",
  FINANCE_DEPOSIT_MODAL: "FINANCE_DEPOSIT_MODAL",
  FINANCE_WITHDRAW_MODAL: "FINANCE_WITHDRAW_MODAL"
} as const;

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem,
  [MODAL_TYPES.CANCEL_EXCHANGE]: CancelExchangeModal,
  [MODAL_TYPES.RESOLVE_DISPUTE]: ResolveDisputeModal,
  [MODAL_TYPES.UPLOAD_MODAL]: Upload,
  [MODAL_TYPES.MAKE_PROPOSAL]: MakeProposalModal,
  [MODAL_TYPES.INITIALIZE_CHAT]: InitializeChatModal,
  [MODAL_TYPES.DISPUTE_MODAL]: DisputeModal,
  [MODAL_TYPES.PRODUCT_CREATE_SUCCESS]: ProductCreateSuccess,
  [MODAL_TYPES.VOID_PRODUCT]: VoidProduct,
  [MODAL_TYPES.CREATE_PRODUCT_DRAFT]: CreateProductDraft,
  [MODAL_TYPES.REDEEM_MODAL]: RedeemModal,
  [MODAL_TYPES.FINANCE_DEPOSIT_MODAL]: FinanceDeposit,
  [MODAL_TYPES.FINANCE_WITHDRAW_MODAL]: FinanceWithdraw
} as const;
