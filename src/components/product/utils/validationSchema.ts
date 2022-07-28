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
    // category: Yup.string().required(validationMessage.required),
    // tags: Yup.string().required(validationMessage.required),
    attribute: Yup.string().required(validationMessage.required),
    attributeValue: Yup.string().required(validationMessage.required),
    description: Yup.string().required(validationMessage.required)
  })
});

export const coreTermsOfSaleValidationSchema = Yup.object({
  coreTermsOfSale: Yup.object({
    price: Yup.string().required(validationMessage.required),
    // currency: Yup.string().required(validationMessage.required),
    // TODO: ADD Use price for all variants FILED
    quantity: Yup.string().required(validationMessage.required),
    // tokenGatedOffer: Yup.string().required(validationMessage.required),
    redemptionPeriod: Yup.string().required(validationMessage.required),
    offerValidityPeriod: Yup.string().required(validationMessage.required)
  })
});

export const termsOfExchangeValidationSchema = Yup.object({
  termsOfExchange: Yup.object({
    // exchangePolicy: Yup.string().required(validationMessage.required),
    buyerCancellationPenalty: Yup.string().required(validationMessage.required),
    // buyerCancellationPenaltyUnit: Yup.string().required( validationMessage.required ),
    sellerDeposit: Yup.string().required(validationMessage.required),
    // sellerDepositUnit: Yup.string().required(validationMessage.required),
    // disputeResolver: Yup.string().required(validationMessage.required),
    disputePeriod: Yup.string().required(validationMessage.required)
    // disputePeriodUnit: Yup.string().required(validationMessage.required)
  })
});

export const shippingInfoValidationSchema = Yup.object({
  shippingInfo: Yup.object({
    height: Yup.string().required(validationMessage.required),
    width: Yup.string().required(validationMessage.required),
    length: Yup.string().required(validationMessage.required),
    measurementUnit: Yup.mixed().required(validationMessage.required)
  })
});
