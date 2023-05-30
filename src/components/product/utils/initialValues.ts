import { CONFIG } from "../../../lib/config";
import { FormModel } from "../../modal/components/Chat/MakeProposal/MakeProposalFormModel";
import { DisputeFormModel } from "../../modal/components/DisputeModal/DisputeModalFormModel";
import {
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE,
  OPTIONS_CURRENCIES,
  OPTIONS_DISPUTE_RESOLVER,
  OPTIONS_EXCHANGE_POLICY,
  OPTIONS_LENGTH,
  OPTIONS_PERIOD,
  OPTIONS_UNIT,
  OPTIONS_WEIGHT,
  TOKEN_CRITERIA,
  TOKEN_TYPES
} from "./const";
import {
  CoreTermsOfSale,
  CreateProductForm,
  CreateYourProfile,
  TokenGating,
  VariantsCoreTermsOfSale
} from "./types";

export const createYourProfileInitialValues: CreateYourProfile = {
  createYourProfile: {
    logo: undefined,
    coverPicture: undefined,
    name: "",
    email: "",
    description: "",
    website: "",
    legalTradingName: "",
    contactPreference: OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE[0]
  }
} as const;

export const productTypeInitialValues = {
  productType: {
    productType: "",
    productVariant: "",
    tokenGatedOffer: ""
  }
} as const;

export const productInformationInitialValues = {
  productInformation: {
    productTitle: "",
    description: "",
    category: null,
    tags: [],
    attributes: [
      {
        name: "",
        value: ""
      }
    ],
    sku: undefined,
    id: undefined,
    idType: undefined,
    brandName: undefined,
    manufacture: undefined,
    manufactureModelName: undefined,
    partNumber: undefined,
    materials: undefined
  }
} as const;

export const productVariantsInitialValues = {
  productVariants: {
    colors: [] as string[],
    sizes: [] as string[],
    variants: []
  }
};

export const productVariantsImagesInitialValues = {
  productVariantsImages: [],
  productAnimation: []
};

export const productImagesInitialValues = {
  productImages: {
    thumbnail: undefined,
    secondary: undefined,
    everyAngle: undefined,
    details: undefined,
    inUse: undefined,
    styledScene: undefined,
    sizeAndScale: undefined,
    more: undefined
  },
  productAnimation: []
} as const;

export const coreTermsOfSaleInitialValues: CoreTermsOfSale = {
  coreTermsOfSale: {
    price: null as unknown as number,
    currency: OPTIONS_CURRENCIES[0],
    quantity: 1,
    redemptionPeriod: [],
    offerValidityPeriod: []
  }
};

export const variantsCoreTermsOfSaleInitialValues: VariantsCoreTermsOfSale = {
  variantsCoreTermsOfSale: {
    redemptionPeriod: [],
    offerValidityPeriod: []
  }
};

export const tokenGatingInitialValues: TokenGating = {
  tokenGating: {
    tokenContract: "",
    tokenType: TOKEN_TYPES[0],
    minBalance: undefined,
    tokenId: undefined,
    maxCommits: "",
    tokenGatingDesc: "",
    tokenCriteria: TOKEN_CRITERIA[0]
  }
};

export const termsOfExchangeInitialValues = {
  termsOfExchange: {
    exchangePolicy: OPTIONS_EXCHANGE_POLICY[0],
    buyerCancellationPenalty: "",
    buyerCancellationPenaltyUnit: OPTIONS_UNIT[0],
    sellerDeposit: "",
    sellerDepositUnit: OPTIONS_UNIT[0],
    disputeResolver: OPTIONS_DISPUTE_RESOLVER[0],
    disputePeriod: "",
    disputePeriodUnit: OPTIONS_PERIOD[0]
  }
} as const;

export const shippingInfoInitialValues = {
  shippingInfo: {
    country: { value: "", label: "" },
    jurisdiction: [
      {
        region: "",
        time: ""
      }
    ],
    redemptionPointName: "Website",
    redemptionPointUrl: "",
    dimensions: "",
    weight: "",
    weightUnit: OPTIONS_WEIGHT[1],
    measurementUnit: OPTIONS_LENGTH[1],
    height: "",
    width: "",
    length: "",
    returnPeriod: CONFIG.defaultReturnPeriodInDays.toString(),
    returnPeriodUnit: OPTIONS_PERIOD[0]
  }
} as const;

export const disputeCentreInitialValues = {
  [DisputeFormModel.formFields.getStarted.name]: "",
  [DisputeFormModel.formFields.tellUsMore.name]: "",
  [FormModel.formFields.description.name]: "",
  [FormModel.formFields.proposalType.name]: null as unknown as {
    value: string;
    label: string;
  },
  [FormModel.formFields.refundAmount.name]: "0",
  [FormModel.formFields.refundPercentage.name]: 0,
  [FormModel.formFields.upload.name]: [] as File[]
} as const;

export const imagesSpecificOrAllInitialValues = {
  imagesSpecificOrAll: {
    value: "all",
    label: "All"
  }
};

export const initialValues: CreateProductForm = {
  ...createYourProfileInitialValues,
  ...productTypeInitialValues,
  ...productVariantsInitialValues,
  ...productInformationInitialValues,
  ...productImagesInitialValues,
  ...productVariantsImagesInitialValues,
  ...coreTermsOfSaleInitialValues,
  ...variantsCoreTermsOfSaleInitialValues,
  ...termsOfExchangeInitialValues,
  ...shippingInfoInitialValues,
  ...disputeCentreInitialValues,
  ...imagesSpecificOrAllInitialValues,
  ...tokenGatingInitialValues
} as const;
