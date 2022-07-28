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
    description: "",
    category: "",
    tags: "",
    productAttribute: []
  }
};

export const coreTermsOfSaleInitialValues = {
  coreTermsOfSale: {
    price: "",
    symbol: "",
    // TODO: ADD Use price for all variants FILED
    amount: "",
    tokenGatedOffer: "",
    redemptionPeriod: "",
    offerValidityPeriod: ""
  }
} as const;

export const termsOfExchangeInitialValues = {
  termsOfExchange: {
    fairExchangePolicy: "",
    buyerCancellationPenalty: "",
    buyerCancellationPenaltyPercent: "",
    sellerDeposit: "",
    sellerDepositPercent: "",
    disputeResolver: "",
    disputePeriodAmount: "",
    disputePeriodPercent: ""
  }
} as const;

export const initialValues: CreateProductForm = {
  ...createYourProfileInitialValues,
  ...productTypeInitialValues,
  ...productInformationInitialValues,
  ...coreTermsOfSaleInitialValues,
  ...termsOfExchangeInitialValues
} as const;
