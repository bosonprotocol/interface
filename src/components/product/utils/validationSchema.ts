import { CoreSDK, digitalTypeMapping } from "@bosonprotocol/react-kit";
import { parseUnits } from "@ethersproject/units";
import {
  maxLengthErrorMessage,
  METADATA_LENGTH_LIMIT
} from "components/modal/components/Profile/const";
import { Dayjs } from "dayjs";
import { ethers } from "ethers";
import { checkValidUrl, notUrlErrorMessage } from "lib/validation/regex/url";
import { AnyObject, ValidationError } from "yup";

import { validationMessage } from "../../../lib/constants/validationMessage";
import { fixformattedString } from "../../../lib/utils/number";
import Yup from "../../../lib/validation/index";
import { Token } from "../../convertion-rate/ConvertionRateContext";
import { FileProps } from "../../form/Upload/types";
import { getCommonFieldsValidation } from "../../modal/components/Profile/validationSchema";
import {
  DigitalFile,
  ExistingNFT,
  Experiential,
  getIsBundleItem,
  NewNFT
} from "../productDigital/getIsBundleItem";
import { CONFIG, DappConfig } from "./../../../lib/config";
import { SelectDataProps } from "./../../form/types";
import {
  BUYER_TRANSFER_INFO_OPTIONS,
  DIGITAL_NFT_TYPE,
  DIGITAL_TYPE,
  isNftMintedAlreadyOptions,
  NFT_TOKEN_TYPES,
  OPTIONS_DISPUTE_RESOLVER,
  OPTIONS_EXCHANGE_POLICY,
  OPTIONS_LENGTH,
  OPTIONS_PERIOD,
  OPTIONS_UNIT,
  ProductTypeTypeValues,
  ProductTypeVariantsValues,
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
      FileProps & { fit?: string | null; position?: string | null }
    >(),
    ...getCommonFieldsValidation({ withMaxLengthValidation: false })
  })
});

export const productTypeValidationSchema = Yup.object({
  productType: Yup.object({
    productType: Yup.string()
      .min(1)
      .oneOf([ProductTypeTypeValues.physical, ProductTypeTypeValues.phygital])
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
const arrayOfMedia = {
  bundleItemsMedia: Yup.array(
    Yup.object({
      image: validationOfIpfsImage(),
      video: validationOfIpfsImage()
    })
  )
};
type ArrayOfMedia = typeof arrayOfMedia;
const getBundleItemsMedia = ({
  isPhygital
}: {
  isPhygital: boolean;
}): ArrayOfMedia => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  bundleItemsMedia: Yup.array(
    Yup.object({
      image: validationOfIpfsImage(),
      video: validationOfIpfsImage()
    }).nullable()
  ).test(
    "invalidBundleItemsMedia",
    "Please add an image for new NFTs",
    async function (bundleItemsMedia, context) {
      if (isPhygital) {
        const productDigital =
          context.parent.productDigital ??
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          context.options?.from?.find((from) => from.value.productDigital)
            ?.value?.productDigital;

        const results = await Promise.allSettled(
          bundleItemsMedia?.map(async (bundleItemMedia, index) => {
            const bundleItem = productDigital.bundleItems[index];
            if (!bundleItem) {
              throw new Error(
                `something went wrong as bundleItem could not be found from bundleItemMedia=${JSON.stringify(bundleItemMedia)}, all bundleItems=${JSON.stringify(productDigital.bundleItems)}, index=${index}`
              );
            }
            if (
              getIsBundleItem<ExistingNFT>(
                bundleItem,
                "mintedNftContractAddress"
              )
            ) {
              return; // nothing to test, no images must be uploaded
            }
            if (getIsBundleItem<NewNFT>(bundleItem, "newNftName")) {
              const isValid = await Yup.object({
                image: validationOfRequiredIpfsImage(),
                video: validationOfIpfsImage()
              }).validate(bundleItemMedia);
              return isValid;
            }
            if (
              getIsBundleItem<DigitalFile>(bundleItem, "digitalFileName") ||
              getIsBundleItem<Experiential>(bundleItem, "experientialName")
            ) {
              const isValid = await Yup.object({
                image: validationOfIpfsImage(),
                video: validationOfIpfsImage()
              }).validate(bundleItemMedia);
              return isValid;
            }
          }) || []
        );

        results.forEach((result, index) => {
          if (
            result.status === "rejected" &&
            result.reason instanceof ValidationError
          ) {
            const thrownError = result.reason;
            const e = context.createError({
              path: `${this.path}[${index}].${thrownError.path}`,
              message: thrownError.message
            });
            throw e;
          } else if (result.status === "rejected") {
            const thrownError = result.reason;
            const e = context.createError({
              path: `${this.path}[${index}]`,
              message: thrownError.message
            });
            throw e;
          }
        });
      }

      return true;
    }
  ) as unknown as ArrayOfMedia
});

const getProductAnimation = () => ({
  productAnimation: validationOfIpfsImage()
});

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

const getSinglePhysicalProductImagesValidationSchema = () => ({
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
  ...getProductAnimation()
});
export const getProductImagesValidationSchema = ({
  isPhygital
}: {
  isPhygital: boolean;
}) =>
  Yup.object({
    ...getSinglePhysicalProductImagesValidationSchema(),
    ...getBundleItemsMedia({ isPhygital })
  });
export type ProductImagesValidationSchema = ReturnType<
  typeof getProductImagesValidationSchema
>;

export const getProductVariantsImagesValidationSchema = ({
  isPhygital
}: {
  isPhygital: boolean;
}) =>
  Yup.object({
    ...getBundleItemsMedia({ isPhygital }),
    productVariantsImages: Yup.array(
      Yup.object({
        ...getSinglePhysicalProductImagesValidationSchema()
      })
    ).test({
      name: "minLength",
      test: function (value) {
        return value?.length === this.parent.productVariants?.variants.length;
      }
    })
  });
export type ProductVariantsImagesValidationSchema = ReturnType<
  typeof getProductVariantsImagesValidationSchema
>;

export const imagesSpecificOrAllValidationSchema = Yup.object({
  imagesSpecificOrAll: Yup.object({
    label: Yup.string().required(validationMessage.required),
    value: Yup.string()
      .oneOf(["all", "specific"])
      .required(validationMessage.required)
  }).nullable()
});

const getBundleGeneralInfo = ({ isPhygital }: { isPhygital: boolean }) => ({
  bundleName: isPhygital
    ? Yup.string().required(validationMessage.required)
    : Yup.string(),
  bundleDescription: isPhygital
    ? Yup.string().required(validationMessage.required)
    : Yup.string()
});
export type ProductInformationValidationSchema = ReturnType<
  typeof getProductInformationValidationSchema
>;
export const getProductInformationValidationSchema = ({
  isPhygital
}: {
  isPhygital: boolean;
}) =>
  Yup.object({
    productInformation: Yup.object({
      ...getBundleGeneralInfo({ isPhygital }),
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
const transferCriteria = Yup.string().required(validationMessage.required);
const transferTime = Yup.number()
  .min(0, "It cannot be negative")
  .required(validationMessage.required)
  .nullable();
const transferTimeUnit = Yup.object({
  value: Yup.string(),
  label: Yup.string()
}).required(validationMessage.required);
const buyerTransferInfo = Yup.object({
  value: Yup.string().test("validBuyerTransferInfo", (value) => {
    return (
      !!value &&
      !!BUYER_TRANSFER_INFO_OPTIONS.find((option) => option.value === value)
    );
  }),
  label: Yup.string()
})
  .required(validationMessage.required)
  .nullable();
const testTokenAddress = async function ({
  tokenType,
  coreSDK,
  tokenContract,
  this: that
}: {
  tokenType: { value: string | undefined; label: string | undefined } | null;
  coreSDK: CoreSDK;
  tokenContract: string | undefined;
  this: Yup.TestContext<AnyObject>;
}) {
  if (
    tokenType?.value &&
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
      throw that.createError({
        path: that.path,
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
                erc1155Supported = await coreSDK.erc165SupportsInterface({
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
            const erc721Supported = await coreSDK.erc165SupportsInterface({
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
            const erc1155Supported = await coreSDK.erc165SupportsInterface({
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
};
const commonFieldsBundleItem = {
  type: Yup.object({
    value: Yup.string()
      .oneOf(DIGITAL_TYPE.map(({ value }) => value))
      .required(validationMessage.required),
    label: Yup.string()
  })
    .required(validationMessage.required)
    .nullable()
    .default(undefined),
  isNftMintedAlready: Yup.object({
    value: Yup.string().oneOf(
      isNftMintedAlreadyOptions.map(({ value }) => value)
    ),
    label: Yup.string()
  })
    .when("type", {
      is: (type: (typeof DIGITAL_TYPE)[number] | null) => {
        return type?.value === digitalTypeMapping["digital-nft"];
      },
      then: (schema) => schema.required(validationMessage.required),
      otherwise: (schema) => schema
    })
    .default(undefined)
    .nullable()
};
const nftType = Yup.object({
  value: Yup.string()
    .oneOf(DIGITAL_NFT_TYPE.map(({ value }) => value))
    .required(validationMessage.required),
  label: Yup.string()
})
  .required(validationMessage.required)
  .nullable();
const getExistingNftSchema = ({ coreSDK }: { coreSDK: CoreSDK }) =>
  Yup.object({
    ...commonFieldsBundleItem,
    mintedNftType: nftType,
    mintedNftTokenType: Yup.object({
      value: Yup.string().test("validTokenType", (value) => {
        return (
          !!value && !!NFT_TOKEN_TYPES.find((option) => option.value === value)
        );
      }),
      label: Yup.string()
    })
      .required(validationMessage.required)
      .nullable()
      .default([{ value: "", label: "" }]),
    mintedNftContractAddress: Yup.string()
      .required(validationMessage.required)
      .test("FORMAT", "Must be a valid address", (value) =>
        value ? ethers.utils.isAddress(value) : true
      )
      .test("wrongTokenAddress", async function (tokenContract) {
        return await testTokenAddress({
          this: this,
          coreSDK,
          tokenType: this.parent.mintedNftTokenType,
          tokenContract
        });
      }),
    mintedNftTokenIdRangeMin: Yup.number()
      .required(validationMessage.required)
      .min(1, "It should be at least 1"),
    mintedNftTokenIdRangeMax: Yup.number()
      .required(validationMessage.required)
      .min(1, "It should be at least 1")
      .test({
        message: 'It should be greater than or equal to "Min token ID"',
        test: (value, context) => {
          if (value && value < context.parent.mintedNftTokenIdRangeMin) {
            return false;
          }
          return true;
        }
      }),
    mintedNftExternalUrl: Yup.string().test(
      "FORMAT",
      notUrlErrorMessage,
      (value) => {
        return value ? checkValidUrl(value) : true;
      }
    ),
    mintedNftTransferTime: transferTime,
    mintedNftTransferTimeUnit: transferTimeUnit,
    mintedNftTransferCriteria: transferCriteria,
    mintedNftBuyerTransferInfo: buyerTransferInfo
  });
const newNftSchema = Yup.object({
  ...commonFieldsBundleItem,
  newNftType: nftType,
  newNftName: Yup.string().required(validationMessage.required),
  newNftDescription: Yup.string().required(validationMessage.required),
  newNftTransferTime: transferTime,
  newNftTransferTimeUnit: transferTimeUnit,
  newNftTransferCriteria: transferCriteria,
  newNftBuyerTransferInfo: buyerTransferInfo
});
const digitalFileSchema = Yup.object({
  ...commonFieldsBundleItem,
  digitalFileName: Yup.string().required(validationMessage.required),
  digitalFileDescription: Yup.string().required(validationMessage.required),
  digitalFileFormat: Yup.string().required(validationMessage.required),
  digitalFileTransferCriteria: transferCriteria,
  digitalFileTransferTime: transferTime,
  digitalFileTransferTimeUnit: transferTimeUnit,
  digitalFileBuyerTransferInfo: buyerTransferInfo
});
const experientialSchema = Yup.object({
  ...commonFieldsBundleItem,
  experientialName: Yup.string().required(validationMessage.required),
  experientialDescription: Yup.string().required(validationMessage.required),
  experientialTransferTime: transferTime.required(validationMessage.required),
  experientialTransferTimeUnit: transferTimeUnit,
  experientialTransferCriteria: transferCriteria,
  experientialBuyerTransferInfo: buyerTransferInfo
});
export type NewNftBundleItemsType = Yup.InferType<typeof newNftSchema>;
export type MintedNftBundleItemsType = Yup.InferType<
  ReturnType<typeof getExistingNftSchema>
>;
export type DigitalFileBundleItemsType = Yup.InferType<
  typeof digitalFileSchema
>;
export type ExperientialBundleItemsType = Yup.InferType<
  typeof experientialSchema
>;

export const getProductDigitalValidationSchema = ({
  coreSDK
}: {
  coreSDK: CoreSDK;
}) =>
  Yup.object({
    productDigital: Yup.object({
      bundleItems: Yup.mixed<
        (
          | MintedNftBundleItemsType
          | NewNftBundleItemsType
          | DigitalFileBundleItemsType
          | ExperientialBundleItemsType
        )[]
      >()
        .default(undefined)
        .required(validationMessage.required)
        .test("wrongBundleItems", async function (bundleItems, context) {
          if (!bundleItems) {
            throw this.createError({
              path: this.path,
              message: "No items"
            });
          }
          if (Array.isArray(bundleItems) && !bundleItems.length) {
            throw this.createError({
              path: this.path,
              message: "There should be at least one item"
            });
          }

          const results = await Promise.allSettled(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (bundleItems as any).map(async (bundleItem: unknown) => {
              if (
                getIsBundleItem<ExistingNFT>(
                  bundleItem,
                  "mintedNftContractAddress"
                )
              ) {
                const existingNftValid = await getExistingNftSchema({
                  coreSDK
                }).validate(bundleItem);
                return !existingNftValid;
              }
              if (getIsBundleItem<NewNFT>(bundleItem, "newNftName")) {
                const newNftValid = newNftSchema.validateSync(bundleItem);
                return !newNftValid;
              }
              if (getIsBundleItem<DigitalFile>(bundleItem, "digitalFileName")) {
                const digitalFileValid =
                  digitalFileSchema.validateSync(bundleItem);
                return !digitalFileValid;
              }
              if (
                getIsBundleItem<Experiential>(bundleItem, "experientialName")
              ) {
                const experienceValid =
                  experientialSchema.validateSync(bundleItem);
                return !experienceValid;
              }
              return false;
            })
          );
          results.forEach((result, index) => {
            if (
              result.status === "rejected" &&
              result.reason instanceof ValidationError
            ) {
              const thrownError = result.reason;
              const e = context.createError({
                path: `${this.path}[${index}].${thrownError.path}`,
                message: thrownError.message
              });
              throw e;
            } else if (result.status === "rejected") {
              const thrownError = result.reason;
              const e = context.createError({
                path: `${this.path}[${index}]`,
                message: thrownError.message
              });
              throw e;
            }
          });

          return true;
        })
    })
  });
export type ProductDigital = Yup.InferType<
  ReturnType<typeof getProductDigitalValidationSchema>
>;
export const commonCoreTermsOfSaleValidationSchema = {
  infiniteExpirationOffers: Yup.boolean(),
  offerValidityPeriod: Yup.mixed<Dayjs | Dayjs[]>()
    .when("infiniteExpirationOffers", {
      is: true,
      then: (schema) =>
        schema
          .required(validationMessage.required)
          .defined(validationMessage.required),
      otherwise: (schema) =>
        schema
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
      then: (schema) => schema.optional(),
      // .required(validationMessage.required)
      // .defined(validationMessage.required),
      otherwise: (schema) =>
        schema
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
        .min(1, "It has to be 1 at least");
    },
    otherwise: (schema) => schema.min(0, "It must be 0").max(0, "It must be 0")
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
          return await testTokenAddress({
            coreSDK,
            tokenType: this.parent.tokenType,
            tokenContract,
            this: this
          });
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
              ProductTypeVariantsValues.oneItemType;
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
        value: Yup.string()
          .required(validationMessage.required)
          .test("validTokenType", (value) => {
            return (
              !!value && !!TOKEN_TYPES.find((option) => option.value === value)
            );
          }),
        label: Yup.string()
      })

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
        region: Yup.string().test({
          message: "Region is required if time is defined",
          test: function (value, context) {
            const { time } = context.parent;
            return !(!value && time);
          }
        }),
        time: Yup.string().test({
          message: "Time is required if region is defined",
          test: function (value, context) {
            const { region } = context.parent;
            return !(!value && region);
          }
        })
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
