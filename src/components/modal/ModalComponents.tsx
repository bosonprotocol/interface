/* eslint @typescript-eslint/no-explicit-any: "off" */
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import ProductCreateSuccess from "./components/ProductCreateSuccess";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM",
  PRODUCT_CREATE_SUCCESS: "PRODUCT_CREATE_SUCCESS"
} as const;

type ModalComponentsType = {
  [key in keyof typeof MODAL_TYPES]: any;
};

export const MODAL_COMPONENTS: ModalComponentsType = {
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem,
  [MODAL_TYPES.PRODUCT_CREATE_SUCCESS]: ProductCreateSuccess
};
