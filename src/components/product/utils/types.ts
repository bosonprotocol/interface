import * as Yup from "yup";

import {
  coreTermsOfSaleValidationSchema,
  createYourProfileValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
  shippingInfoValidationSchema,
  termsOfExchangeValidationSchema
} from "./validationSchema";

export type CreateYourProfile = Yup.InferType<
  typeof createYourProfileValidationSchema
>;
export type ProductType = Yup.InferType<typeof productTypeValidationSchema>;
export type ProductInformation = Yup.InferType<
  typeof productInformationValidationSchema
>;
export type CoreTermsOfSale = Yup.InferType<
  typeof coreTermsOfSaleValidationSchema
>;
export type TermsOfExchange = Yup.InferType<
  typeof termsOfExchangeValidationSchema
>;

export type ShippingInfo = Yup.InferType<typeof shippingInfoValidationSchema>;

export type CreateProductForm = CreateYourProfile &
  ProductType &
  ProductInformation &
  ShippingInfo &
  CoreTermsOfSale &
  TermsOfExchange;
