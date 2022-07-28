import * as Yup from "yup";

import {
  coreTermsOfSaleValidationSchema,
  createYourProfileValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
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

export type CreateProductForm = CreateYourProfile &
  ProductType &
  ProductInformation &
  CoreTermsOfSale &
  TermsOfExchange;
