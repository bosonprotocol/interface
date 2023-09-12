import * as Yup from "yup";

import {
  CoreTermsOfSaleValidationSchema,
  disputeCentreValidationSchemaAdditionalInformation,
  disputeCentreValidationSchemaGetStarted,
  disputeCentreValidationSchemaMakeProposal,
  disputeCentreValidationSchemaProposalSummary,
  disputeCentreValidationSchemaTellUsMore,
  imagesSpecificOrAllValidationSchema,
  productImagesValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
  productVariantsImagesValidationSchema,
  ProductVariantsValidationSchema,
  regularProfileValidationSchema,
  shippingInfoValidationSchema,
  termsOfExchangeValidationSchema,
  tokenGatingValidationSchema,
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

export type ProductVariants = Yup.InferType<ProductVariantsValidationSchema>;

export type CoreTermsOfSale = Yup.InferType<CoreTermsOfSaleValidationSchema>;

export type VariantsCoreTermsOfSale = Yup.InferType<
  typeof variantsCoreTermsOfSaleValidationSchema
>;

export type TokenGating = Yup.InferType<typeof tokenGatingValidationSchema>;

export type TermsOfExchange = Yup.InferType<
  typeof termsOfExchangeValidationSchema
>;

export type ShippingInfo = Yup.InferType<typeof shippingInfoValidationSchema>;

export type ProductImages = Yup.InferType<typeof productImagesValidationSchema>;

export type ProductVariantsImages = Yup.InferType<
  typeof productVariantsImagesValidationSchema
>;

export type DisputeCentreGetStarted = Yup.InferType<
  typeof disputeCentreValidationSchemaGetStarted
>;

export type DisputeCentreTellUsMore = Yup.InferType<
  typeof disputeCentreValidationSchemaTellUsMore
>;

export type DisputeCentreAdditionalInformation = Yup.InferType<
  typeof disputeCentreValidationSchemaAdditionalInformation
>;

export type DisputeCentreMakeProposal = Yup.InferType<
  typeof disputeCentreValidationSchemaMakeProposal
>;

export type DisputeCentreValidationSchemaProposalSummary = Yup.InferType<
  typeof disputeCentreValidationSchemaProposalSummary
>;

export type ImagesSpecificOrAll = Yup.InferType<
  typeof imagesSpecificOrAllValidationSchema
>;

export type CreateProductForm = CreateYourProfile &
  ProductType &
  ProductInformation &
  ProductVariants &
  ShippingInfo &
  CoreTermsOfSale &
  VariantsCoreTermsOfSale &
  TermsOfExchange &
  ProductImages &
  ProductVariantsImages &
  DisputeCentreGetStarted &
  DisputeCentreTellUsMore &
  DisputeCentreAdditionalInformation &
  DisputeCentreMakeProposal &
  DisputeCentreValidationSchemaProposalSummary &
  ImagesSpecificOrAll &
  TokenGating;
