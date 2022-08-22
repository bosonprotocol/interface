/* eslint @typescript-eslint/no-explicit-any: "off" */
import CancelExchangeModal from "./components/Chat/CancelExchangeModal";
import InitializeChatModal from "./components/Chat/InitializeChatModal";
import MakeProposalModal from "./components/Chat/MakeProposal/MakeProposalModal";
import ResolveDisputeModal from "./components/Chat/ResolveDisputeModal";
import ChatInitializationFailed from "./components/ChatInitializationFailed";
import CreateProductDraft from "./components/CreateProductDraft";
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import DisputeModal from "./components/DisputeModal/DisputeModal";
import ProductCreateSuccess from "./components/ProductCreateSuccess";
import Upload from "./components/Upload";
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
  CHAT_INITIALIZATION_FAILED: "CHAT_INITIALIZATION_FAILED"
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
  [MODAL_TYPES.CREATE_PRODUCT_DRAFT]: CreateProductDraft,
  [MODAL_TYPES.CHAT_INITIALIZATION_FAILED]: ChatInitializationFailed
} as const;
