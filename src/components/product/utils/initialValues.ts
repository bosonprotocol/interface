import { CreateProductForm } from "./types";

export const createYourProfileInitialValues = {
  creteYourProfile: {
    name: "",
    email: "",
    description: "",
    website: ""
  }
} as const;

export const productTypeInitialValues = {
  productType: {
    productType: "",
    productVariant: ""
  }
} as const;

export const productInformationInitialValues = {
  productInformation: {
    productTitle: "",
    describe: "",
    category: "",
    tags: "",
    attribute: "",
    attributeValue: ""
  }
} as const;

export const initialValues: CreateProductForm = {
  ...createYourProfileInitialValues,
  ...productTypeInitialValues,
  ...productInformationInitialValues
} as const;
