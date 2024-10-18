/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionResponse } from "@bosonprotocol/common";
import {
  AnyMetadata,
  bundle,
  isBundle,
  isProductV1,
  offers,
  productV1,
  productV1Item,
  Provider,
  subgraph
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import toast from "react-hot-toast";
import {
  generatePath,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import uuid from "react-uuid";
dayjs.extend(localizedFormat);
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { Token } from "components/convertion-rate/ConvertionRateContext";
import { providers } from "ethers";
import { useChainId, useSigner } from "lib/utils/hooks/connection/connection";
import { useWaitForCreatedSeller } from "lib/utils/hooks/seller/useWaitForCreatedSeller";
import { useForm } from "lib/utils/hooks/useForm";
import { useEffect } from "react";

import { getLensTokenIdDecimal } from "../../components/modal/components/Profile/Lens/utils";
import { useModal } from "../../components/modal/useModal";
import Help from "../../components/product/Help";
import Preview from "../../components/product/Preview";
import {
  CreateProductForm,
  getCreateProductSteps,
  ImageSpecificOrAll,
  OPTIONS_EXCHANGE_POLICY,
  ProductMetadataAttributeKeys,
  ProductTypeTypeValues,
  ProductTypeVariantsValues,
  TOKEN_TYPES,
  TypeKeys
} from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import SuccessTransactionToast from "../../components/toasts/SuccessTransactionToast";
import BosonButton from "../../components/ui/BosonButton";
import { Grid } from "../../components/ui/Grid";
import { Typography } from "../../components/ui/Typography";
import {
  SellerLandingPageParameters,
  UrlParameters
} from "../../lib/routing/parameters";
import { BundleRoutes, ProductRoutes } from "../../lib/routing/routes";
import { useChatStatus } from "../../lib/utils/hooks/chat/useChatStatus";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { saveItemInStorage } from "../../lib/utils/hooks/localstorage/useLocalStorage";
import { useCreateOffers } from "../../lib/utils/hooks/offer/useCreateOffers";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import {
  CreateProductWrapper,
  HelpWrapper,
  MultiStepsContainer,
  ProductLayoutContainer
} from "./CreateProductInner.styles";
import { createProductSteps, FIRST_STEP } from "./utils";
import { SELLER_DEFAULT_VERSION } from "./utils/const";
import { extractOfferTimestamps } from "./utils/dataValidator";
import {
  extractVisualImages,
  VisualImages
} from "./utils/extractVisualsImages";
import { getOfferDataFromMetadata } from "./utils/getOfferDataFromMetadata";
import { getProductItemV1Metadata } from "./utils/getProductItemV1Metadata";
import { getProductV1Metadata } from "./utils/getProductV1Metadata";
import { getTermsOfExchange } from "./utils/getTermsOfExchange";
import {
  getDisputePeriodDurationInMS,
  getResolutionPeriodDurationInMS
} from "./utils/helpers";
import { getBundleMetadata, getDigitalMetadatas } from "./utils/productDigital";
import { SupportedJuridiction } from "./utils/types";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;

function onKeyPress(event: React.KeyboardEvent<HTMLFormElement>) {
  const isTargetTextArea = (event.target as any)?.type === "textarea";
  if (!isTargetTextArea && event.key === "Enter") {
    event.preventDefault();
  }
}

interface Props {
  initial: CreateProductForm;
  showCreateProductDraftModal: () => void;
  setCreatedOffersIds: Dispatch<SetStateAction<string[]>>;
  isDraftModalClosed: boolean;
}

function CreateProductInner({
  initial,
  showCreateProductDraftModal,
  setCreatedOffersIds,
  isDraftModalClosed
}: Props) {
  const chainId = useChainId();
  const { config } = useConfigContext();
  const chainIdToUse = chainId || config.envConfig.chainId;
  const signer = useSigner();
  const history = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useKeepQueryParamsNavigate();
  const { chatInitializationStatus } = useChatStatus();
  const [productVariant, setProductVariant] = useState<string>(
    initial?.productType?.productVariant ||
      ProductTypeVariantsValues.oneItemType
  );
  const [productType, setProductType] = useState<string>(
    initial?.productType?.productType || ProductTypeTypeValues.physical
  );
  const isMultiVariant =
    productVariant === ProductTypeVariantsValues.differentVariants;
  const isPhygital = productType === ProductTypeTypeValues.phygital;
  const [isTokenGated, setIsTokenGated] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(
    location?.state?.step || FIRST_STEP
  );
  const [decimals, setDecimals] = useState<number | undefined>(undefined);

  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const { showModal, modalTypes, hideModal } = useModal();
  const coreSDK = useCoreSDK();
  const showInvalidRoleModal = useCallback(() => {
    showModal<"INVALID_ROLE">(modalTypes.INVALID_ROLE, {
      title: "Invalid Role",
      action: "create a product",
      requiredRole: "assistant",
      closable: false
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    function onBackButtonEvent(e: any) {
      const currentStep = e.state?.usr?.step || 0;
      if (currentStep !== 0) {
        e.preventDefault();
        setCurrentStep(currentStep - 1);
      }
    }
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  const setCurrentStepWithHistory = useCallback(
    (step: number) => {
      setCurrentStep(step);
      const deleteAllExceptSellerLandingQueryParams = () => {
        Array.from(searchParams.keys()).forEach((queryParamKey) => {
          const isSellerLandingQueryParam =
            !!SellerLandingPageParameters[
              queryParamKey as keyof typeof SellerLandingPageParameters
            ];
          if (!isSellerLandingQueryParam) {
            searchParams.delete(queryParamKey);
          }
        });
        setSearchParams(searchParams);
      };
      deleteAllExceptSellerLandingQueryParams();
      history(
        { pathname: ".", search: `?${searchParams.toString()}` },
        {
          replace: true,
          state: {
            ...location.state,
            search: `?${searchParams.toString()}`,
            step
          }
        }
      );
      window.history.pushState(null, "", window.location.href);
    },
    [history, location.state, searchParams, setSearchParams]
  );

  const onCreateNew = () => {
    hideModal();
    setCurrentStepWithHistory(FIRST_STEP);
    setIsPreviewVisible(false);
  };

  const [isOneSetOfImages, setIsOneSetOfImages] = useState<boolean>(false);
  const { seller: currentAssistant, lens: lensProfiles } =
    useWaitForCreatedSeller();
  const { mutateAsync: createOffers } = useCreateOffers();
  const contactPreference = currentAssistant?.metadata?.contactPreference ?? "";
  // lens profile of the current user
  const assistantLens: Profile | null =
    lensProfiles.find((lensProfile) => {
      return (
        getLensTokenIdDecimal(lensProfile?.id).toString() ===
        currentAssistant?.authTokenId
      );
    }) || null;

  const onViewMyItem = ({
    productUuid,
    bundleUuid
  }: {
    productUuid: string | null;
    bundleUuid: string | null;
  }) => {
    hideModal();
    setCurrentStepWithHistory(FIRST_STEP);
    setIsPreviewVisible(false);
    const pathname =
      productUuid || bundleUuid
        ? productUuid
          ? generatePath(ProductRoutes.ProductDetail, {
              [UrlParameters.sellerId]: currentAssistant?.id || null,
              [UrlParameters.uuid]: productUuid
            })
          : generatePath(BundleRoutes.BundleDetail, {
              [UrlParameters.sellerId]: currentAssistant?.id || null,
              [UrlParameters.uuid]: bundleUuid
            })
        : generatePath(ProductRoutes.Root);
    navigate({ pathname });
  };
  const handleOpenSuccessModal = async ({
    offerInfo,
    values
  }: {
    offerInfo: OfferFieldsFragment;
    values: CreateProductForm;
  }) => {
    const offerId = offerInfo.id;

    showModal(
      modalTypes.PRODUCT_CREATE_SUCCESS,
      {
        title: `Offer ${offerId}`,
        name: offerInfo.metadata?.name || "",
        message: "You have successfully created:",
        image:
          offerInfo.metadata?.image ||
          values.productImages.thumbnail?.[0].src ||
          "",
        price: offerInfo.price,
        offer: {
          ...offerInfo,
          metadata: {
            ...offerInfo.metadata,
            animationUrl: values.productAnimation?.[0]?.src,
            exchangePolicy: {
              label: OPTIONS_EXCHANGE_POLICY[0].label,
              template: OPTIONS_EXCHANGE_POLICY[0].value
            }
          },
          condition:
            offerInfo.condition ?? values.tokenGating.tokenContract
              ? values.tokenGating ?? null
              : null
        },
        // these are the ones that we already had before
        onCreateNew: onCreateNew,
        onViewMyItem: () =>
          onViewMyItem({
            productUuid:
              offerInfo.metadata && isProductV1(offerInfo)
                ? offerInfo.metadata.product?.uuid
                : null,
            bundleUuid:
              offerInfo.metadata && isBundle(offerInfo)
                ? offerInfo.metadata.bundleUuid
                : null
          })
      },
      "auto"
    );
  };
  const formikRef = useRef<FormikProps<CreateProductForm>>(null);
  const wizardStep = useMemo(() => {
    const wizard = createProductSteps({
      setIsPreviewVisible,
      chatInitializationStatus,
      showCreateProductDraftModal,
      isDraftModalClosed,
      showInvalidRoleModal,
      isMultiVariant,
      isPhygital,
      isTokenGated,
      onChangeOneSetOfImages: setIsOneSetOfImages,
      isOneSetOfImages,
      config,
      coreSDK
    });
    return {
      currentStep: wizard?.[currentStep]?.ui || null,
      currentValidation: wizard?.[currentStep]?.validation || null,
      helpSection: wizard?.[currentStep]?.helpSection || null,
      wizardLength: keys(wizard).length - 1
    };
  }, [
    chatInitializationStatus,
    showCreateProductDraftModal,
    isDraftModalClosed,
    showInvalidRoleModal,
    isMultiVariant,
    isPhygital,
    isTokenGated,
    isOneSetOfImages,
    currentStep,
    config,
    coreSDK
  ]);
  const handleNextForm = useCallback(() => {
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    }
    if (currentStep < wizardStep.wizardLength) {
      const nextStep = currentStep + 1;
      setCurrentStepWithHistory(nextStep);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    isPreviewVisible,
    wizardStep.wizardLength,
    currentStep,
    setCurrentStepWithHistory
  ]);

  const handleClickStep = (val: number) => {
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    }
    if (currentStep > val) {
      setCurrentStep(val);
    }
  };

  const handleSendData = async (values: CreateProductForm) => {
    let txResponse: TransactionResponse | undefined;
    try {
      showModal("PREPARING_TRANSACTION", undefined, "auto", undefined, {
        xs: "400px"
      });
      const {
        coreTermsOfSale,
        createYourProfile,
        productInformation,
        productImages,
        productVariantsImages,
        productType,
        termsOfExchange,
        shippingInfo
      } = values;

      const productMainImageLink: string | undefined =
        isMultiVariant && !isOneSetOfImages
          ? productVariantsImages?.find((variant) => {
              return variant.productImages?.thumbnail?.[0]?.src;
            })?.productImages?.thumbnail?.[0]?.src
          : productImages?.thumbnail?.[0]?.src;

      const productAttributes: Array<{
        traitType: string;
        value: string;
      }> = productInformation.attributes.map(({ name, value }) => {
        return {
          traitType: name || "",
          value: value || ""
        };
      });

      const supportedJurisdictions: Array<SupportedJuridiction> =
        shippingInfo.jurisdiction
          .filter((v) => v.time && v.region)
          .reduce((prev, current) => {
            const { region, time } = current;
            if (!region || region.length === 0 || !time || time.length === 0) {
              return prev;
            } else {
              return [
                ...prev,
                {
                  label: region,
                  deliveryTime: time
                }
              ];
            }
          }, [] as Array<SupportedJuridiction>);

      // filter empty attributes
      const additionalAttributes = productAttributes.filter((attribute) => {
        return attribute.traitType.length > 0;
      });

      const redemptionPointUrl =
        shippingInfo.redemptionPointUrl &&
        shippingInfo.redemptionPointUrl.length > 0
          ? shippingInfo.redemptionPointUrl
          : window.origin;

      // if we have variants defined, then we show the first one in the preview
      const variantIndex = 0;
      const firstVariant = values.productVariants.variants[variantIndex];

      const exchangeSymbol = isMultiVariant
        ? firstVariant.currency.value
        : values.coreTermsOfSale.currency.value;
      const exchangeToken = config.envConfig.defaultTokens?.find(
        (n: Token) => n.symbol === exchangeSymbol
      );

      const commonTermsOfSale = isMultiVariant
        ? values.variantsCoreTermsOfSale
        : values.coreTermsOfSale;

      const {
        offerValidityPeriod,
        redemptionPeriod,
        infiniteExpirationOffers,
        voucherValidDurationInDays
      } = commonTermsOfSale;

      const {
        voucherRedeemableFromDateInMS,
        voucherRedeemableUntilDateInMS,
        voucherValidDurationInMS,
        validFromDateInMS,
        validUntilDateInMS
      } = extractOfferTimestamps({
        offerValidityPeriod,
        redemptionPeriod,
        infiniteExpirationOffers: !!infiniteExpirationOffers,
        voucherValidDurationInDays
      });

      const disputePeriodDurationInMS = getDisputePeriodDurationInMS(
        termsOfExchange.disputePeriod
      );
      const resolutionPeriodDurationInMS = getResolutionPeriodDurationInMS();

      const nftAttributes: {
        traitType: string;
        value: string;
        displayType?: string;
      }[] = [];
      nftAttributes.push({
        traitType: ProductMetadataAttributeKeys["Token Type"],
        value: "BOSON rNFT"
      });
      nftAttributes.push({
        traitType: ProductMetadataAttributeKeys["Redeemable At"],
        value: redemptionPointUrl
      });

      if (voucherRedeemableUntilDateInMS) {
        nftAttributes.push({
          traitType: ProductMetadataAttributeKeys["Redeemable Until"],
          value: voucherRedeemableUntilDateInMS.toString(),
          displayType: "date"
        });
      } else if (voucherValidDurationInMS) {
        nftAttributes.push({
          traitType: ProductMetadataAttributeKeys["Redeemable After X Days"],
          value: (voucherValidDurationInMS / 86400000).toString()
        });
      }
      if (assistantLens?.name || assistantLens?.handle) {
        nftAttributes.push({
          traitType: ProductMetadataAttributeKeys["Seller"],
          value: assistantLens?.name || assistantLens?.handle
        });
      } else {
        nftAttributes.push({
          traitType: ProductMetadataAttributeKeys["Seller"],
          value: createYourProfile.name
        });
      }

      // Be sure the uuid is unique (for all users).
      // Do NOT use Date.now() because nothing prevent 2 users to create 2 offers at the same time
      const offerUuid = uuid();
      const bundleUuid = uuid();

      // Ddd sellerId in the license and offer-uuid routes (if known)
      const offerExternalUrl = currentAssistant
        ? `${redemptionPointUrl}/#/offer-uuid/${currentAssistant.id}/${offerUuid}`
        : `${redemptionPointUrl}/#/offer-uuid/${offerUuid}`;
      const offerLicenseUrl = currentAssistant
        ? `${window.origin}/#/license/${currentAssistant.id}/${offerUuid}`
        : `${window.origin}/#/license/${offerUuid}`;
      const bundleExternalUrl = currentAssistant
        ? `${redemptionPointUrl}/#/bundles/${currentAssistant.id}/${bundleUuid}`
        : `${redemptionPointUrl}/#/bundles/${bundleUuid}`;
      const bundleLicenseUrl = currentAssistant
        ? `${redemptionPointUrl}/#/license-bundle/${currentAssistant.id}/${bundleUuid}`
        : `${redemptionPointUrl}/#/license-bundle/${bundleUuid}`;

      const offersToCreate: offers.CreateOfferArgs[] = [];
      const productAnimation = values.productAnimation?.[0];
      const newNftMetadatas = getDigitalMetadatas({
        chainId: chainIdToUse,
        values
      });
      const nftMetadataIpfsLinks: string[] = (
        await Promise.all(
          newNftMetadatas.map((nftMetadata) => {
            return coreSDK.storeMetadata(nftMetadata);
          })
        )
      ).map((hash) => `ipfs://${hash}`);
      if (isMultiVariant) {
        const { variants = [] } = values.productVariants;
        const variantsForMetadataCreation: Parameters<
          (typeof productV1)["createVariantProductMetadata"]
        >[1] = [];
        const visualImages: VisualImages = [];
        const allVariationsWithSameImages =
          values.imagesSpecificOrAll?.value === ImageSpecificOrAll.all;
        if (allVariationsWithSameImages) {
          const variantVisualImages = extractVisualImages(productImages);

          visualImages.push(...variantVisualImages);
        }
        for (const [index, variant] of Object.entries(variants)) {
          const productImages =
            productVariantsImages?.[Number(index)]?.productImages;
          const { color, size } = variant;
          const typeOptions = [
            {
              type: TypeKeys.Size,
              option: size || "-"
            },
            {
              type: TypeKeys.Color,
              option: color || "-"
            }
          ];

          if (!allVariationsWithSameImages && productImages) {
            const variantVisualImages = extractVisualImages(productImages);

            variantsForMetadataCreation.push({
              productVariant: typeOptions,
              productOverrides: {
                visuals_images: variantVisualImages
              }
            });
            visualImages.push(...variantVisualImages);
          } else {
            variantsForMetadataCreation.push({
              productVariant: typeOptions
            });
          }
        }
        let metadatas:
          | productV1Item.ProductV1Item[]
          | productV1.ProductV1Metadata[];
        if (isPhygital) {
          const productItemV1Metadata = await getProductItemV1Metadata({
            uuid: bundleUuid,
            productInformation,
            productAnimation,
            createYourProfile,
            productType,
            visualImages,
            shippingInfo,
            termsOfExchange,
            supportedJurisdictions,
            redemptionPointUrl
          });
          metadatas = productV1Item.createVariantProductItem(
            productItemV1Metadata,
            variantsForMetadataCreation
          );
        } else {
          const productV1Metadata = await getProductV1Metadata({
            contactPreference,
            offerUuid,
            productInformation,
            productAnimation,
            externalUrl: offerExternalUrl,
            licenseUrl: offerLicenseUrl,
            productMainImageLink,
            nftAttributes,
            additionalAttributes,
            createYourProfile,
            productType,
            visualImages,
            shippingInfo,
            termsOfExchange,
            supportedJurisdictions,
            redemptionPointUrl
          });
          const variantsMetadatas = productV1.createVariantProductMetadata(
            productV1Metadata,
            variantsForMetadataCreation
          );
          // Fix description as the licenseUrl has changed
          variantsMetadatas.forEach((variantMetadata) => {
            variantMetadata.description = `${productInformation.description}\n\nTerms for the Boson rNFT Voucher: ${variantMetadata.licenseUrl}`;
          });
          if (!isOneSetOfImages) {
            // fix main variant image as it should be the variant's thumbnail
            variantsMetadatas.forEach((variantMetadata, index) => {
              const productImages =
                productVariantsImages?.[Number(index)]?.productImages;
              if (productImages?.thumbnail?.[0]?.src) {
                variantMetadata.image = productImages.thumbnail[0].src;
              } else {
                // this else clause should never occur
                if (
                  variantMetadata.productOverrides?.visuals_images?.[0]?.url
                ) {
                  variantMetadata.image =
                    variantMetadata.productOverrides?.visuals_images[0].url;
                }
              }
            });
          }
          metadatas = variantsMetadatas;
        }

        const offerDataPromises: Promise<offers.CreateOfferArgs>[] =
          metadatas.map(async (metadata, index) => {
            const exchangeToken = config.envConfig.defaultTokens?.find(
              (n) => n.symbol === variants[index].currency.label
            );
            const decimals = Number(exchangeToken?.decimals || 18);
            const price = variants[index].price;

            const { priceBN, buyerCancellationPenaltyValue, sellerDeposit } =
              getTermsOfExchange({
                termsOfExchange,
                price,
                decimals
              });
            let metadataForOffer: typeof metadata | bundle.BundleMetadata;
            if (isPhygital) {
              const bundleMetadata: bundle.BundleMetadata = getBundleMetadata(
                {
                  name: values.productInformation.bundleName ?? "",
                  description:
                    values.productInformation.bundleDescription ?? "",
                  externalUrl: bundleExternalUrl,
                  licenseUrl: bundleLicenseUrl,
                  seller: {
                    ...(currentAssistant?.metadata || ({} as any)),
                    defaultVersion: SELLER_DEFAULT_VERSION
                  },
                  image:
                    metadata.type === "ITEM_PRODUCT_V1"
                      ? metadata.productOverrides?.visuals_images?.[0]?.url
                      : undefined,
                  imageData: undefined,
                  animationUrl:
                    metadata.type === "ITEM_PRODUCT_V1"
                      ? metadata.productOverrides?.visuals_videos?.[0]?.url ||
                        metadata.product?.visuals_videos?.[0]?.url
                      : undefined,
                  attributes: nftAttributes
                },
                [
                  ...nftMetadataIpfsLinks,
                  `ipfs://${await coreSDK.storeMetadata(metadata)}`
                ],
                bundleUuid
              );
              metadataForOffer = bundleMetadata;
            } else {
              metadataForOffer = metadata;
            }

            return getOfferDataFromMetadata(metadataForOffer, {
              coreSDK,
              config,
              priceBN,
              sellerDeposit,
              buyerCancellationPenaltyValue,
              quantityAvailable: variants[index].quantity,
              voucherRedeemableFromDateInMS,
              voucherRedeemableUntilDateInMS,
              voucherValidDurationInMS,
              validFromDateInMS,
              validUntilDateInMS,
              disputePeriodDurationInMS,
              resolutionPeriodDurationInMS,
              exchangeToken
            });
          });
        offersToCreate.push(...(await Promise.all(offerDataPromises)));
      } else {
        // no variants case
        const visualImages = extractVisualImages(productImages);

        const price = coreTermsOfSale.price;
        const decimals = Number(exchangeToken?.decimals || 18);
        const { priceBN, buyerCancellationPenaltyValue, sellerDeposit } =
          getTermsOfExchange({
            termsOfExchange,
            price,
            decimals
          });
        const pushOfferData = async (metadata: AnyMetadata): Promise<void> => {
          const offerData = await getOfferDataFromMetadata(metadata, {
            coreSDK,
            config,
            priceBN,
            sellerDeposit,
            buyerCancellationPenaltyValue,
            quantityAvailable: coreTermsOfSale.quantity,
            voucherRedeemableFromDateInMS,
            voucherRedeemableUntilDateInMS,
            voucherValidDurationInMS,
            validFromDateInMS,
            validUntilDateInMS,
            disputePeriodDurationInMS,
            resolutionPeriodDurationInMS,
            exchangeToken
          });
          offersToCreate.push(offerData);
        };
        if (isPhygital) {
          const productItemV1Metadata = await getProductItemV1Metadata({
            uuid: bundleUuid,
            productInformation,
            productAnimation,
            createYourProfile,
            productType,
            visualImages,
            shippingInfo,
            termsOfExchange,
            supportedJurisdictions,
            redemptionPointUrl
          });

          nftMetadataIpfsLinks.push(
            `ipfs://${await coreSDK.storeMetadata(productItemV1Metadata)}`
          );
          // 1 bundle for each variant-digital1-digital2-digital3
          // digital1 is nft with tokenId_n1 of contract C1
          // digital2 is nft with tokenId_n2 of contract C1
          // digital3 is nft with tokenId_n1 of contract C2
          // as this is the no variants flow, it's just 1 bundle with the variant metadata ipfs hash and the digital metadata ipfs hash
          const bundleMetadata: bundle.BundleMetadata = getBundleMetadata(
            {
              name: values.productInformation.bundleName ?? "",
              description: values.productInformation.bundleDescription ?? "",
              externalUrl: bundleExternalUrl,
              licenseUrl: bundleLicenseUrl,
              seller: {
                ...(currentAssistant?.metadata || ({} as any)),
                defaultVersion: SELLER_DEFAULT_VERSION
              },
              image: visualImages?.[0]?.url,
              imageData: undefined,
              animationUrl:
                productItemV1Metadata.productOverrides?.visuals_videos?.[0]
                  ?.url ||
                productItemV1Metadata.product?.visuals_videos?.[0]?.url,
              attributes: nftAttributes
            },
            nftMetadataIpfsLinks,
            bundleUuid
          );
          await pushOfferData(bundleMetadata);
        } else {
          const productV1Metadata = await getProductV1Metadata({
            contactPreference,
            offerUuid,
            productInformation,
            productAnimation,
            externalUrl: offerExternalUrl,
            licenseUrl: offerLicenseUrl,
            productMainImageLink,
            nftAttributes,
            additionalAttributes,
            createYourProfile,
            productType,
            visualImages,
            shippingInfo,
            termsOfExchange,
            supportedJurisdictions,
            redemptionPointUrl
          });
          await pushOfferData(productV1Metadata);
        }
      }
      const isTokenGated = productType?.tokenGatedOffer === "true";
      const result = await createOffers({
        sellerToCreate: null,
        offersToCreate,
        tokenGatedInfo: isTokenGated ? values.tokenGating : null,
        conditionDecimals: decimals,
        onGetExchangeTokenDecimals: setDecimals,
        onCreatedOffersWithVariants: ({ firstOffer, createdOffers }) => {
          createdOffers.length &&
            setCreatedOffersIds(createdOffers.map((offer) => offer.id));

          toast((t) => (
            <SuccessTransactionToast
              t={t}
              action={`Created offer with variants: ${firstOffer?.metadata?.name}`}
              onViewDetails={() => {
                handleOpenSuccessModal({
                  offerInfo: firstOffer || ({} as subgraph.OfferFieldsFragment),
                  values
                });
              }}
            />
          ));
        },
        onCreatedSingleOffers: ({ offer: createdOffer }) => {
          createdOffer && setCreatedOffersIds([createdOffer.id]);
          toast((t) => (
            <SuccessTransactionToast
              t={t}
              action={`Created offer: ${createdOffer?.metadata?.name}`}
              onViewDetails={() => {
                handleOpenSuccessModal({
                  offerInfo:
                    createdOffer || ({} as subgraph.OfferFieldsFragment),
                  values
                });
              }}
            />
          ));
        }
      });
      txResponse = result?.txResponse;
    } catch (error: any) {
      console.error("error->", error.errors ?? error);
      const hasUserRejectedTx = getHasUserRejectedTx(error);
      if (hasUserRejectedTx) {
        showModal("TRANSACTION_FAILED", undefined, "auto", undefined, {
          xs: "400px"
        });
      } else {
        showModal(
          "TRANSACTION_FAILED",
          {
            errorMessage: "Something went wrong",
            detailedErrorMessage: await extractUserFriendlyError(error, {
              txResponse: txResponse as providers.TransactionResponse,
              provider: signer?.provider as Provider
            })
          },
          "auto",
          undefined,
          {
            xs: "400px"
          }
        );
      }
    }
  };

  const handleSubmit = (
    values: CreateProductForm,
    formikBag: FormikHelpers<CreateProductForm>
  ) => {
    if (currentStep === wizardStep.wizardLength) {
      return handleSendData(values);
    }
    formikBag.setTouched({});
    return handleNextForm();
  };

  const handleFormikValuesBeforeSave = useCallback(
    (values: CreateProductForm) => {
      const coreTermsOfSaleKey = isMultiVariant
        ? "variantsCoreTermsOfSale"
        : "coreTermsOfSale";

      const redemptionPeriod = Array.isArray(
        values?.[coreTermsOfSaleKey]?.redemptionPeriod
      )
        ? (
            values?.[coreTermsOfSaleKey]?.redemptionPeriod as
              | Dayjs[]
              | undefined
          )?.map((d) => dayjs(d).format()) ?? []
        : values?.[coreTermsOfSaleKey]?.redemptionPeriod;
      const offerValidityPeriod = Array.isArray(
        values?.[coreTermsOfSaleKey]?.offerValidityPeriod
      )
        ? (
            values?.[coreTermsOfSaleKey]?.offerValidityPeriod as
              | Dayjs[]
              | undefined
          )?.map((d) => dayjs(d).format()) ?? []
        : values?.[coreTermsOfSaleKey]?.offerValidityPeriod;
      return {
        ...values,
        [coreTermsOfSaleKey]: {
          ...values[coreTermsOfSaleKey],
          redemptionPeriod,
          offerValidityPeriod
        }
      };
    },
    [isMultiVariant]
  );

  useEffect(() => {
    formikRef?.current?.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOneSetOfImages]);

  const getDecimalOnPreview = async (values: CreateProductForm) => {
    const tokenContract = values.tokenGating?.tokenContract;
    const tokenType = values.tokenGating?.tokenType;

    if (
      tokenContract &&
      tokenContract.length > 0 &&
      tokenType?.value === TOKEN_TYPES[0].value
    ) {
      try {
        const result = await coreSDK.getExchangeTokenInfo(tokenContract);
        const { decimals } = result ?? {};
        setDecimals(decimals);
      } catch (error) {
        setDecimals(undefined);
      }
    }
  };

  return (
    <CreateProductWrapper>
      <MultiStepsContainer>
        <MultiSteps
          data={getCreateProductSteps({
            isMultiVariant,
            isTokenGated,
            isPhygital
          })}
          active={currentStep}
          callback={handleClickStep}
          disableInactiveSteps
        />
      </MultiStepsContainer>

      <ProductLayoutContainer $isPreviewVisible={isPreviewVisible}>
        <Formik<CreateProductForm>
          innerRef={formikRef}
          initialValues={initial}
          onSubmit={(formikVal, formikBag) => {
            const newValues = handleFormikValuesBeforeSave(formikVal);
            saveItemInStorage("create-product", newValues);
            return handleSubmit(formikVal, formikBag);
          }}
          validationSchema={wizardStep.currentValidation}
          enableReinitialize
        >
          {({ values }) => {
            // TODO: fix: these setState calls cause this warning: Warning: Cannot update a component (`CreateProductInner`) while rendering a different component (`Formik`). To locate the bad setState() call inside `Formik`, follow the stack trace as described in
            if (productType !== values?.productType?.productType) {
              setProductType(values?.productType?.productType);
            }
            if (productVariant !== values?.productType?.productVariant) {
              setProductVariant(values?.productType?.productVariant);
            }
            const formTokenGated =
              values.productType?.tokenGatedOffer === "true";
            if (isTokenGated !== formTokenGated) {
              setIsTokenGated(formTokenGated);
            }
            getDecimalOnPreview(values);

            return (
              <Form onKeyPress={onKeyPress}>
                <ClearErrorsOnStepChange currentStep={currentStep} />
                {isPreviewVisible ? (
                  <ErrorBoundary
                    FallbackComponent={({ resetErrorBoundary }) => (
                      <Grid flexDirection="column" gap="1rem">
                        <Typography fontWeight="600">
                          Sorry, the preview is unavailable right now, please
                          try again later.
                        </Typography>
                        <BosonButton
                          onClick={() => resetErrorBoundary()}
                          variant="accentInverted"
                        >
                          Back
                        </BosonButton>
                      </Grid>
                    )}
                    onError={(error) => {
                      Sentry.captureException(error);
                    }}
                    onReset={() => {
                      setIsPreviewVisible(false);
                    }}
                  >
                    <Preview
                      togglePreview={setIsPreviewVisible}
                      isMultiVariant={isMultiVariant}
                      isOneSetOfImages={isOneSetOfImages}
                      chatInitializationStatus={chatInitializationStatus}
                      decimals={decimals}
                      seller={currentAssistant}
                    />
                  </ErrorBoundary>
                ) : (
                  wizardStep.currentStep
                )}
              </Form>
            );
          }}
        </Formik>
        {!isPreviewVisible && isArray(wizardStep.helpSection) && (
          <HelpWrapper>
            <Help data={wizardStep.helpSection} />
          </HelpWrapper>
        )}
      </ProductLayoutContainer>
    </CreateProductWrapper>
  );
}

function ClearErrorsOnStepChange({ currentStep }: { currentStep: number }) {
  const { setErrors } = useForm();
  useEffect(() => {
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);
  return null;
}

export default CreateProductInner;
