import * as Yup from "yup";

import {
  coreTermsOfSaleValidationSchema,
  createYourProfileValidationSchema,
  disputeCentreValidationSchemaAdditionalInformation,
  disputeCentreValidationSchemaGetStarted,
  disputeCentreValidationSchemaMakeProposal,
  disputeCentreValidationSchemaProposalSummary,
  disputeCentreValidationSchemaTellUsMore,
  productImagesValidationSchema,
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

export type ProductImages = Yup.InferType<typeof productImagesValidationSchema>;

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

export type CreateProductForm = CreateYourProfile &
  ProductType &
  ProductInformation &
  ShippingInfo &
  CoreTermsOfSale &
  TermsOfExchange &
  ProductImages &
  DisputeCentreGetStarted &
  DisputeCentreTellUsMore &
  DisputeCentreAdditionalInformation &
  DisputeCentreMakeProposal &
  DisputeCentreValidationSchemaProposalSummary;
