import * as Yup from "yup";

import { validationMessage } from "../../../lib/const/validationMessage";
import { MAX_IMAGE_SIZE, MAX_LOGO_SIZE } from "./const";
import {
  validationOfImage,
  validationOfRequiredImage
} from "./validationUtils";

export const createYourProfileValidationSchema = Yup.object({
  creteYourProfile: Yup.object({
    logo: validationOfRequiredImage(MAX_LOGO_SIZE),
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

export const productImagesValidationSchema = Yup.object({
  productImages: Yup.object({
    thumbnail: validationOfRequiredImage(MAX_IMAGE_SIZE),
    secondary: validationOfImage(MAX_IMAGE_SIZE),
    everyAngle: validationOfImage(MAX_IMAGE_SIZE),
    details: validationOfImage(MAX_IMAGE_SIZE),
    inUse: validationOfImage(MAX_IMAGE_SIZE),
    styledScene: validationOfImage(MAX_IMAGE_SIZE),
    sizeAndScale: validationOfImage(MAX_IMAGE_SIZE),
    more: validationOfImage(MAX_IMAGE_SIZE)
  })
});

export const productInformationValidationSchema = Yup.object({
  productInformation: Yup.object({
    productTitle: Yup.string().required(validationMessage.required),
    category: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string()
      })
      .required(validationMessage.required),
    // tags: Yup.string().required(validationMessage.required),
    attributes: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string(),
          value: Yup.string()
        })
      )
      .default([{ name: "", value: "" }]),
    description: Yup.string().required(validationMessage.required)
  })
});

export const coreTermsOfSaleValidationSchema = Yup.object({
  coreTermsOfSale: Yup.object({
    price: Yup.string().required(validationMessage.required),
    currency: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string()
      })
      .required(validationMessage.required),
    // currency: Yup.string().required(validationMessage.required),
    // TODO: ADD Use price for all variants FILED
    quantity: Yup.string().required(validationMessage.required),
    // tokenGatedOffer: Yup.string().required(validationMessage.required),
    offerValidityPeriod: Yup.array()
      .of(
        Yup.object().shape({
          $d: Yup.string()
        })
      )
      .default([{ $d: "" }]),
    redemptionPeriod: Yup.array()
      .of(
        Yup.object().shape({
          $d: Yup.string()
        })
      )
      .default([{ $d: "" }])
  })
});

export const termsOfExchangeValidationSchema = Yup.object({
  termsOfExchange: Yup.object({
    exchangePolicy: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string()
      })
      .required(validationMessage.required),
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
    measurementUnit: Yup.mixed().required(validationMessage.required),
    jurisdiction: Yup.array()
      .of(
        Yup.object().shape({
          region: Yup.string(),
          time: Yup.string()
        })
      )
      .default([{ region: "", time: "" }])
  })
});
