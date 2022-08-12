/* eslint @typescript-eslint/no-explicit-any: "off" */

import CancelExchangeModal from "./components/Chat/CancelExchangeModal";
import InitializeChatModal from "./components/Chat/InitializeChatModal";
import MakeProposalModal from "./components/Chat/MakeProposal/MakeProposalModal";
import ResolveDisputeModal from "./components/Chat/ResolveDisputeModal";
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import DisputeModal from "./components/DisputeModal/DisputeModal";
import Upload from "./components/Upload";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CREATE_PRODUCT_DRAFT: "CREATE_PRODUCT_DRAFT",
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  PRODUCT_CREATE_SUCCESS: "PRODUCT_CREATE_SUCCESS",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM",
  CANCEL_EXCHANGE: "CANCEL_EXCHANGE",
  RESOLVE_DISPUTE: "RESOLVE_DISPUTE",
  UPLOAD_MODAL: "UPLOAD_MODAL",
  MAKE_PROPOSAL: "MAKE_PROPOSAL",
  INITIALIZE_CHAT: "INITIALIZE_CHAT",
  DISPUTE_MODAL: "DISPUTE_MODAL"
} as const;

type ModalComponentsType = {
  [key in keyof typeof MODAL_TYPES]: any;
};

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem,
  [MODAL_TYPES.CANCEL_EXCHANGE]: CancelExchangeModal,
  [MODAL_TYPES.RESOLVE_DISPUTE]: ResolveDisputeModal,
  [MODAL_TYPES.UPLOAD_MODAL]: Upload,
  [MODAL_TYPES.MAKE_PROPOSAL]: MakeProposalModal,
  [MODAL_TYPES.INITIALIZE_CHAT]: InitializeChatModal,
  [MODAL_TYPES.DISPUTE_MODAL]: DisputeModal
} as const;
