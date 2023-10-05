import { subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import dayjs from "dayjs";
import { utils } from "ethers";
import { isTruthy } from "lib/types/helpers";
import { getDateTimestamp } from "lib/utils/getDateTimestamp";
import useProductByUuid, {
  ReturnUseProductByUuid
} from "lib/utils/hooks/product/useProductByUuid";
import { useCurrentSellers } from "lib/utils/hooks/useCurrentSellers";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import uniqBy from "lodash.uniqby";
import { getDisputePeriodDurationFromSubgraphInDays } from "pages/create-product/utils/helpers";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";

import {
  SellerHubQueryParameters,
  SellerLandingPageParameters
} from "../../../lib/routing/parameters";
import {
  clearLocalStorage,
  getItemFromStorage,
  removeItemInStorage,
  saveItemInStorage
} from "../../../lib/utils/hooks/useLocalStorage";
import {
  CATEGORY_OPTIONS,
  getOptionsCurrencies,
  IMAGE_SPECIFIC_OR_ALL_OPTIONS,
  ImageSpecificOrAll,
  OPTIONS_LENGTH,
  OPTIONS_UNIT,
  OPTIONS_WEIGHT,
  ProductMetadataAttributeKeys,
  ProductTypeValues,
  SUPPORTED_FILE_FORMATS,
  TOKEN_CRITERIA,
  TOKEN_TYPES,
  TokenTypeEnumToString,
  TypeKeys
} from "./const";
import { getVariantName } from "./getVariantName";
import { initialValues as baseValues } from "./initialValues";
import type { CreateProductForm } from "./types";

const MAIN_KEY = "create-product";
export function useInitialValues() {
  const core = useCoreSDK();

  const { sellers: currentSellers } = useCurrentSellers();
  const sellerId = currentSellers?.[0]?.id;
  const { config } = useConfigContext();
  const [searchParams] = useSearchParams();
  const isTokenGated = searchParams.get(
    SellerLandingPageParameters.sltokenGated
  );
  const fromProductUuid = searchParams.get(
    SellerHubQueryParameters.fromProductUuid
  );
  const cloneBaseValues = useMemo(
    () =>
      structuredClone({
        ...baseValues,
        coreTermsOfSale: {
          ...baseValues.coreTermsOfSale,
          currency: getOptionsCurrencies(config.envConfig)[0]
        }
      }),
    [config.envConfig]
  );
  const initialValues = useMemo(
    () => getItemFromStorage<CreateProductForm | null>(MAIN_KEY, null),
    []
  );

  const { data: product } = useProductByUuid("110", fromProductUuid, {
    enabled: !!fromProductUuid && !!sellerId
  });

  const OPTIONS_CURRENCIES = useMemo(
    () => getOptionsCurrencies(config.envConfig),
    [config.envConfig]
  );

  const conditionTokenAddress =
    product?.variants[0].offer.condition?.tokenAddress;
  const { data: tokenDecimals } = useQuery(
    ["token-info", conditionTokenAddress, core.uuid],
    async () => {
      if (!conditionTokenAddress) {
        return;
      }
      const tokenInfo = await core.getExchangeTokenInfo(conditionTokenAddress);
      if (!tokenInfo) {
        return;
      }
      const { decimals } = tokenInfo;
      return decimals;
    }
  );

  const valuesFromExistingProduct: CreateProductForm | null | undefined =
    useMemo(() => {
      return loadExistingProduct<typeof cloneBaseValues>(
        product,
        tokenDecimals,
        cloneBaseValues,
        OPTIONS_CURRENCIES
      );
    }, [product, cloneBaseValues, OPTIONS_CURRENCIES, tokenDecimals]);
  console.log({ product, valuesFromExistingProduct });
  const cloneInitialValues = useMemo(
    () =>
      initialValues
        ? structuredClone(initialValues)
        : ({} as Partial<NonNullable<typeof initialValues>>),
    [initialValues]
  );

  if (isTokenGated) {
    if (cloneBaseValues.productType) {
      cloneBaseValues.productType.tokenGatedOffer = "true";
    }
    if (cloneInitialValues.productType) {
      cloneInitialValues.productType.tokenGatedOffer = "true";
    }
  }

  return {
    shouldDisplayModal: cloneInitialValues !== null && !fromProductUuid,
    base: cloneBaseValues,
    draft: cloneInitialValues,
    fromProductUuid: valuesFromExistingProduct,
    remove: removeItemInStorage,
    save: saveItemInStorage,
    clear: clearLocalStorage,
    key: MAIN_KEY
  };
}
function loadExistingProduct<T extends CreateProductForm>(
  productWithVariants: ReturnUseProductByUuid,
  tokenDecimals: number | undefined,
  cloneBaseValues: T,
  OPTIONS_CURRENCIES: {
    value: string;
    label: string;
  }[]
): CreateProductForm | undefined | null {
  if (!productWithVariants) {
    return;
  }

  const { product, variants = [] } = productWithVariants;
  const [firstOfferAndVariations] = variants;
  const { offer: firstOffer } = firstOfferAndVariations;
  const firstOfferMetadata = firstOffer.metadata as
    | subgraph.ProductV1MetadataEntity
    | undefined;
  const hasVariantSpecificImages = variants.some((variant) => {
    return (
      variant.offer.metadata &&
      "productOverrides" in variant.offer.metadata &&
      !!variant.offer.metadata.productOverrides?.visuals_images.length
    );
  });
  const productAnimation = firstOffer.metadata?.animationUrl
    ? [
        {
          src: firstOffer.metadata?.animationUrl
        }
      ]
    : undefined;
  const getProductImages = () => {
    const buildGetNextImg = () => {
      let index = 0;
      return () => {
        const visualImages = product.visuals_images;
        if (!visualImages) {
          return [];
        }
        const image = visualImages[index++];
        if (!image) {
          return [];
        }
        return [
          {
            src: image.url,
            type: SUPPORTED_FILE_FORMATS[0]
          }
        ];
      };
    };
    const getNextImg = buildGetNextImg();
    return hasVariantSpecificImages
      ? cloneBaseValues.productImages
      : {
          thumbnail: getNextImg(),
          secondary: getNextImg(),
          everyAngle: getNextImg(),
          details: getNextImg(),
          inUse: getNextImg(),
          styledScene: getNextImg(),
          sizeAndScale: getNextImg(),
          more: getNextImg()
        };
  };
  const tokenType =
    TOKEN_TYPES.find(
      (tokenType) =>
        tokenType.value ===
        TokenTypeEnumToString[
          firstOffer.condition?.tokenType as keyof typeof TokenTypeEnumToString
        ]
    ) ?? cloneBaseValues.tokenGating.tokenType;
  const getMinBalance = () => {
    if (
      !firstOffer.condition ||
      !tokenDecimals ||
      !firstOffer.condition.threshold
    ) {
      return cloneBaseValues.tokenGating.minBalance;
    }
    if (tokenType.value !== "erc20") {
      return firstOffer.condition.threshold;
    }
    try {
      const formatted = utils.formatUnits(
        firstOffer.condition.threshold,
        tokenDecimals
      );
      return Number(formatted).toString();
    } catch (error) {
      return cloneBaseValues.tokenGating.minBalance;
    }
  };

  return {
    ...cloneBaseValues,
    createYourProfile: cloneBaseValues.createYourProfile,
    productType: {
      ...cloneBaseValues.productType,
      productType: product.details_offerCategory.toLowerCase(),
      productVariant:
        variants.length > 1
          ? ProductTypeValues.differentVariants
          : ProductTypeValues.oneItemType,
      tokenGatedOffer: firstOffer.condition ? "true" : "false"
    },
    productInformation: {
      ...cloneBaseValues.productInformation,
      productTitle: product.title ?? "",
      description: product.description ?? "",
      category:
        CATEGORY_OPTIONS.find(
          (categoryOption) =>
            categoryOption.value ===
            (product.details_category ?? product.category?.name)
        ) ?? product.category,
      tags: product.details_tags ?? [],
      attributes:
        firstOfferMetadata?.attributes
          ?.filter(
            // filter out our attributes
            (attribute) =>
              !ProductMetadataAttributeKeys[
                attribute.traitType as keyof typeof ProductMetadataAttributeKeys
              ]
          )
          .map((attribute) => ({
            name: attribute.traitType,
            value: attribute.value ?? ""
          })) ?? [],
      sku: product.identification_sKU ?? "",
      id: product.identification_productId ?? "",
      idType: product.identification_productIdType ?? "",
      brandName: product.productionInformation_brandName ?? "",
      manufacture: product.productionInformation_manufacturer ?? "",
      manufactureModelName:
        product.productionInformation_manufacturerPartNumber ?? "",
      partNumber: product.productionInformation_modelNumber ?? "",
      materials: product.productionInformation_materials?.length
        ? product.productionInformation_materials?.join(",")
        : ""
    },
    productVariants: {
      ...cloneBaseValues.productVariants,
      colors:
        uniqBy(
          variants
            .flatMap((variant) =>
              variant.variations
                .filter((variation) => variation.type === TypeKeys.Color)
                .map((variation) => variation.option)
                .filter((option) => option && option !== "-")
            )
            .filter(isTruthy),
          (string) => string
        ) ?? [],
      sizes:
        uniqBy(
          variants
            .flatMap((variant) =>
              variant.variations
                .filter((variation) => variation.type === TypeKeys.Size)
                .map((variation) => variation.option)
                .filter((option) => option && option !== "-")
            )
            .filter(isTruthy),
          (string) => string
        ) ?? [],
      variants: variants
        .filter(({ variations }) => !!variations.length)
        .map(({ offer, variations }) => {
          const colorVariation = variations.find(
            (variation) => variation.type.toLowerCase() === "color"
          );
          const sizeVariation = variations.find(
            (variation) => variation.type.toLowerCase() === "size"
          );
          return {
            name: getVariantName({
              color: colorVariation?.option,
              size: sizeVariation?.option
            }),
            price: utils.formatUnits(offer.price, offer.exchangeToken.decimals),
            currency: OPTIONS_CURRENCIES.find(
              (currency) => currency.value === offer.exchangeToken.symbol
            ),
            quantity: offer.quantityInitial,
            color: colorVariation?.option,
            size: sizeVariation?.option
          };
        })
    },
    productVariantsImages: hasVariantSpecificImages
      ? variants
          .filter(({ variations }) => !!variations.length)
          .map((variant) => {
            const variantImages =
              variant.offer.metadata &&
              "productOverrides" in variant.offer.metadata &&
              variant.offer.metadata.productOverrides?.visuals_images;
            const buildGetImg = () => {
              let index = 0;
              return () => {
                if (!variantImages) {
                  return [];
                }
                const image = variantImages[index++];
                if (!image) {
                  return [];
                }
                return [
                  {
                    src: image.url,
                    type: SUPPORTED_FILE_FORMATS[0]
                  }
                ];
              };
            };
            const getImg = buildGetImg();
            return {
              productAnimation,
              productImages: {
                thumbnail: getImg(),
                secondary: getImg(),
                everyAngle: getImg(),
                details: getImg(),
                inUse: getImg(),
                styledScene: getImg(),
                sizeAndScale: getImg(),
                more: getImg()
              }
            };
          })
      : cloneBaseValues.productVariantsImages ?? [],
    imagesSpecificOrAll:
      IMAGE_SPECIFIC_OR_ALL_OPTIONS.find((option) =>
        hasVariantSpecificImages
          ? option.value === ImageSpecificOrAll.specific
          : option.value === ImageSpecificOrAll.all
      ) ?? cloneBaseValues.imagesSpecificOrAll,
    productImages: getProductImages() ?? cloneBaseValues.productImages,
    productAnimation,
    variantsCoreTermsOfSale: {
      ...cloneBaseValues.variantsCoreTermsOfSale,
      offerValidityPeriod: [
        dayjs(getDateTimestamp(firstOffer.validFromDate)),
        dayjs(getDateTimestamp(firstOffer.validUntilDate))
      ],
      redemptionPeriod: [
        dayjs(getDateTimestamp(firstOffer.voucherRedeemableFromDate)),
        dayjs(getDateTimestamp(firstOffer.voucherRedeemableUntilDate))
      ]
    },
    coreTermsOfSale: {
      ...cloneBaseValues.coreTermsOfSale,
      offerValidityPeriod: [
        dayjs(getDateTimestamp(firstOffer.validFromDate)),
        dayjs(getDateTimestamp(firstOffer.validUntilDate))
      ],
      redemptionPeriod: [
        dayjs(getDateTimestamp(firstOffer.voucherRedeemableFromDate)),
        dayjs(getDateTimestamp(firstOffer.voucherRedeemableUntilDate))
      ],
      currency: {
        value: OPTIONS_CURRENCIES.find(
          (currency) => currency.value === firstOffer.exchangeToken.symbol
        )?.value,
        label: OPTIONS_CURRENCIES.find(
          (currency) => currency.value === firstOffer.exchangeToken.symbol
        )?.label
      },
      price: utils.formatUnits(
        firstOffer.price,
        firstOffer.exchangeToken.decimals
      ),
      quantity: firstOffer.quantityInitial
    },
    termsOfExchange: {
      ...cloneBaseValues.termsOfExchange,
      exchangePolicy: cloneBaseValues.termsOfExchange.exchangePolicy, // default exchange policy
      buyerCancellationPenalty: utils.formatUnits(
        firstOffer.buyerCancelPenalty,
        firstOffer.exchangeToken.decimals
      ),
      buyerCancellationPenaltyUnit: {
        value: OPTIONS_UNIT.find((option) => option.value === "fixed")?.value,
        label: firstOffer.exchangeToken.symbol
      },
      sellerDeposit: utils.formatUnits(
        firstOffer.sellerDeposit,
        firstOffer.exchangeToken.decimals
      ),
      sellerDepositUnit: {
        value: OPTIONS_UNIT.find((option) => option.value === "fixed")?.value,
        label: firstOffer.exchangeToken.symbol
      },
      disputeResolver: cloneBaseValues.termsOfExchange.disputeResolver, // even if dispute resolver in the offer is different from redeemeum, it will be set to redeemeum
      disputePeriod: getDisputePeriodDurationFromSubgraphInDays(
        firstOffer.disputePeriodDuration
      ),
      disputePeriodUnit: cloneBaseValues.termsOfExchange.disputePeriodUnit
    },
    shippingInfo: {
      ...cloneBaseValues.shippingInfo,
      jurisdiction:
        firstOfferMetadata?.shipping?.supportedJurisdictions?.map(
          ({ label, deliveryTime }) => ({
            region: label,
            time: deliveryTime
          })
        ) ?? cloneBaseValues.shippingInfo.jurisdiction,
      returnPeriod:
        firstOfferMetadata?.shipping?.returnPeriodInDays ??
        cloneBaseValues.shippingInfo.returnPeriod,
      returnPeriodUnit: cloneBaseValues.shippingInfo.returnPeriodUnit, // saved in days
      redemptionPointUrl:
        firstOfferMetadata?.attributes?.find(
          (attribute) =>
            attribute.traitType.toLowerCase() ===
            ProductMetadataAttributeKeys["Redeemable At"].toLowerCase()
        )?.value ??
        firstOfferMetadata?.shipping?.redemptionPoint ??
        cloneBaseValues.shippingInfo.redemptionPointUrl,
      redemptionPointName: cloneBaseValues.shippingInfo.redemptionPointName, // not saved
      weight:
        product?.packaging_weight_value ?? cloneBaseValues.shippingInfo.weight,
      weightUnit: product?.packaging_weight_unit
        ? OPTIONS_WEIGHT.find(
            (weightOption) =>
              weightOption.value === product.packaging_weight_unit
          ) ?? cloneBaseValues.shippingInfo.weightUnit
        : cloneBaseValues.shippingInfo.weightUnit,
      measurementUnit: product?.packaging_dimensions_unit
        ? OPTIONS_LENGTH.find(
            (option) => option.value === product.packaging_dimensions_unit
          ) ?? cloneBaseValues.shippingInfo.measurementUnit
        : cloneBaseValues.shippingInfo.measurementUnit,
      height:
        product?.packaging_dimensions_height ??
        cloneBaseValues.shippingInfo.height,
      width:
        product?.packaging_dimensions_width ??
        cloneBaseValues.shippingInfo.width,
      length:
        product?.packaging_dimensions_length ??
        cloneBaseValues.shippingInfo.length
    },
    confirmProductDetails: {
      ...cloneBaseValues.confirmProductDetails
    },
    tokenGating: {
      ...cloneBaseValues.tokenGating,
      ...(firstOffer.condition && {
        maxCommits:
          firstOffer.condition.maxCommits ??
          cloneBaseValues.tokenGating.maxCommits,
        minBalance: getMinBalance(),
        tokenContract:
          firstOffer.condition.tokenAddress ??
          cloneBaseValues.tokenGating.tokenContract,
        tokenCriteria:
          TOKEN_CRITERIA.find(
            (criterion) => criterion.method === firstOffer.condition?.method
          ) ?? cloneBaseValues.tokenGating.tokenCriteria,
        tokenId:
          firstOffer.condition.minTokenId ??
          cloneBaseValues.tokenGating.tokenId,
        tokenType
      })
    }
  };
}
