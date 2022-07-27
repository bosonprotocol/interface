import * as Yup from "yup";

import {
  createYourProfileValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema
} from "./validationSchema";

export type CreateYourProfile = Yup.InferType<
  typeof createYourProfileValidationSchema
>;
export type ProductType = Yup.InferType<typeof productTypeValidationSchema>;
export type ProductInformation = Yup.InferType<
  typeof productInformationValidationSchema
>;

export type CreateProductForm = CreateYourProfile &
  ProductType &
  ProductInformation;
