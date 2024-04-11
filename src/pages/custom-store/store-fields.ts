import { ethers } from "ethers";
import { defaultFontFamily } from "lib/styles/fonts";
import * as Yup from "yup";

import { SelectDataProps } from "../../components/form/types";
import { colors } from "../../lib/styles/colors";
import { checkValidUrl } from "../../lib/validation/regex/url";
import { validationOfFile } from "../chat/components/UploadForm/const";
import { AdditionalFooterLink } from "./AdditionalFooterLinksTypes";
import { StoreFields } from "./store-fields-types";

export const storeFields = {
  isCustomStoreFront: "isCustomStoreFront",
  customStoreUrl: "customStoreUrl",
  storeName: "storeName",
  title: "title",
  description: "description",
  bannerSwitch: "bannerSwitch",
  bannerImgPosition: "bannerImgPosition",
  bannerUrl: "bannerUrl",
  bannerUrlText: "bannerUrlText",
  bannerUpload: "bannerUpload",
  logoUrl: "logoUrl",
  logoUrlText: "logoUrlText",
  logoUpload: "logoUpload",
  headerBgColor: "headerBgColor",
  headerTextColor: "headerTextColor",
  primaryBgColor: "primaryBgColor",
  secondaryBgColor: "secondaryBgColor",
  accentColor: "accentColor",
  textColor: "textColor",
  footerBgColor: "footerBgColor",
  footerTextColor: "footerTextColor",
  upperCardBgColor: "upperCardBgColor",
  lowerCardBgColor: "lowerCardBgColor",
  fontFamily: "fontFamily",
  navigationBarPosition: "navigationBarPosition",
  showFooter: "showFooter",
  copyright: "copyright",
  socialMediaLinks: "socialMediaLinks",
  contactInfoLinks: "contactInfoLinks",
  additionalFooterLinks: "additionalFooterLinks",
  withOwnProducts: "withOwnProducts",
  sellerCurationList: "sellerCurationList",
  offerCurationList: "offerCurationList",
  commitProxyAddress: "commitProxyAddress",
  openseaLinkToOriginalMainnetCollection:
    "openseaLinkToOriginalMainnetCollection",
  withMetaTx: "withMetaTx",
  metaTransactionsApiKey: "metaTransactionsApiKey",
  supportFunctionality: "supportFunctionality",
  buttonBgColor: "buttonBgColor",
  buttonTextColor: "buttonTextColor"
} as const;

const getYesNoOptions = (defaultValue: "yes" | "no") => {
  return [
    { label: "Yes", value: "true", default: defaultValue === "yes" },
    { label: "No", value: "false", default: defaultValue === "no" }
  ] as const;
};

const standardRequiredErrorMessage = "This field is required";
const notUrlErrorMessage = "This is not a URL like: www.example.com";
const withOwnProductsOptions = [
  { label: "Only my own products", value: "mine", default: true },
  { label: "All products", value: "all" },
  { label: "Custom", value: "custom" }
] as const;
export const formModel = {
  formFields: {
    [storeFields.customStoreUrl]: {
      name: storeFields.customStoreUrl,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "https://bosonapp.io/#/?isCustomStoreFront=true"
    },
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
    [storeFields.bannerImgPosition]: {
      name: storeFields.bannerImgPosition,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.bannerUrl]: {
      name: storeFields.bannerUrl
    },
    [storeFields.bannerUrlText]: {
      name: storeFields.bannerUrlText,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.bannerUpload]: {
      name: storeFields.bannerUpload,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Banner image"
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
      placeholder: "Logo image"
    },
    [storeFields.headerBgColor]: {
      name: storeFields.headerBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Background"
    },
    [storeFields.headerTextColor]: {
      name: storeFields.headerTextColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Text"
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
    [storeFields.accentColor]: {
      name: storeFields.accentColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Accent"
    },
    [storeFields.textColor]: {
      name: storeFields.textColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Text"
    },
    [storeFields.footerBgColor]: {
      name: storeFields.footerBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Footer color"
    },
    [storeFields.footerTextColor]: {
      name: storeFields.footerTextColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Footer text color"
    },
    [storeFields.upperCardBgColor]: {
      name: storeFields.upperCardBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Upper card background color"
    },
    [storeFields.lowerCardBgColor]: {
      name: storeFields.lowerCardBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Lower card background color"
    },
    [storeFields.fontFamily]: {
      name: storeFields.fontFamily,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: [
        {
          label: "Plus Jakarta Sans",
          value: defaultFontFamily,
          default: true
        },
        {
          label: "Times New Roman",
          value: "Times New Roman"
        },
        {
          label: "Barlow",
          value: "barlow" // defined in src/lib/styles/GlobalStyle.tsx
        },
        {
          label: "Neuropolitical",
          value: "neuropolitical_rg" // defined in src/lib/styles/GlobalStyle.tsx
        }
      ]
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
        {
          label: "Facebook",
          value: "facebook",
          url: "",
          prefix: "https://www.facebook.com/"
        },
        {
          label: "Instagram",
          value: "instagram",
          url: "",
          prefix: "https://www.instagram.com/"
        },
        {
          label: "LinkedIn",
          value: "linkedin",
          url: "",
          prefix: "https://www.linkedin.com/"
        },
        {
          label: "Medium",
          value: "medium",
          url: "",
          prefix: "https://medium.com/"
        },
        {
          label: "Pinterest",
          value: "pinterest",
          url: "",
          prefix: "https://www.pinterest.com/"
        },
        {
          label: "Reddit",
          value: "reddit",
          url: "",
          prefix: "https://www.reddit.com/"
        },
        {
          label: "Snapchat",
          value: "snapchat",
          url: "",
          prefix: "https://www.snapchat.com/"
        },
        {
          label: "TikTok",
          value: "tiktok",
          url: "",
          prefix: "https://www.tiktok.com/"
        },
        {
          label: "Twitch",
          value: "twitch",
          url: "",
          prefix: "https://www.twitch.tv/"
        },
        {
          label: "Twitter",
          value: "twitter",
          url: "",
          prefix: "https://twitter.com/"
        },
        {
          label: "Youtube",
          value: "youtube",
          url: "",
          prefix: "https://www.youtube.com/"
        }
      ]
    },
    [storeFields.contactInfoLinks]: {
      name: storeFields.contactInfoLinks,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: [
        { label: "Phone", value: "phone", text: "" },
        { label: "Email", value: "email", text: "" },
        { label: "Address", value: "address", text: "" }
      ]
    },
    [storeFields.additionalFooterLinks]: {
      name: storeFields.additionalFooterLinks,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "",
      options: [
        { label: "Home", value: "home", url: "" },
        { label: "FAQs", value: "email", url: "" },
        { label: "Contact Us", value: "contact_us", url: "" },
        { label: "How Boson Works", value: "how_boson_works", url: "" },
        { label: "Terms of Service", value: "terms_of_service", url: "" },
        { label: "Privacy Policy", value: "privacy_policy", url: "" }
      ] as AdditionalFooterLink[]
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
      options: withOwnProductsOptions
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
      options: getYesNoOptions("no")
    },
    [storeFields.commitProxyAddress]: {
      name: storeFields.commitProxyAddress,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "0x0000000000000000000000000000000000000000"
    },
    [storeFields.openseaLinkToOriginalMainnetCollection]: {
      name: storeFields.openseaLinkToOriginalMainnetCollection,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.metaTransactionsApiKey]: {
      name: storeFields.metaTransactionsApiKey,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: ""
    },
    [storeFields.supportFunctionality]: {
      name: storeFields.supportFunctionality,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Select actor(s)",
      options: [
        { label: "Buyer", value: "buyer" },
        { label: "Seller", value: "seller" },
        { label: "Dispute Resolver", value: "dr" }
      ]
    },
    [storeFields.buttonBgColor]: {
      name: storeFields.buttonBgColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Accent"
    },
    [storeFields.buttonTextColor]: {
      name: storeFields.buttonTextColor,
      requiredErrorMessage: standardRequiredErrorMessage,
      placeholder: "Text"
    }
  }
} as const;

export const uploadMaxMB = 5;
const MAX_FILE_SIZE = uploadMaxMB * 1024 * 1024; // 5 MB
const SUPPORTED_FILE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const withOwnProductsValues = withOwnProductsOptions.map((v) => v.value);
export const validationSchema = Yup.object({
  [storeFields.isCustomStoreFront]: Yup.string().oneOf(["true"]).required(),
  [storeFields.customStoreUrl]: Yup.string(),
  [storeFields.storeName]: Yup.string(),
  [storeFields.title]: Yup.string(),
  [storeFields.description]: Yup.string(),
  [storeFields.bannerSwitch]: Yup.boolean(),
  [storeFields.bannerImgPosition]: Yup.string(),
  [storeFields.bannerUrl]: Yup.string(),
  [storeFields.bannerUrlText]: Yup.string(),
  [storeFields.bannerUpload]: validationOfFile({
    isOptional: true,
    maxFileSizeInB: MAX_FILE_SIZE,
    supportedFormats: SUPPORTED_FILE_FORMATS
  }),
  [storeFields.logoUrl]: Yup.string(),
  [storeFields.logoUrlText]: Yup.string(),
  [storeFields.logoUpload]: validationOfFile({
    isOptional: true,
    maxFileSizeInB: MAX_FILE_SIZE,
    supportedFormats: SUPPORTED_FILE_FORMATS
  }),
  [storeFields.headerBgColor]: Yup.string(),
  [storeFields.headerTextColor]: Yup.string(),
  [storeFields.primaryBgColor]: Yup.string(),
  [storeFields.secondaryBgColor]: Yup.string(),
  [storeFields.accentColor]: Yup.string(),
  [storeFields.textColor]: Yup.string(),
  // NOTE: we may wish to show it again in the future
  // [storeFields.footerBgColor]: Yup.string(),
  [storeFields.footerTextColor]: Yup.string(),
  [storeFields.upperCardBgColor]: Yup.string(),
  [storeFields.lowerCardBgColor]: Yup.string(),
  [storeFields.buttonBgColor]: Yup.string(),
  [storeFields.buttonTextColor]: Yup.string(),
  [storeFields.textColor]: Yup.string(),
  [storeFields.fontFamily]: Yup.object({
    label: Yup.string().required(standardRequiredErrorMessage),
    value: Yup.string().required(standardRequiredErrorMessage)
  }).nullable(),
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
      prefix: Yup.string().required(standardRequiredErrorMessage),
      url: Yup.string()
        .trim()
        .required(standardRequiredErrorMessage)
        .test("FORMAT", notUrlErrorMessage, (value, { parent }) => {
          return checkValidUrl(`${parent.prefix}${value ?? ""}`);
        })
    })
  ),
  [storeFields.contactInfoLinks]: Yup.array(
    Yup.object({
      label: Yup.string().required(standardRequiredErrorMessage),
      value: Yup.string().required(standardRequiredErrorMessage),
      text: Yup.string().required(standardRequiredErrorMessage)
    })
  ),
  [storeFields.additionalFooterLinks]: Yup.array(
    Yup.object({
      label: Yup.string().required(standardRequiredErrorMessage),
      value: Yup.string(),
      url: Yup.string()
        .test("FORMAT", notUrlErrorMessage, (value) =>
          checkValidUrl(value ?? "")
        )
        .when("label", (label) => {
          if (label) {
            return Yup.string()
              .test("FORMAT", notUrlErrorMessage, (value) =>
                checkValidUrl(value ?? "")
              )
              .required(standardRequiredErrorMessage);
          }
          return Yup.string();
        })
    })
  ),
  [storeFields.copyright]: Yup.string(),
  [storeFields.withOwnProducts]: Yup.object({
    label: Yup.string().required(standardRequiredErrorMessage),
    value: Yup.mixed<(typeof withOwnProductsValues)[number]>()
      .oneOf(withOwnProductsValues)
      .required(standardRequiredErrorMessage)
  }).nullable(),
  [storeFields.sellerCurationList]: Yup.string(),
  [storeFields.offerCurationList]: Yup.string(),
  [storeFields.commitProxyAddress]: Yup.string()
    .trim()
    .test("FORMAT", "Must be an address", (value) =>
      value ? ethers.utils.isAddress(value) : true
    ),
  [storeFields.openseaLinkToOriginalMainnetCollection]: Yup.string().test(
    "FORMAT",
    notUrlErrorMessage,
    (value) => (value ? checkValidUrl(value) : true)
  ),
  [storeFields.metaTransactionsApiKey]: Yup.string()
  // NOTE: we may wish to show it again in the future
  // [storeFields.supportFunctionality]: Yup.array(
  //   Yup.object({
  //     label: Yup.string().required(standardRequiredErrorMessage),
  //     value: Yup.string().required(standardRequiredErrorMessage)
  //   }).nullable()
  // )
});

export const initialValues: Yup.InferType<typeof validationSchema> = {
  [storeFields.isCustomStoreFront]: "true",
  [storeFields.customStoreUrl]: "",
  [storeFields.storeName]: "",
  [storeFields.title]: "",
  [storeFields.description]: "",
  [storeFields.bannerSwitch]: false,
  [storeFields.bannerImgPosition]: "",
  [storeFields.bannerUrl]: "",
  [storeFields.bannerUrlText]: "",
  [storeFields.bannerUpload]: [],
  [storeFields.logoUrl]: "",
  [storeFields.logoUrlText]: "",
  [storeFields.logoUpload]: [],
  [storeFields.headerBgColor]: colors.white,
  [storeFields.headerTextColor]: colors.black,
  [storeFields.primaryBgColor]: colors.white,
  [storeFields.secondaryBgColor]: colors.lightGrey,
  [storeFields.accentColor]: "",
  [storeFields.textColor]: colors.black,
  // [storeFields.footerBgColor]: colors.black,
  [storeFields.upperCardBgColor]: colors.white,
  [storeFields.lowerCardBgColor]: colors.white,
  [storeFields.buttonBgColor]: colors.primary,
  [storeFields.buttonTextColor]: colors.black,
  [storeFields.footerTextColor]: colors.white,
  [storeFields.fontFamily]: formModel.formFields.fontFamily.options.find(
    (option) => "default" in option && option.default
  ) as SelectDataProps,
  [storeFields.navigationBarPosition]:
    formModel.formFields.navigationBarPosition.options.find(
      (option) => "default" in option && option.default
    ) as SelectDataProps,
  [storeFields.showFooter]: formModel.formFields.showFooter.options.find(
    (option) => "default" in option && option.default
  ) as SelectDataProps,
  [storeFields.socialMediaLinks]: [] as NonNullable<
    StoreFields["socialMediaLinks"]
  >,
  [storeFields.contactInfoLinks]: [] as NonNullable<
    StoreFields["contactInfoLinks"]
  >,
  [storeFields.additionalFooterLinks]: [] as AdditionalFooterLink[],
  [storeFields.copyright]: "",
  [storeFields.withOwnProducts]:
    formModel.formFields.withOwnProducts.options.find(
      (option) => "default" in option && option.default
    ) ?? formModel.formFields.withOwnProducts.options[0],
  [storeFields.sellerCurationList]: "",
  [storeFields.offerCurationList]: "",
  [storeFields.commitProxyAddress]: "",
  [storeFields.openseaLinkToOriginalMainnetCollection]: "",
  [storeFields.metaTransactionsApiKey]: ""
  // [storeFields.supportFunctionality]: [] as SelectDataProps[]
} as const;
