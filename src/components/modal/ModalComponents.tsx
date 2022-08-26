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
import RevokeProduct from "./components/RevokeProduct";
import Upload from "./components/Upload";
import VoidProduct from "./components/VoidProduct";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CANCEL_EXCHANGE: "CANCEL_EXCHANGE",
  CREATE_PRODUCT_DRAFT: "CREATE_PRODUCT_DRAFT",
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  DISPUTE_MODAL: "DISPUTE_MODAL",
  INITIALIZE_CHAT: "INITIALIZE_CHAT",
  MAKE_PROPOSAL: "MAKE_PROPOSAL",
  PRODUCT_CREATE_SUCCESS: "PRODUCT_CREATE_SUCCESS",
  REDEEM_MODAL: "REDEEM_MODAL",
  RESOLVE_DISPUTE: "RESOLVE_DISPUTE",
  REVOKE_PRODUCT: "REVOKE_PRODUCT",
  UPLOAD_MODAL: "UPLOAD_MODAL",
  VOID_PRODUCT: "VOID_PRODUCT",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM"
} as const;

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CANCEL_EXCHANGE]: CancelExchangeModal,
  [MODAL_TYPES.CREATE_PRODUCT_DRAFT]: CreateProductDraft,
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.DISPUTE_MODAL]: DisputeModal,
  [MODAL_TYPES.INITIALIZE_CHAT]: InitializeChatModal,
  [MODAL_TYPES.MAKE_PROPOSAL]: MakeProposalModal,
  [MODAL_TYPES.PRODUCT_CREATE_SUCCESS]: ProductCreateSuccess,
  [MODAL_TYPES.REDEEM_MODAL]: RedeemModal,
  [MODAL_TYPES.RESOLVE_DISPUTE]: ResolveDisputeModal,
  [MODAL_TYPES.REVOKE_PRODUCT]: RevokeProduct,
  [MODAL_TYPES.UPLOAD_MODAL]: Upload,
  [MODAL_TYPES.VOID_PRODUCT]: VoidProduct,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem
} as const;
