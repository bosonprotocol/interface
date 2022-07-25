import * as Yup from "yup";

import { validationMessage } from "../../../lib/const/validationMessage";

export const createYourProfileValidationSchema = Yup.object({
  creteYourProfile: Yup.object({
    // TODO: LOGO picture
    name: Yup.string().trim().required(validationMessage.required),
    email: Yup.string().trim().required(validationMessage.required),
    description: Yup.string().trim().required(validationMessage.required),
    website: Yup.string().trim().required(validationMessage.required)
  })
});
export const productTypeValidationSchema = Yup.object({
  productType: Yup.object({
    productType: Yup.string().required(validationMessage.required),
    productVariant: Yup.string().required(validationMessage.required)
  })
});
export const productInformationValidationSchema = Yup.object({
  productInformation: Yup.object({
    productTitle: Yup.string().required(validationMessage.required),
    describe: Yup.string().required(validationMessage.required),
    category: Yup.string().required(validationMessage.required),
    tags: Yup.string().required(validationMessage.required),
    attribute: Yup.string().required(validationMessage.required),
    attributeValue: Yup.string().required(validationMessage.required)
  })
});

type CreateYourProfile = Yup.InferType<
  typeof createYourProfileValidationSchema
>;
type ProductType = Yup.InferType<typeof productTypeValidationSchema>;
type ProductInformation = Yup.InferType<
  typeof productInformationValidationSchema
>;

export type CreateProductForm = CreateYourProfile &
  ProductType &
  ProductInformation;
