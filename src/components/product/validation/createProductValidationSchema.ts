import * as Yup from "yup";

import { validationMessage } from "../../../lib/const/validationMessage";

export const createYourProfileValidationSchema = Yup.object({
  // TODO: LOGO picture
  name: Yup.string().trim().required(validationMessage.required),
  email: Yup.string().trim().required(validationMessage.required),
  description: Yup.string().trim().required(validationMessage.required),
  website: Yup.string().trim().required(validationMessage.required)
});
export const productTypeValidationSchema = Yup.object({
  productType: Yup.string().required(validationMessage.required),
  productVariant: Yup.string().required(validationMessage.required)
});

type CreateYourProfile = Yup.InferType<
  typeof createYourProfileValidationSchema
>;
type ProductType = Yup.InferType<typeof productTypeValidationSchema>;

export type CreateProductForm = CreateYourProfile & ProductType;
