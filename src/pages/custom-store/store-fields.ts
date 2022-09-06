import * as Yup from "yup";

import { validationOfFile } from "../chat/components/UploadForm/const";

export type StoreFields = {
  storeName: string;
  title: string;
  description: string;
  logoUrl: string;
  primaryBgColor: string;
  secondaryBgColor: string;
  footerBgColor: string;
  accentColor1: string;
  accentColor2: string;
  navigationBarBgColor: string;
  textColor: string;
  fontFamily: string;
  navigationBarPosition: string;
  sellerCurationList: string;
  offerCurationList: string;
  metaTransactionsApiKey: string;
};

export type StoreFormFields = StoreFields & {
  logoUrlText: string;
  logoUpload: File[];
};

export const storeFields = {
  storeName: "storeName",
  title: "title",
  description: "description",
  logoUrl: "logoUrl",
  logoUrlText: "logoUrlText",
  logoUpload: "logoUpload",
  primaryBgColor: "primaryBgColor",
  secondaryBgColor: "secondaryBgColor",
  footerBgColor: "footerBgColor",
  accentColor1: "accentColor1",
  accentColor2: "accentColor2",
  navigationBarBgColor: "navigationBarBgColor",
  textColor: "textColor",
  fontFamily: "fontFamily",
  navigationBarPosition: "navigationBarPosition",
  sellerCurationList: "sellerCurationList",
  offerCurationList: "offerCurationList",
  metaTransactionsApiKey: "metaTransactionsApiKey"
} as const;

const standardRequiredErrorMessage = "This field is required";
export const formModel = {
  formFields: {
    [storeFields.storeName]: {
      name: storeFields.storeName,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.title]: {
      name: storeFields.title,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.description]: {
      name: storeFields.description,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.logoUrl]: {
      name: storeFields.logoUrl
    },
    [storeFields.logoUrlText]: {
      name: storeFields.logoUrlText,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.logoUpload]: {
      name: storeFields.logoUpload,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Logo Image"
    },
    [storeFields.primaryBgColor]: {
      name: storeFields.primaryBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Primary"
    },
    [storeFields.secondaryBgColor]: {
      name: storeFields.secondaryBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Secondary"
    },
    [storeFields.footerBgColor]: {
      name: storeFields.footerBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Footer Color"
    },
    [storeFields.accentColor1]: {
      name: storeFields.accentColor1,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Accent Color1"
    },
    [storeFields.accentColor2]: {
      name: storeFields.accentColor2,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Accent Color2"
    },
    [storeFields.navigationBarBgColor]: {
      name: storeFields.navigationBarBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.textColor]: {
      name: storeFields.textColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.fontFamily]: {
      name: storeFields.fontFamily,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.navigationBarPosition]: {
      name: storeFields.navigationBarPosition,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.sellerCurationList]: {
      name: storeFields.sellerCurationList,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.offerCurationList]: {
      name: storeFields.offerCurationList,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.metaTransactionsApiKey]: {
      name: storeFields.metaTransactionsApiKey,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    }
  }
} as const;

export const uploadMaxMB = 5;
const MAX_FILE_SIZE = uploadMaxMB * 1024 * 1024; // 5 MB
const SUPPORTED_FILE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const validationSchema = Yup.object({
  [storeFields.storeName]: Yup.string(),
  [storeFields.title]: Yup.string(),
  [storeFields.description]: Yup.string(),
  [storeFields.logoUrl]: Yup.string(),
  [storeFields.logoUrlText]: Yup.string(),
  [storeFields.logoUpload]: validationOfFile({
    isOptional: true,
    maxFileSizeInB: MAX_FILE_SIZE,
    supportedFormats: SUPPORTED_FILE_FORMATS
  }),
  [storeFields.primaryBgColor]: Yup.string(),
  [storeFields.secondaryBgColor]: Yup.string(),
  [storeFields.footerBgColor]: Yup.string(),
  [storeFields.accentColor1]: Yup.string(),
  [storeFields.accentColor2]: Yup.string(),
  [storeFields.navigationBarBgColor]: Yup.string(),
  [storeFields.textColor]: Yup.string(),
  [storeFields.fontFamily]: Yup.string(),
  [storeFields.navigationBarPosition]: Yup.string(),
  [storeFields.sellerCurationList]: Yup.string(),
  [storeFields.offerCurationList]: Yup.string(),
  [storeFields.metaTransactionsApiKey]: Yup.string()
});

export const initialValues = {
  [storeFields.storeName]: "",
  [storeFields.title]: "",
  [storeFields.description]: "",
  [storeFields.logoUrl]: "",
  [storeFields.logoUrlText]: "",
  [storeFields.logoUpload]: "",
  [storeFields.primaryBgColor]: "",
  [storeFields.secondaryBgColor]: "",
  [storeFields.footerBgColor]: "",
  [storeFields.accentColor1]: "",
  [storeFields.accentColor2]: "",
  [storeFields.navigationBarBgColor]: "",
  [storeFields.textColor]: "",
  [storeFields.fontFamily]: "",
  [storeFields.navigationBarPosition]: "",
  [storeFields.sellerCurationList]: "",
  [storeFields.offerCurationList]: "",
  [storeFields.metaTransactionsApiKey]: ""
} as const;
