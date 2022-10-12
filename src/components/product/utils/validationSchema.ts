import { validationMessage } from "../../../lib/const/validationMessage";
import Yup from "../../../lib/validation/index";
import { validationOfFile } from "../../../pages/chat/components/UploadForm/const";
import { MIN_VALUE } from "../../modal/components/Chat/const";
import { FormModel } from "../../modal/components/Chat/MakeProposal/MakeProposalFormModel";
import { DisputeFormModel } from "../../modal/components/DisputeModal/DisputeModalFormModel";
import { CONFIG } from "./../../../lib/config";
import { SelectDataProps } from "./../../form/types";
import { OPTIONS_EXCHANGE_POLICY } from "./const";
import {
  validationOfImage,
  validationOfRequiredImage
} from "./validationUtils";

export const createYourProfileValidationSchema = Yup.object({
  createYourProfile: Yup.object({
    logo: validationOfRequiredImage(),
    name: Yup.string().trim().required(validationMessage.required),
    email: Yup.string().trim().required(validationMessage.required),
    description: Yup.string().trim().required(validationMessage.required),
    website: Yup.string().trim().required(validationMessage.required)
  })
});

export const productTypeValidationSchema = Yup.object({
  productType: Yup.object({
    productType: Yup.string()
      .min(1)
      .oneOf(["physical", "phygital"])
      .required(validationMessage.required),
    productVariant: Yup.string().min(1).required(validationMessage.required)
  })
});

export const productImagesValidationSchema = Yup.object({
  productImages: Yup.object({
    thumbnail: validationOfRequiredImage(),
    secondary: validationOfImage(),
    everyAngle: validationOfImage(),
    details: validationOfImage(),
    inUse: validationOfImage(),
    styledScene: validationOfImage(),
    sizeAndScale: validationOfImage(),
    more: validationOfImage()
  })
});

export const productVariantsValidationSchema = Yup.object({
  productVariants: Yup.object({})
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
    tags: Yup.array()
      .of(Yup.string())
      .default([])
      .min(1, "Please provide at least one tag"),
    attributes: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string(),
          value: Yup.string()
        })
      )
      .default([{ name: "", value: "" }]),
    description: Yup.string().required(validationMessage.required),
    sku: Yup.string(),
    id: Yup.string(),
    idType: Yup.string(),
    brandName: Yup.string(),
    manufacture: Yup.string(),
    manufactureModelName: Yup.string(),
    partNumber: Yup.string(),
    materials: Yup.string()
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
    quantity: Yup.number()
      .min(1, "Quantity must be greater than or equal to 1")
      .required(validationMessage.required),
    tokenGatedOffer: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string()
      })
      .default([{ value: "", label: "" }]),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    offerValidityPeriod: Yup.mixed().isItBeforeNow().isOfferValidityDatesValid(), // prettier-ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    redemptionPeriod: Yup.mixed().isItBeforeNow().isRedemptionDatesValid() // prettier-ignore
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
    disputePeriod: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .required(validationMessage.required)
      .when(["exchangePolicy"], {
        is: (exchangePolicy: SelectDataProps) =>
          exchangePolicy &&
          exchangePolicy.value === OPTIONS_EXCHANGE_POLICY[0].value,
        then: (schema) =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          schema.disputePeriodValue(`The Dispute Period must be in line with the selected exchange policy (>=${CONFIG.minimumDisputePeriodInDays} days)` ) // prettier-ignore
      })
    // disputePeriodUnit: Yup.string().required(validationMessage.required)
  })
});

export const shippingInfoValidationSchema = Yup.object({
  shippingInfo: Yup.object({
    weight: Yup.string(),
    weightUnit: Yup.object({ value: Yup.string(), label: Yup.string() }),
    height: Yup.string(),
    width: Yup.string(),
    length: Yup.string(),
    redemptionPointName: Yup.string(),
    redemptionPointUrl: Yup.string(),
    measurementUnit: Yup.mixed().required(validationMessage.required),
    country: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string()
      })
      .default([{ value: "", label: "" }]),
    jurisdiction: Yup.array()
      .of(
        Yup.object().shape({
          region: Yup.string(),
          time: Yup.string()
        })
      )
      .default([{ region: "", time: "" }]),
    returnPeriod: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .required(validationMessage.required)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .returnPeriodValue()
  })
});

export const disputeCentreValidationSchemaGetStarted = Yup.object({
  [DisputeFormModel.formFields.getStarted.name]: Yup.string().required(
    validationMessage.required
  )
});

export const disputeCentreValidationSchemaTellUsMore = Yup.object({
  [DisputeFormModel.formFields.tellUsMore.name]: Yup.string().required(
    validationMessage.required
  )
});

export const disputeCentreValidationSchemaAdditionalInformation = Yup.object({
  [FormModel.formFields.description.name]: Yup.string()
    .trim()
    .required(FormModel.formFields.description.requiredErrorMessage),
  [FormModel.formFields.upload.name]: validationOfFile({ isOptional: true })
});

export const disputeCentreValidationSchemaMakeProposal = Yup.object({
  [FormModel.formFields.proposalType.name]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required()
  }).nullable(),
  [FormModel.formFields.refundPercentage.name]: Yup.number().when(
    FormModel.formFields.proposalType.name,
    (proposalType) => {
      if (proposalType) {
        return Yup.number()
          .min(
            MIN_VALUE,
            FormModel.formFields.refundPercentage.moreThanErrorMessage(
              MIN_VALUE
            )
          )
          .max(100, FormModel.formFields.refundPercentage.maxErrorMessage)
          .defined(FormModel.formFields.refundPercentage.emptyErrorMessage);
      } else {
        return Yup.number();
      }
    }
  )
});

export const disputeCentreValidationSchemaProposalSummary = Yup.object({});
