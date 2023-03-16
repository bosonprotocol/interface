import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";

import { validationMessage } from "../../../lib/const/validationMessage";
import { fixformattedString } from "../../../lib/utils/number";
import Yup from "../../../lib/validation/index";
import { validationOfFile } from "../../../pages/chat/components/UploadForm/const";
import { Token } from "../../convertion-rate/ConvertionRateContext";
import { MIN_VALUE } from "../../modal/components/Chat/const";
import { FormModel } from "../../modal/components/Chat/MakeProposal/MakeProposalFormModel";
import { DisputeFormModel } from "../../modal/components/DisputeModal/DisputeModalFormModel";
import { CONFIG } from "./../../../lib/config";
import { SelectDataProps } from "./../../form/types";
import {
  OPTIONS_EXCHANGE_POLICY,
  OPTIONS_TOKEN_GATED,
  OPTIONS_UNIT,
  TOKEN_CRITERIA,
  TOKEN_TYPES
} from "./const";
import {
  validationOfIpfsImage,
  validationOfRequiredIpfsImage
} from "./validationUtils";

export const createYourProfileValidationSchema = Yup.object({
  createYourProfile: Yup.object({
    logo: validationOfRequiredIpfsImage(),
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

function testPrice(price: number | null | undefined) {
  if (!this.parent.currency?.value) {
    return true;
  }
  if (!price || price < 1e-100) {
    return false;
  }
  try {
    const currencySymbol = this.parent.currency.value; // there has to be a sibling with the currency
    const exchangeToken = CONFIG.defaultTokens.find(
      (n: Token) => n.symbol === currencySymbol
    );
    const decimals = exchangeToken?.decimals || 18;
    const priceWithoutEnotation =
      price < 0.1 ? fixformattedString(price) : price.toString();
    parseUnits(priceWithoutEnotation, decimals);
    return true;
  } catch (error) {
    console.error(
      `error in test function in price validation, price: ${price}`,
      error
    );
    return false;
  }
}

const productAnimation = {
  productAnimation: validationOfIpfsImage()
};

export const productVariantsValidationSchema = Yup.object({
  productVariants: Yup.object({
    colors: Yup.array(Yup.string()),
    sizes: Yup.array(Yup.string()),
    variants: Yup.array(
      Yup.object({
        color: Yup.string(),
        size: Yup.string(),
        name: Yup.string(),
        currency: Yup.object({
          value: Yup.string(),
          label: Yup.string()
        })
          .nullable()
          .required("Currency is required"),
        price: Yup.number()
          .nullable()
          .required("Price is required")
          .min(0, "Should be 0 or more")
          .test({
            name: "valid_bigNumber",
            message: "Price is not valid",
            test: testPrice
          }),
        quantity: Yup.number()
          .nullable()
          .required("Quantity is required")
          .min(1, "Must be greater than or equal to 1")
      })
    )
      .required("Variants are required")
      .min(2, "You have to define at least two variants")
      .max(12, "Maximum 12 variants per product")
  })
});

export const productImagesValidationSchema = Yup.object({
  productImages: Yup.object({
    thumbnail: validationOfRequiredIpfsImage(),
    secondary: validationOfIpfsImage(),
    everyAngle: validationOfIpfsImage(),
    details: validationOfIpfsImage(),
    inUse: validationOfIpfsImage(),
    styledScene: validationOfIpfsImage(),
    sizeAndScale: validationOfIpfsImage(),
    more: validationOfIpfsImage()
  }),
  ...productAnimation
});

export const productVariantsImagesValidationSchema = Yup.object({
  productVariantsImages: Yup.array(
    Yup.object().concat(productImagesValidationSchema)
  ).test({
    name: "minLength",
    test: function (value) {
      return value?.length === this.parent.productVariants.variants.length;
    }
  }),
  ...productAnimation
});

export const imagesSpecificOrAllValidationSchema = Yup.object({
  imagesSpecificOrAll: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().oneOf(["all", "specific"]).required()
  }).nullable()
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

const commonCoreTermsOfSaleValidationSchema = {
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
  redemptionPeriod: Yup.mixed().isItBeforeNow().isRedemptionDatesValid(), // prettier-ignore
  tokenGatedVariants: Yup.object()
    .when(["tokenGatedOffer"], {
      is: (tokenGated: SelectDataProps) =>
        tokenGated?.value === OPTIONS_TOKEN_GATED[1].value,
      then: (schema) => schema.required(validationMessage.required)
    })
    .shape({
      value: Yup.string(),
      label: Yup.string()
    })
    .default([{ value: "", label: "" }]),
  tokenContract: Yup.string()
    .when(["tokenGatedOffer"], {
      is: (tokenGated: SelectDataProps) =>
        tokenGated?.value === OPTIONS_TOKEN_GATED[1].value,
      then: (schema) => schema.required(validationMessage.required)
    })
    .test("FORMAT", "Must be a valid address", (value) =>
      value ? ethers.utils.isAddress(value) : true
    ),
  maxCommits: Yup.string()
    .when(["tokenGatedOffer"], {
      is: (tokenGated: SelectDataProps) =>
        tokenGated?.value === OPTIONS_TOKEN_GATED[1].value,
      then: (schema) => schema.required(validationMessage.required)
    })
    .matches(/^\+?[1-9]\d*$/, "Value must greater than or equal to 0"),
  tokenType: Yup.object()
    .when(["tokenGatedOffer"], {
      is: (tokenGated: SelectDataProps) =>
        tokenGated?.value === OPTIONS_TOKEN_GATED[1].value,
      then: (schema) => schema.required(validationMessage.required)
    })
    .shape({
      value: Yup.string(),
      label: Yup.string()
    })
    .default([{ value: "", label: "" }]),
  tokenCriteria: Yup.object()
    .when(["tokenGatedOffer"], {
      is: (tokenGated: SelectDataProps) =>
        tokenGated?.value === OPTIONS_TOKEN_GATED[1].value,
      then: (schema) => schema.required(validationMessage.required)
    })
    .shape({
      value: Yup.string(),
      label: Yup.string()
    })
    .default([{ value: "", label: "" }]),
  minBalance: Yup.string().when(
    ["tokenGatedOffer", "tokenType", "tokenCriteria"],
    {
      is: (
        tokenGated: SelectDataProps,
        tokenType: SelectDataProps,
        tokenCriteria: SelectDataProps
      ) =>
        (tokenGated?.value === OPTIONS_TOKEN_GATED[1].value &&
          tokenType?.value === TOKEN_TYPES[0].value) ||
        (tokenGated?.value === OPTIONS_TOKEN_GATED[1].value &&
          tokenType?.value === TOKEN_TYPES[2].value) ||
        (tokenGated?.value === OPTIONS_TOKEN_GATED[1].value &&
          tokenType?.value === TOKEN_TYPES[1].value &&
          tokenCriteria?.value === TOKEN_CRITERIA[0].value),
      then: (schema) =>
        schema
          .required(validationMessage.required)
          .matches(
            /^\+?[1-9]\d*$/,
            "Min balance must be greater than or equal to 1"
          )
          .typeError("Value must be an integer greater than or equal to 1")
    }
  ),
  tokenId: Yup.string().when(
    ["tokenGatedOffer", "tokenType", "tokenCriteria"],
    {
      is: (
        tokenGated: SelectDataProps,
        tokenType: SelectDataProps,
        tokenCriteria: SelectDataProps
      ) =>
        (tokenGated?.value === OPTIONS_TOKEN_GATED[1].value &&
          tokenType?.value === TOKEN_TYPES[2].value) ||
        (tokenGated?.value === OPTIONS_TOKEN_GATED[1].value &&
          tokenType?.value === TOKEN_TYPES[1].value &&
          tokenCriteria?.value === TOKEN_CRITERIA[1].value),
      then: (schema) =>
        schema
          .test(
            "",
            "Value must greater than or equal to 0 or a hex value up to 64 chars",
            (value) => {
              if (!value) {
                return false;
              }
              return (
                /0[xX][0-9a-fA-F]{1,64}$/.test(value) ||
                /^(0|\+?[1-9]\d*)$/.test(value)
              );
            }
          )
          .typeError("Value must be an integer greater than or equal to 0")
          .required(validationMessage.required)
    }
  ),

  tokenGatingDesc: Yup.string().when(["tokenGatedOffer"], {
    is: (tokenGated: SelectDataProps) =>
      tokenGated?.value === OPTIONS_TOKEN_GATED[1].value,
    then: (schema) => schema.required(validationMessage.required)
  })
};

export const coreTermsOfSaleValidationSchema = Yup.object({
  coreTermsOfSale: Yup.object({
    price: Yup.number().nullable().required(validationMessage.required).test({
      name: "valid_bigNumber",
      message: "Price is not valid",
      test: testPrice
    }),
    currency: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string()
      })
      .required(validationMessage.required),
    quantity: Yup.number()
      .min(1, "Quantity must be greater than or equal to 1")
      .required(validationMessage.required),
    ...commonCoreTermsOfSaleValidationSchema
  })
});

export const variantsCoreTermsOfSaleValidationSchema = Yup.object({
  variantsCoreTermsOfSale: Yup.object({
    ...commonCoreTermsOfSaleValidationSchema
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
    buyerCancellationPenaltyUnit: Yup.object({
      value: Yup.string().oneOf(OPTIONS_UNIT.map(({ value }) => value)),
      label: Yup.string()
    }),
    sellerDeposit: Yup.string().required(validationMessage.required),
    sellerDepositUnit: Yup.object({
      value: Yup.string(),
      label: Yup.string()
    }),
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
