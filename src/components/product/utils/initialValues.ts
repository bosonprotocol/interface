import { CONFIG } from "../../../lib/config";
import { FormModel } from "../../modal/components/Chat/MakeProposal/MakeProposalFormModel";
import { DisputeFormModel } from "../../modal/components/DisputeModal/DisputeModalFormModel";
import {
  OPTIONS_CURRENCIES,
  OPTIONS_DISPUTE_RESOLVER,
  OPTIONS_EXCHANGE_POLICY,
  OPTIONS_LENGTH,
  OPTIONS_PERIOD,
  OPTIONS_TOKEN_GATED,
  OPTIONS_UNIT,
  OPTIONS_WEIGHT
} from "./const";
import { CreateProductForm } from "./types";

export const createYourProfileInitialValues = {
  createYourProfile: {
    logo: undefined,
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
  productVariants: {}
} as const;

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
  }
} as const;

export const coreTermsOfSaleInitialValues = {
  coreTermsOfSale: {
    price: "",
    currency: OPTIONS_CURRENCIES[0],
    quantity: 1,
    tokenGatedOffer: OPTIONS_TOKEN_GATED[0],
    redemptionPeriod: [],
    offerValidityPeriod: []
  }
} as const;

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
    returnPeriod: CONFIG.minimumReturnPeriodInDays.toString(),
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

export const initialValues: CreateProductForm = {
  ...createYourProfileInitialValues,
  ...productTypeInitialValues,
  ...productVariantsInitialValues,
  ...productInformationInitialValues,
  ...productImagesInitialValues,
  ...coreTermsOfSaleInitialValues,
  ...termsOfExchangeInitialValues,
  ...shippingInfoInitialValues,
  ...disputeCentreInitialValues
} as const;
