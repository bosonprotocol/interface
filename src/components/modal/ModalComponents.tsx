/* eslint @typescript-eslint/no-explicit-any: "off" */
import CreateProductDraft from "./components/CreateProductDraft";
import CustomStore from "./components/CustomStore";
import DetailWidget from "./components/DetailWidget";
import ProductCreateSuccess from "./components/ProductCreateSuccess";
import WhatIsRedeem from "./components/WhatIsRedeem";

export const MODAL_TYPES = {
  CREATE_PRODUCT_DRAFT: "CREATE_PRODUCT_DRAFT",
  CUSTOM_STORE: "CUSTOM_STORE",
  DETAIL_WIDGET: "DETAIL_WIDGET",
  PRODUCT_CREATE_SUCCESS: "PRODUCT_CREATE_SUCCESS",
  WHAT_IS_REDEEM: "WHAT_IS_REDEEM"
} as const;

type ModalComponentsType = {
  [key in keyof typeof MODAL_TYPES]: any;
};

export const MODAL_COMPONENTS: ModalComponentsType = {
  [MODAL_TYPES.CREATE_PRODUCT_DRAFT]: CreateProductDraft,
  [MODAL_TYPES.CUSTOM_STORE]: CustomStore,
  [MODAL_TYPES.DETAIL_WIDGET]: DetailWidget,
  [MODAL_TYPES.PRODUCT_CREATE_SUCCESS]: ProductCreateSuccess,
  [MODAL_TYPES.WHAT_IS_REDEEM]: WhatIsRedeem
};
