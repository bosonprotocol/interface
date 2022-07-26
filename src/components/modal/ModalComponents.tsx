/* eslint @typescript-eslint/no-explicit-any: "off" */
import CancelExchange from "./components/Chat/CancelExchange";
import MakeProposal from "./components/Chat/MakeProposal/MakeProposal";
import ResolveDispute from "./components/Chat/ResolveDispute";
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import Upload from "./components/Upload";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM",
  CANCEL_EXCHANGE: "CANCEL_EXCHANGE",
  RESOLVE_DISPUTE: "RESOLVE_DISPUTE",
  UPLOAD_MODAL: "UPLOAD_MODAL",
  MAKE_PROPOSAL: "MAKE_PROPOSAL"
} as const;

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem,
  [MODAL_TYPES.CANCEL_EXCHANGE]: CancelExchange,
  [MODAL_TYPES.RESOLVE_DISPUTE]: ResolveDispute,
  [MODAL_TYPES.UPLOAD_MODAL]: Upload,
  [MODAL_TYPES.MAKE_PROPOSAL]: MakeProposal
} as const;
