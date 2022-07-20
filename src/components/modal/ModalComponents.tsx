/* eslint @typescript-eslint/no-explicit-any: "off" */
import CreatedExchange from "./components/CreatedExchange";
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CREATED_EXCHANGE: "CREATED_EXCHANGE",
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM"
} as const;

type ModalComponentsType = {
  [key in keyof typeof MODAL_TYPES]: any;
};

export const MODAL_COMPONENTS: ModalComponentsType = {
  [MODAL_TYPES.CREATED_EXCHANGE]: CreatedExchange,
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem
};
