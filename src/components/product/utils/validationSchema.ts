import { CoreSDK } from "@bosonprotocol/react-kit";
import { parseUnits } from "@ethersproject/units";
import {
  maxLengthErrorMessage,
  METADATA_LENGTH_LIMIT
} from "components/modal/components/Profile/const";
import { Dayjs } from "dayjs";
import { ethers } from "ethers";

import { validationMessage } from "../../../lib/constants/validationMessage";
import { fixformattedString } from "../../../lib/utils/number";
import Yup from "../../../lib/validation/index";
import { Token } from "../../convertion-rate/ConvertionRateContext";
import { FileProps } from "../../form/Upload/types";
import { getCommonFieldsValidation } from "../../modal/components/Profile/validationSchema";
import { CONFIG, DappConfig } from "./../../../lib/config";
import { SelectDataProps } from "./../../form/types";
import {
  OPTIONS_DISPUTE_RESOLVER,
  OPTIONS_EXCHANGE_POLICY,
  OPTIONS_LENGTH,
  OPTIONS_PERIOD,
  OPTIONS_UNIT,
  ProductTypeValues,
  TOKEN_CRITERIA,
  TOKEN_TYPES,
  TokenTypes
} from "./const";
import {
  validationOfIpfsImage,
  validationOfRequiredIpfsImage
} from "./validationUtils";

export const regularProfileValidationSchema = Yup.object({
  createYourProfile: Yup.object({
    logo: validationOfRequiredIpfsImage(),
    coverPicture: validationOfRequiredIpfsImage<
      FileProps & { fit?: string; position?: string }
    >(),
    ...getCommonFieldsValidation({ withMaxLengthValidation: false })
  })
});

export const productTypeValidationSchema = Yup.object({
  productType: Yup.object({
    productType: Yup.string()
      .min(1)
      .oneOf(["physical", "phygital"])
      .required(validationMessage.required),
    productVariant: Yup.string().min(1).required(validationMessage.required),
    tokenGatedOffer: Yup.string()
      .min(1)
      .oneOf(["true", "false"])
      .required(validationMessage.required)
  })
});

const testPrice = (config: DappConfig) =>
  function (price: number | null | undefined) {
    if (!this.parent.currency?.value) {
      return true;
    }
    const _price = price as number;
    if (_price === null || isNaN(_price) || (_price > 0 && _price < 1e-100)) {
      return false;
    }
    try {
      const currencySymbol = this.parent.currency.value; // there has to be a sibling with the currency
      const exchangeToken = config.envConfig.defaultTokens?.find(
        (n: Token) => n.symbol === currencySymbol
      );
      const decimals = exchangeToken?.decimals || 18;
      const priceWithoutEnotation =
        _price < 0.1 ? fixformattedString(_price) : _price.toString();
      parseUnits(priceWithoutEnotation, decimals);
      return true;
    } catch (error) {
      console.error(
        `error in test function in price validation, price: ${price}`,
        error
      );
      return false;
    }
  };

const productAnimation = {
  productAnimation: validationOfIpfsImage()
};

export const getProductVariantsValidationSchema = (config: DappConfig) =>
  Yup.object({
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
              test: testPrice(config)
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
export type ProductVariantsValidationSchema = ReturnType<
  typeof getProductVariantsValidationSchema
>;

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
      return value?.length === this.parent.productVariants?.variants.length;
    }
  }),
  ...productAnimation
});

export const imagesSpecificOrAllValidationSchema = Yup.object({
  imagesSpecificOrAll: Yup.object({
    label: Yup.string().required(validationMessage.required),
    value: Yup.string()
      .oneOf(["all", "specific"])
      .required(validationMessage.required)
  }).nullable()
});

export const productInformationValidationSchema = Yup.object({
  productInformation: Yup.object({
    productTitle: Yup.string()
      .max(METADATA_LENGTH_LIMIT, maxLengthErrorMessage)
      .required(validationMessage.required),
    category: Yup.object({
      value: Yup.string(),
      label: Yup.string()
    }).required(validationMessage.required),
    tags: Yup.array(Yup.string().required(validationMessage.required))
      .default([])
      .min(1, "Please provide at least one tag"),
    attributes: Yup.array(
      Yup.object({
        name: Yup.string(),
        value: Yup.string()
      })
    ).default([{ name: "", value: "" }]),
    description: Yup.string()
      .max(METADATA_LENGTH_LIMIT, maxLengthErrorMessage)
      .required(validationMessage.required),
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

export const commonCoreTermsOfSaleValidationSchema = {
  infiniteExpirationOffers: Yup.boolean(),
  offerValidityPeriod: Yup.mixed<Dayjs | Dayjs[]>()
    .when("infiniteExpirationOffers", {
      is: true,
      then: Yup.mixed<Dayjs>()
        .required(validationMessage.required)
        .defined(validationMessage.required),
      otherwise: Yup.mixed<Dayjs[]>()
        .required(validationMessage.required)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .isOfferValidityDatesValid()
    })
    .required(validationMessage.required),
  redemptionPeriod: Yup.mixed<Dayjs | Dayjs[]>().when(
    "infiniteExpirationOffers",
    {
      is: true,
      then: Yup.mixed<Dayjs>().optional(),
      // .required(validationMessage.required)
      // .defined(validationMessage.required),
      otherwise: Yup.mixed<Dayjs[]>()
        // Yup.array<Dayjs>()
        .required(validationMessage.required)
        // .min(2, validationMessage.required)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .isRedemptionDatesValid()
    }
  ),
  voucherValidDurationInDays: Yup.number().when("infiniteExpirationOffers", {
    is: true,
    then: () => {
      return Yup.number()
        .required(validationMessage.required)
        .min(0, "It cannot be negative")
        .test({
          message:
            "It cannot be 0 if the redemption from date is not specified",
          test: function (value, context) {
            const { redemptionPeriod } = context.parent;
            return redemptionPeriod ? true : value !== 0;
          }
        });
    },
    otherwise: Yup.number().min(0, "It must be 0").max(0, "It must be 0")
  })
};

export type TokenGatingValidationSchema = ReturnType<
  typeof getTokenGatingValidationSchema
>;
export const getTokenGatingValidationSchema = ({
  coreSDK
}: {
  coreSDK: CoreSDK;
}) =>
  Yup.object({
    tokenGating: Yup.object({
      tokenContract: Yup.string()
        .required(validationMessage.required)
        .test("FORMAT", "Must be a valid address", (value) =>
          value ? ethers.utils.isAddress(value) : true
        )
        .test("wrongTokenAddress", async function (tokenContract) {
          const { tokenType } = this.parent;
          if (
            tokenType.value &&
            tokenContract &&
            ethers.utils.isAddress(tokenContract)
          ) {
            const doesImplementFunction = (error: unknown): boolean => {
              return !(
                error &&
                typeof error === "object" &&
                "data" in error &&
                error.data === "0x"
              );
            };
            const erc721InterfaceId = "0x80ac58cd";
            const erc1155InterfaceId = "0xd9b67a26";
            const throwNotValidContractError = () => {
              throw this.createError({
                path: this.path,
                message: `This is not an ${tokenType.label} contract address`
              });
            };
            try {
              switch (tokenType.value) {
                case TokenTypes.erc20:
                  {
                    let erc721Supported = false;
                    try {
                      erc721Supported = await coreSDK.erc165SupportsInterface({
                        contractAddress: tokenContract,
                        interfaceId: erc721InterfaceId
                      });
                    } catch {
                      // we ignore the error
                    }
                    if (erc721Supported) {
                      throwNotValidContractError();
                    } else {
                      let erc1155Supported = false;
                      try {
                        erc1155Supported =
                          await coreSDK.erc165SupportsInterface({
                            contractAddress: tokenContract,
                            interfaceId: erc1155InterfaceId
                          });
                      } catch {
                        // we ignore the error
                      }
                      if (erc1155Supported) {
                        throwNotValidContractError();
                      }
                    }
                    await coreSDK.erc20BalanceOf({
                      contractAddress: tokenContract,
                      owner: ethers.constants.AddressZero
                    });
                  }
                  break;
                case TokenTypes.erc721:
                  {
                    const erc721Supported =
                      await coreSDK.erc165SupportsInterface({
                        contractAddress: tokenContract,
                        interfaceId: erc721InterfaceId
                      });
                    if (!erc721Supported) {
                      throwNotValidContractError();
                    }
                  }
                  break;
                case TokenTypes.erc1155:
                  {
                    const erc1155Supported =
                      await coreSDK.erc165SupportsInterface({
                        contractAddress: tokenContract,
                        interfaceId: erc1155InterfaceId
                      });
                    if (!erc1155Supported) {
                      throwNotValidContractError();
                    }
                  }
                  break;
              }
            } catch (error) {
              if (
                !doesImplementFunction(error) ||
                (error && error instanceof Yup.ValidationError)
              ) {
                throwNotValidContractError();
              }
            }
          }
          return true;
        }),
      maxCommits: Yup.string()
        .required(validationMessage.required)
        .matches(/^\+?[1-9]\d*$/, "Value must greater than 0")
        .test("notGreaterThan_initialQuantity", function (value, context) {
          if (value && Number.isInteger(Number.parseInt(value))) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const formValues = context.from[1].value;
            const isOneVariant =
              formValues.productType.productVariant ===
              ProductTypeValues.oneItemType;
            const variantsQuantity = isOneVariant
              ? 0
              : (
                  formValues.productVariants
                    .variants as Yup.InferType<ProductVariantsValidationSchema>["productVariants"]["variants"]
                ).reduce((acum, current) => {
                  acum = acum + current.quantity;
                  return acum;
                }, 0);
            const quantity = isOneVariant
              ? formValues.coreTermsOfSale.quantity
              : variantsQuantity;

            const asNumber = Number.parseInt(value);
            const isGreater = asNumber > quantity;
            if (isGreater) {
              throw this.createError({
                path: this.path,
                message: isOneVariant
                  ? `Unlocks per wallet need to be greater than or equal to the quantity of the offers specified (${formValues.coreTermsOfSale.quantity})`
                  : `Unlocks per wallet need to be greater than or equal to the quantity of the offers specified (${variantsQuantity})`
              });
            }
            return true;
          }
          return false;
        }),
      tokenType: Yup.object({
        value: Yup.string(),
        label: Yup.string()
      })
        .required(validationMessage.required)
        .default([{ value: "", label: "" }]),
      tokenCriteria: Yup.object({
        value: Yup.string(),
        label: Yup.string()
      }).required(validationMessage.required),
      minBalance: Yup.string().when(["tokenType", "tokenCriteria"], {
        is: (tokenType: SelectDataProps, tokenCriteria: SelectDataProps) =>
          tokenType?.value === TOKEN_TYPES[0].value ||
          tokenType?.value === TOKEN_TYPES[2].value ||
          (tokenType?.value === TOKEN_TYPES[1].value &&
            tokenCriteria?.value === TOKEN_CRITERIA[0].value),
        then: (schema) =>
          schema
            .required(validationMessage.required)
            .matches(
              /^\+?[1-9]\d*$/,
              "Min balance must be greater than or equal to 1 (do not include commas/periods)"
            )
            .typeError("Value must be an integer greater than or equal to 1")
      }),
      tokenId: Yup.string().when(["tokenType", "tokenCriteria"], {
        is: (tokenType: SelectDataProps, tokenCriteria: SelectDataProps) =>
          tokenType?.value === TOKEN_TYPES[2].value ||
          (tokenType?.value === TOKEN_TYPES[1].value &&
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
      })

      // tokenGatingDesc: Yup.string().required(validationMessage.required)
    })
  });

export const getCoreTermsOfSaleValidationSchema = (config: DappConfig) =>
  Yup.object({
    coreTermsOfSale: Yup.object({
      price: Yup.number()
        .nullable()
        .required(validationMessage.required)
        .test({
          name: "valid_bigNumber",
          message: "Price is not valid",
          test: testPrice(config)
        }),
      currency: Yup.object({
        value: Yup.string(),
        label: Yup.string()
      }).required(validationMessage.required),
      quantity: Yup.number()
        .min(1, "Quantity must be greater than or equal to 1")
        .required(validationMessage.required),
      ...commonCoreTermsOfSaleValidationSchema
    })
  });
export type CoreTermsOfSaleValidationSchema = ReturnType<
  typeof getCoreTermsOfSaleValidationSchema
>;

export const variantsCoreTermsOfSaleValidationSchema = Yup.object({
  variantsCoreTermsOfSale: Yup.object({
    ...commonCoreTermsOfSaleValidationSchema
  })
});

export const termsOfExchangeValidationSchema = Yup.object({
  termsOfExchange: Yup.object({
    exchangePolicy: Yup.object({
      value: Yup.string(),
      label: Yup.string()
    }).required(validationMessage.required),
    buyerCancellationPenalty: Yup.string().required(validationMessage.required),
    buyerCancellationPenaltyUnit: Yup.object({
      value: Yup.string().oneOf(OPTIONS_UNIT.map(({ value }) => value)),
      label: Yup.string()
    }),
    sellerDeposit: Yup.string().required(validationMessage.required),
    sellerDepositUnit: Yup.object({
      value: Yup.string().required(validationMessage.required),
      label: Yup.string()
    }),
    disputeResolver: Yup.object({
      value: Yup.string().oneOf(
        OPTIONS_DISPUTE_RESOLVER.map(({ value }) => value)
      ),
      label: Yup.string()
    }),
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
      }),
    disputePeriodUnit: Yup.object({
      value: Yup.string().oneOf(OPTIONS_PERIOD.map(({ value }) => value)),
      label: Yup.string()
    })
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
    measurementUnit: Yup.object({
      value: Yup.string().oneOf(OPTIONS_LENGTH.map(({ value }) => value)),
      label: Yup.string()
    }).required(validationMessage.required),
    /* TODO: NOTE: we might add it back in the future */
    // country: Yup.object({
    //   value: Yup.string(),
    //   label: Yup.string()
    // }).default([{ value: "", label: "" }]),
    jurisdiction: Yup.array(
      Yup.object({
        region: Yup.string().required(validationMessage.required),
        time: Yup.string().required(validationMessage.required)
      })
    ).default([{ region: "", time: "" }]),
    returnPeriod: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .required(validationMessage.required)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .returnPeriodValue(),
    returnPeriodUnit: Yup.object({
      value: Yup.string().oneOf(OPTIONS_PERIOD.map(({ value }) => value)),
      label: Yup.string()
    })
  })
});

export const confirmProductDetailsSchema = Yup.object({
  confirmProductDetails: Yup.object({
    acceptsTerms: Yup.boolean().required(validationMessage.required)
  })
});
