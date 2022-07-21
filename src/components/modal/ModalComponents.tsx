/* eslint @typescript-eslint/no-explicit-any: "off" */
import CancelExchange from "./components/CancelExchange";
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import ResolveDispute from "./components/ResolveDispute";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM",
  CANCEL_EXCHANGE: "CANCEL_EXCHANGE",
  RESOLVE_DISPUTE: "RESOLVE_DISPUTE"
} as const;

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem,
  [MODAL_TYPES.CANCEL_EXCHANGE]: CancelExchange,
  [MODAL_TYPES.RESOLVE_DISPUTE]: ResolveDispute
} as const;
