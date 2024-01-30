import * as Yup from "yup";

import {
  confirmProductDetailsSchema,
  CoreTermsOfSaleValidationSchema,
  imagesSpecificOrAllValidationSchema,
  productDigitalValidationSchema,
  ProductImagesValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
  ProductVariantsImagesValidationSchema,
  ProductVariantsValidationSchema,
  regularProfileValidationSchema,
  shippingInfoValidationSchema,
  termsOfExchangeValidationSchema,
  TokenGatingValidationSchema,
  variantsCoreTermsOfSaleValidationSchema
} from "./validationSchema";

export type CreateYourProfile = Yup.InferType<
  typeof regularProfileValidationSchema
>;

export type CreateProfile = CreateYourProfile["createYourProfile"];

export type ProductType = Yup.InferType<typeof productTypeValidationSchema>;

export type ProductInformation = Yup.InferType<
  typeof productInformationValidationSchema
>;

export type ProductDigital = Yup.InferType<
  typeof productDigitalValidationSchema
>;

export type ProductVariants = Yup.InferType<ProductVariantsValidationSchema>;

export type CoreTermsOfSale = Yup.InferType<CoreTermsOfSaleValidationSchema>;

export type VariantsCoreTermsOfSale = Yup.InferType<
  typeof variantsCoreTermsOfSaleValidationSchema
>;

export type TokenGating = Yup.InferType<TokenGatingValidationSchema>;

export type TermsOfExchange = Yup.InferType<
  typeof termsOfExchangeValidationSchema
>;

export type ShippingInfo = Yup.InferType<typeof shippingInfoValidationSchema>;

export type ProductImages = Yup.InferType<ProductImagesValidationSchema>;

export type ProductVariantsImages =
  Yup.InferType<ProductVariantsImagesValidationSchema>;

export type ImagesSpecificOrAll = Yup.InferType<
  typeof imagesSpecificOrAllValidationSchema
>;

export type ConfirmProductDetails = Yup.InferType<
  typeof confirmProductDetailsSchema
>;

export type CreateProductForm = CreateYourProfile &
  ProductType &
  ProductInformation &
  ProductDigital &
  ProductVariants &
  ShippingInfo &
  CoreTermsOfSale &
  VariantsCoreTermsOfSale &
  TermsOfExchange &
  ProductImages &
  ProductVariantsImages &
  ImagesSpecificOrAll &
  TokenGating &
  ConfirmProductDetails;
