import { FormModel } from "../../modal/components/Chat/MakeProposal/MakeProposalFormModel";
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
  creteYourProfile: {
    logo: null,
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
    ]
  }
} as const;

export const productImagesInitialValues = {
  productImages: {
    thumbnail: null,
    secondary: null,
    everyAngle: null,
    details: null,
    inUse: null,
    styledScene: null,
    sizeAndScale: null,
    more: null
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
    addUrl: "",
    dimensions: "",
    weight: "",
    weightUnit: OPTIONS_WEIGHT[1],
    measurementUnit: OPTIONS_LENGTH[1],
    height: "",
    width: "",
    length: ""
  }
} as const;

export const disputeCentreInitialValues = {
  getStarted: "",
  tellUsMore: "",
  [FormModel.formFields.description.name]: "",
  [FormModel.formFields.proposalsTypes.name]: [] as {
    label: string;
    value: string;
  }[],
  [FormModel.formFields.refundAmount.name]: "0",
  [FormModel.formFields.refundPercentage.name]: 0,
  [FormModel.formFields.upload.name]: [] as File[]
} as const;

export const initialValues: CreateProductForm = {
  ...createYourProfileInitialValues,
  ...productTypeInitialValues,
  ...productInformationInitialValues,
  ...productImagesInitialValues,
  ...coreTermsOfSaleInitialValues,
  ...termsOfExchangeInitialValues,
  ...shippingInfoInitialValues,
  ...disputeCentreInitialValues
} as const;
