import {
  digitalTypeMapping,
  hooks,
  isBundle,
  isNftItem,
  NftItem,
  subgraph
} from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import dayjs from "dayjs";
import { utils } from "ethers";
import { isTruthy } from "lib/types/helpers";
import { getProductV1BundleItemsFilter } from "lib/utils/bundle/filter";
import { getDateTimestamp } from "lib/utils/getDateTimestamp";
import { useCurrentSellers } from "lib/utils/hooks/useCurrentSellers";
import { didReleaseVersionChange } from "lib/utils/release";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import uniqBy from "lodash.uniqby";
import { getDisputePeriodDurationFromSubgraphInDays } from "pages/create-product/utils/helpers";
import { VariantV1 } from "pages/products/types";
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
} from "../../../lib/utils/hooks/localstorage/useLocalStorage";
import {
  DigitalFile,
  ExistingNFT,
  Experiential,
  NewNFT
} from "../productDigital/getIsBundleItem";
import {
  BUYER_TRANSFER_INFO_OPTIONS,
  CATEGORY_OPTIONS,
  DIGITAL_NFT_TYPE,
  DIGITAL_TYPE,
  digitalFileInfo,
  experientialInfo,
  getDigitalTypeOption,
  getIsMintedAlreadyOption,
  getOptionsCurrencies,
  IMAGE_SPECIFIC_OR_ALL_OPTIONS,
  ImageSpecificOrAll,
  mintedNftInfo,
  newNftInfo,
  NFT_TOKEN_TYPES,
  OPTIONS_LENGTH,
  OPTIONS_PERIOD,
  OPTIONS_UNIT,
  OPTIONS_WEIGHT,
  ProductMetadataAttributeKeys,
  ProductTypeVariantsValues,
  SUPPORTED_FILE_FORMATS,
  TOKEN_CRITERIA,
  TOKEN_TYPES,
  TokenTypeEnumToString,
  TypeKeys
} from "./const";
import { getVariantName } from "./getVariantName";
import { initialValues as baseValues } from "./initialValues";
import type { CreateProductForm, ProductImages } from "./types";

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
  const fromBundleUuid = searchParams.get(
    SellerHubQueryParameters.fromBundleUuid
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
  const initialValues = useMemo(() => {
    const savedProduct = getItemFromStorage<CreateProductForm | null>(
      MAIN_KEY,
      null
    );
    if (didReleaseVersionChange()) {
      return null;
    }
    return savedProduct;
  }, []);
  const enableUseProductByUuid = !!fromProductUuid && !!sellerId;
  const { data: product } = hooks.useProductByUuid(
    sellerId,
    fromProductUuid,
    core,
    {
      enabled: enableUseProductByUuid
    }
  );

  const { data: bundles } = hooks.useBundleByUuid(
    sellerId,
    fromBundleUuid,
    core,
    {
      enabled: !!fromBundleUuid && !!sellerId && !enableUseProductByUuid
    }
  );

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
  const valuesFromExistingBundle: CreateProductForm | null | undefined =
    useMemo(() => {
      let product: subgraph.ProductV1Product | undefined;
      const variantsWithV1: VariantV1[] | undefined = bundles
        ?.filter((bundle) => bundle.bundleUuid === fromBundleUuid)
        ?.flatMap((bundle) => {
          const bundleItems = bundle.items;
          const productV1Items = bundleItems
            ? getProductV1BundleItemsFilter(bundleItems)
            : undefined;
          if (!productV1Items) {
            return null;
          }
          if (!product) {
            product = productV1Items[0].product as subgraph.ProductV1Product;
          }
          return productV1Items.map(
            (productV1Item) =>
              ({
                variations: productV1Item.variations,
                offer: bundle.offer
              }) as VariantV1
          );
        })
        .filter(isTruthy);
      return loadExistingProduct<typeof cloneBaseValues>(
        { variants: variantsWithV1, product },
        tokenDecimals,
        cloneBaseValues,
        OPTIONS_CURRENCIES
      );
    }, [
      bundles,
      tokenDecimals,
      cloneBaseValues,
      OPTIONS_CURRENCIES,
      fromBundleUuid
    ]);
  const cloneInitialValues = useMemo(
    () => (initialValues ? structuredClone(initialValues) : null),
    [initialValues]
  );

  if (isTokenGated) {
    if (cloneBaseValues.productType) {
      cloneBaseValues.productType.tokenGatedOffer = "true";
    }
    if (cloneInitialValues?.productType) {
      cloneInitialValues.productType.tokenGatedOffer = "true";
    }
  }

  return {
    shouldDisplayModal:
      cloneInitialValues !== null && !fromProductUuid && !fromBundleUuid,
    base: cloneBaseValues,
    draft: cloneInitialValues,
    fromProductUuid: valuesFromExistingProduct,
    fromBundleUuid: valuesFromExistingBundle,
    remove: removeItemInStorage,
    save: saveItemInStorage,
    clear: clearLocalStorage,
    key: MAIN_KEY
  } as const;
}
function loadExistingProduct<T extends CreateProductForm>(
  productWithVariants:
    | hooks.ReturnUseProductByUuid
    | {
        product: subgraph.ProductV1Product | undefined;
        variants: VariantV1[] | undefined;
      },
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

  const { product, variants: vars = [] } = productWithVariants;
  if (!product) {
    return;
  }
  const variants = vars || [];
  const [firstOfferAndVariations] = variants;
  const { offer: firstOffer } = firstOfferAndVariations;
  const firstOfferMetadata = firstOffer.metadata as
    | subgraph.ProductV1MetadataEntity
    | undefined;
  const hasVariantSpecificImages = (variants || []).some((variant) => {
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
  const bundleItemsMedia: ProductImages["bundleItemsMedia"] | undefined =
    isBundle(firstOffer)
      ? firstOffer.metadata.items.filter(isNftItem).map((item) => {
          return {
            image: item.image
              ? [{ src: item.image, type: SUPPORTED_FILE_FORMATS[0] }]
              : undefined,
            video: item.animationUrl
              ? [{ src: item.animationUrl, type: "video/mp4" }]
              : undefined
          };
        })
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
  const infiniteExpirationOffers = firstOffer.voucherValidDuration !== "0";
  const commonCoreTermsOfSale = {
    infiniteExpirationOffers,
    ...(infiniteExpirationOffers
      ? {
          voucherValidDurationInDays:
            Number(firstOffer.voucherValidDuration) / 86400,
          redemptionPeriod:
            firstOffer.voucherRedeemableFromDate === "0"
              ? undefined
              : dayjs(getDateTimestamp(firstOffer.voucherRedeemableFromDate)),
          offerValidityPeriod: dayjs(getDateTimestamp(firstOffer.validFromDate))
        }
      : {
          offerValidityPeriod: [
            dayjs(getDateTimestamp(firstOffer.validFromDate)),
            dayjs(getDateTimestamp(firstOffer.validUntilDate))
          ],
          redemptionPeriod: [
            dayjs(getDateTimestamp(firstOffer.voucherRedeemableFromDate)),
            dayjs(getDateTimestamp(firstOffer.voucherRedeemableUntilDate))
          ]
        })
  } as const;
  return {
    ...cloneBaseValues,
    createYourProfile: cloneBaseValues.createYourProfile,
    productType: {
      ...cloneBaseValues.productType,
      productType: product.details_offerCategory.toLowerCase(),
      productVariant:
        variants.length > 1
          ? ProductTypeVariantsValues.differentVariants
          : ProductTypeVariantsValues.oneItemType,
      tokenGatedOffer: firstOffer.condition ? "true" : "false"
    },
    productInformation: {
      ...cloneBaseValues.productInformation,
      bundleName: isBundle(firstOffer) ? firstOffer.metadata.name : undefined,
      bundleDescription: isBundle(firstOffer)
        ? firstOffer.metadata.description
        : undefined,
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
    productDigital: isBundle(firstOffer)
      ? (() => {
          return {
            ...cloneBaseValues.productDigital,
            bundleItems: firstOffer.metadata.items
              .filter((item): item is NftItem => isNftItem(item))
              .map((nftItem) => {
                const type = nftItem.attributes?.find(
                  (attribute) => attribute.traitType === "type"
                )?.value;
                if (type === digitalTypeMapping["digital-nft"]) {
                  if (nftItem.contract) {
                    const transferTime =
                      nftItem.terms?.find(
                        (term) =>
                          term.key === mintedNftInfo.mintedNftTransferTime.key
                      )?.value ?? "";
                    const tokenTypeValue =
                      nftItem.terms?.find(
                        (term) =>
                          term.key === mintedNftInfo.mintedNftTokenType.key
                      )?.value ?? "";
                    const nftType =
                      nftItem.terms?.find(
                        (term) => term.key === mintedNftInfo.mintedNftType.key
                      )?.value ?? "";
                    const buyerTransferInfo =
                      nftItem.terms?.find(
                        (term) =>
                          term.key ===
                          mintedNftInfo.mintedNftBuyerTransferInfo.normalizedKey
                      )?.value ?? "";
                    const existingNft: ExistingNFT = {
                      type:
                        getDigitalTypeOption("digital-nft") || DIGITAL_TYPE[0],
                      isNftMintedAlready:
                        getIsMintedAlreadyOption("true") || null,
                      mintedNftType:
                        DIGITAL_NFT_TYPE.find(
                          (tokenType) => tokenType.value === nftType
                        ) || DIGITAL_NFT_TYPE[0],
                      mintedNftTokenType:
                        NFT_TOKEN_TYPES.find(
                          (tokenType) => tokenType.value === tokenTypeValue
                        ) || NFT_TOKEN_TYPES[0],
                      mintedNftContractAddress: nftItem.contract,
                      mintedNftExternalUrl: nftItem.externalUrl ?? "",
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      mintedNftTransferTime:
                        transferTime && !isNaN(Number(transferTime))
                          ? Number(transferTime)
                          : "",
                      mintedNftTokenIdRangeMax: Number(
                        nftItem.tokenIdRange?.max || "0"
                      ),
                      mintedNftTokenIdRangeMin: Number(
                        nftItem.tokenIdRange?.min || "0"
                      ),
                      mintedNftTransferCriteria:
                        nftItem.terms?.find(
                          (term) =>
                            term.key ===
                            mintedNftInfo.mintedNftTransferCriteria.key
                        )?.value ?? "",
                      mintedNftTransferTimeUnit: OPTIONS_PERIOD[0],
                      mintedNftBuyerTransferInfo:
                        BUYER_TRANSFER_INFO_OPTIONS.find(
                          (option) => option.value === buyerTransferInfo
                        ) || BUYER_TRANSFER_INFO_OPTIONS[0]
                    };
                    return existingNft;
                  } else {
                    const transferTime =
                      nftItem.terms?.find(
                        (term) => term.key === newNftInfo.newNftTransferTime.key
                      )?.value ?? "";
                    const buyerTransferInfo =
                      nftItem.terms?.find(
                        (term) =>
                          term.key ===
                          newNftInfo.newNftBuyerTransferInfo.normalizedKey
                      )?.value ?? "";
                    const nftType =
                      nftItem.terms?.find(
                        (term) => term.key === newNftInfo.newNftType.key
                      )?.value ?? "";
                    const newNft: NewNFT = {
                      type:
                        getDigitalTypeOption("digital-nft") || DIGITAL_TYPE[0],
                      isNftMintedAlready:
                        getIsMintedAlreadyOption("false") || null,
                      newNftType:
                        DIGITAL_NFT_TYPE.find(
                          (tokenType) => tokenType.value === nftType
                        ) || DIGITAL_NFT_TYPE[0],
                      newNftName: nftItem.name,
                      newNftDescription: nftItem.description || "",
                      newNftTransferCriteria:
                        nftItem.terms?.find(
                          (term) =>
                            term.key === newNftInfo.newNftTransferCriteria.key
                        )?.value ?? "",
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      newNftTransferTime:
                        transferTime && !isNaN(Number(transferTime))
                          ? Number(transferTime)
                          : "",
                      newNftTransferTimeUnit: OPTIONS_PERIOD[0],
                      newNftBuyerTransferInfo:
                        BUYER_TRANSFER_INFO_OPTIONS.find(
                          (option) => option.value === buyerTransferInfo
                        ) || BUYER_TRANSFER_INFO_OPTIONS[0]
                    };
                    return newNft;
                  }
                } else if (type === digitalTypeMapping["digital-file"]) {
                  const transferTime =
                    nftItem.terms?.find(
                      (term) =>
                        term.key === digitalFileInfo.digitalFileTransferTime.key
                    )?.value ?? "";
                  const buyerTransferInfo =
                    nftItem.terms?.find(
                      (term) =>
                        term.key ===
                        digitalFileInfo.digitalFileBuyerTransferInfo
                          .normalizedKey
                    )?.value ?? "";
                  const digitalFile: DigitalFile = {
                    type:
                      getDigitalTypeOption("digital-file") || DIGITAL_TYPE[0],
                    isNftMintedAlready: null,
                    digitalFileName: nftItem.name,
                    digitalFileDescription: nftItem.description ?? "",
                    digitalFileFormat:
                      nftItem.terms?.find(
                        (term) =>
                          term.key === digitalFileInfo.digitalFileFormat.key
                      )?.value ?? "",
                    digitalFileTransferTimeUnit: OPTIONS_PERIOD[0],
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    digitalFileTransferTime:
                      transferTime && !isNaN(Number(transferTime))
                        ? Number(transferTime)
                        : "",
                    digitalFileTransferCriteria:
                      nftItem.terms?.find(
                        (term) =>
                          term.key ===
                          digitalFileInfo.digitalFileTransferCriteria.key
                      )?.value ?? "",
                    digitalFileBuyerTransferInfo:
                      BUYER_TRANSFER_INFO_OPTIONS.find(
                        (option) => option.value === buyerTransferInfo
                      ) || BUYER_TRANSFER_INFO_OPTIONS[0]
                  };
                  return digitalFile;
                } else if (type === digitalTypeMapping.experiential) {
                  const transferTime =
                    nftItem.terms?.find(
                      (term) =>
                        term.key ===
                        experientialInfo.experientialTransferTime.key
                    )?.value ?? "";
                  const buyerTransferInfo =
                    nftItem.terms?.find(
                      (term) =>
                        term.key ===
                        experientialInfo.experientialBuyerTransferInfo
                          .normalizedKey
                    )?.value ?? "";
                  const experiential: Experiential = {
                    type:
                      getDigitalTypeOption("experiential") || DIGITAL_TYPE[0],
                    isNftMintedAlready: null,
                    experientialName: nftItem.name,
                    experientialDescription: nftItem.description ?? "",
                    experientialTransferCriteria:
                      nftItem.terms?.find(
                        (term) =>
                          term.key ===
                          experientialInfo.experientialTransferCriteria.key
                      )?.value ?? "",
                    experientialTransferTime:
                      transferTime && !isNaN(Number(transferTime))
                        ? Number(transferTime)
                        : ("" as unknown as number),
                    experientialTransferTimeUnit: OPTIONS_PERIOD[0],
                    experientialBuyerTransferInfo:
                      BUYER_TRANSFER_INFO_OPTIONS.find(
                        (option) => option.value === buyerTransferInfo
                      ) || BUYER_TRANSFER_INFO_OPTIONS[0]
                  };
                  return experiential;
                }
                return null;
              })
              .filter(isTruthy)
          };
        })()
      : cloneBaseValues.productDigital,
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
            currency:
              OPTIONS_CURRENCIES.find(
                (currency) => currency.value === offer.exchangeToken.symbol
              ) || OPTIONS_CURRENCIES[0],
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
              bundleItemsMedia,
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
    bundleItemsMedia,
    variantsCoreTermsOfSale: {
      ...cloneBaseValues.variantsCoreTermsOfSale,
      ...commonCoreTermsOfSale
    },
    coreTermsOfSale: (() => {
      const currency =
        OPTIONS_CURRENCIES.find(
          (currency) => currency.value === firstOffer.exchangeToken.symbol
        ) || OPTIONS_CURRENCIES[0];
      return {
        ...cloneBaseValues.coreTermsOfSale,
        ...commonCoreTermsOfSale,
        currency,
        price: utils.formatUnits(
          firstOffer.price,
          firstOffer.exchangeToken.decimals
        ),
        quantity: firstOffer.quantityInitial
      };
    })(),
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
