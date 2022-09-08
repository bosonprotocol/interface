import * as Yup from "yup";

import { SelectDataProps } from "../../components/form/types";
import { websitePattern } from "../../lib/validation/regex/url";
import { validationOfFile } from "../chat/components/UploadForm/const";
import { SocialLogoValues } from "./SocialLogo";

type SelectType<Value extends string = string> = SelectDataProps<Value> | null;

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
  navigationBarPosition: SelectType;
  copyright: string;
  showFooter: SelectType;
  socialMediaLinks: SelectType<SocialLogoValues>[];
  additionalFooterLinks: SelectType[];
  withOwnProducts: SelectType;
  sellerCurationList: string;
  offerCurationList: string;
  metaTransactionsApiKey: string;
};

export type StoreFormFields = StoreFields & {
  logoUrlText: string;
  logoUpload: File[];
  withAdditionalFooterLinks: SelectType;
  withMetaTx: SelectType;
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
  showFooter: "showFooter",
  copyright: "copyright",
  socialMediaLinks: "socialMediaLinks",
  withAdditionalFooterLinks: "withAdditionalFooterLinks",
  additionalFooterLinks: "additionalFooterLinks",
  withOwnProducts: "withOwnProducts",
  sellerCurationList: "sellerCurationList",
  offerCurationList: "offerCurationList",
  withMetaTx: "withMetaTx",
  metaTransactionsApiKey: "metaTransactionsApiKey"
} as const;

const yesNoOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false", default: true }
] as const;
const standardRequiredErrorMessage = "This field is required";
const notUrlErrorMessage = "This is not a URL like: www.example.com";
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
    [storeFields.showFooter]: {
      name: storeFields.showFooter,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: [
        { label: "Show", value: "true" },
        { label: "Hide", value: "false", default: true }
      ]
    },
    [storeFields.copyright]: {
      name: storeFields.copyright,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.socialMediaLinks]: {
      name: storeFields.socialMediaLinks,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: [
        { label: "Facebook", value: "facebook", url: "" },
        { label: "Instagram", value: "instagram", url: "" },
        { label: "LinkedIn", value: "linkedin", url: "" },
        { label: "Medium", value: "medium", url: "" },
        { label: "Pinterest", value: "pinterest", url: "" },
        { label: "Reddit", value: "reddit", url: "" },
        { label: "Snapchat", value: "snapchat", url: "" },
        { label: "TikTok", value: "tiktok", url: "" },
        { label: "Twitch", value: "twitch", url: "" },
        { label: "Twitter", value: "twitter", url: "" },
        { label: "Youtube", value: "youtube", url: "" }
      ]
    },
    [storeFields.withAdditionalFooterLinks]: {
      name: storeFields.withAdditionalFooterLinks,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: yesNoOptions
    },
    [storeFields.additionalFooterLinks]: {
      name: storeFields.additionalFooterLinks,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.navigationBarPosition]: {
      name: storeFields.navigationBarPosition,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: [
        { label: "Top", value: "top", default: true },
        { label: "Left", value: "left" },
        { label: "Right", value: "right" }
      ]
    },
    [storeFields.withOwnProducts]: {
      name: storeFields.withOwnProducts,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: yesNoOptions
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
    [storeFields.withMetaTx]: {
      name: storeFields.withMetaTx,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: yesNoOptions
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
  [storeFields.navigationBarPosition]: Yup.object({
    label: Yup.string().required(standardRequiredErrorMessage),
    value: Yup.string().required(standardRequiredErrorMessage)
  }).nullable(),
  [storeFields.showFooter]: Yup.object({
    label: Yup.string().required(standardRequiredErrorMessage),
    value: Yup.string().required(standardRequiredErrorMessage)
  }).nullable(),
  [storeFields.socialMediaLinks]: Yup.array(
    Yup.object({
      label: Yup.string().required(standardRequiredErrorMessage),
      value: Yup.string().required(standardRequiredErrorMessage),
      url: Yup.string()
        .matches(new RegExp(websitePattern), notUrlErrorMessage)
        .required(standardRequiredErrorMessage)
    })
  ),
  [storeFields.withAdditionalFooterLinks]: Yup.object({
    label: Yup.string().required(standardRequiredErrorMessage),
    value: Yup.string().required(standardRequiredErrorMessage)
  }).nullable(),
  [storeFields.additionalFooterLinks]: Yup.array(
    Yup.object({
      label: Yup.string(),
      value: Yup.string()
        .matches(new RegExp(websitePattern), notUrlErrorMessage)
        .when("label", (label) => {
          if (label) {
            return Yup.string()
              .matches(new RegExp(websitePattern), notUrlErrorMessage)
              .required(standardRequiredErrorMessage);
          }
          return Yup.string();
        })
    })
  ),
  [storeFields.copyright]: Yup.string(),
  [storeFields.withOwnProducts]: Yup.object({
    label: Yup.string().required(standardRequiredErrorMessage),
    value: Yup.string().required(standardRequiredErrorMessage)
  }).nullable(),
  [storeFields.sellerCurationList]: Yup.string(),
  [storeFields.offerCurationList]: Yup.string(),
  [storeFields.withMetaTx]: Yup.object({
    label: Yup.string().required(standardRequiredErrorMessage),
    value: Yup.string().required(standardRequiredErrorMessage)
  }).nullable(),
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
  [storeFields.navigationBarPosition]:
    formModel.formFields.navigationBarPosition.options.find(
      (option) => "default" in option && option.default
    ) as SelectDataProps,
  [storeFields.showFooter]: formModel.formFields.showFooter.options.find(
    (option) => "default" in option && option.default
  ) as SelectDataProps,
  [storeFields.socialMediaLinks]: [] as (SelectDataProps & { url: string })[],
  [storeFields.withAdditionalFooterLinks]: null as unknown as SelectDataProps,
  [storeFields.additionalFooterLinks]: [] as SelectDataProps[],
  [storeFields.copyright]: "",
  [storeFields.withOwnProducts]:
    formModel.formFields.withOwnProducts.options.find(
      (option) => "default" in option && option.default
    ) as SelectDataProps,
  [storeFields.sellerCurationList]: "",
  [storeFields.offerCurationList]: "",
  [storeFields.withMetaTx]: formModel.formFields.withMetaTx.options.find(
    (option) => "default" in option && option.default
  ) as SelectDataProps,
  [storeFields.metaTransactionsApiKey]: ""
} as const;
