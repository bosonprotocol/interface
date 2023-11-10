/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CoreSDK,
  MetadataType,
  offers,
  productV1,
  subgraph
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import map from "lodash/map";
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
import { useConfigContext } from "components/config/ConfigContext";
import { Token } from "components/convertion-rate/ConvertionRateContext";
import { BigNumber, ethers } from "ethers";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "lib/utils/errors";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { useEffect } from "react";

import { FileProps } from "../../components/form/Upload/types";
import { getLensTokenIdDecimal } from "../../components/modal/components/Profile/Lens/utils";
import { useModal } from "../../components/modal/useModal";
import Help from "../../components/product/Help";
import Preview from "../../components/product/Preview";
import {
  CREATE_PRODUCT_STEPS,
  CreateProductForm,
  ImageSpecificOrAll,
  OPTIONS_EXCHANGE_POLICY,
  ProductMetadataAttributeKeys,
  ProductTypeValues,
  TOKEN_TYPES,
  TypeKeys
} from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import SuccessTransactionToast from "../../components/toasts/SuccessTransactionToast";
import BosonButton from "../../components/ui/BosonButton";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { CONFIG, DappConfig } from "../../lib/config";
import {
  SellerLandingPageParameters,
  UrlParameters
} from "../../lib/routing/parameters";
import { ProductRoutes } from "../../lib/routing/routes";
import { useChatStatus } from "../../lib/utils/hooks/chat/useChatStatus";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { saveItemInStorage } from "../../lib/utils/hooks/localstorage/useLocalStorage";
import { useCreateOffers } from "../../lib/utils/hooks/offer/useCreateOffers";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { getIpfsGatewayUrl } from "../../lib/utils/ipfs";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import {
  CreateProductWrapper,
  HelpWrapper,
  MultiStepsContainer,
  ProductLayoutContainer
} from "./CreateProductInner.styles";
import { createProductSteps, FIRST_STEP } from "./utils";
import { extractOfferTimestamps } from "./utils/dataValidator";
import { getTermsOfExchange } from "./utils/getTermsOfExchange";
import {
  getDisputePeriodDurationInMS,
  getResolutionPeriodDurationInMS
} from "./utils/helpers";
import { CreateProductSteps } from "./utils/index";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;

function onKeyPress(event: React.KeyboardEvent<HTMLFormElement>) {
  const isTargetTextArea = (event.target as any)?.type === "textarea";
  if (!isTargetTextArea && event.key === "Enter") {
    event.preventDefault();
  }
}
type GetProductV1MetadataProps = {
  contactPreference: string;
  offerUuid: string;
  productInformation: CreateProductForm["productInformation"];
  productAnimation: FileProps | undefined;
  externalUrl: string;
  licenseUrl: string;
  productMainImageLink: string | undefined;
  nftAttributes: {
    trait_type: string;
    value: string;
    display_type?: string;
  }[];
  additionalAttributes: {
    trait_type: string;
    value: string;
    display_type?: string;
  }[];
  createYourProfile: CreateProductForm["createYourProfile"];
  productType: CreateProductForm["productType"];
  visualImages: productV1.ProductBase["visuals_images"];
  shippingInfo: CreateProductForm["shippingInfo"];
  termsOfExchange: CreateProductForm["termsOfExchange"];
  supportedJurisdictions: Array<SupportedJuridiction>;
  redemptionPointUrl: string;
};
async function getProductV1Metadata({
  contactPreference,
  offerUuid,
  productInformation,
  productAnimation,
  externalUrl,
  licenseUrl,
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
}: GetProductV1MetadataProps): Promise<productV1.ProductV1Metadata> {
  const profileImage = createYourProfile?.logo?.[0];
  const coverImage = createYourProfile?.coverPicture?.[0];

  const sellerImages: productV1.ProductV1Metadata["seller"]["images"] = [
    {
      url: profileImage?.src || "",
      tag: "profile",
      height: profileImage?.height ?? undefined,
      width: profileImage?.width ?? undefined,
      type: profileImage?.type
    },
    {
      url: coverImage?.src || "",
      tag: "cover",
      height: coverImage?.height ?? undefined,
      width: coverImage?.width ?? undefined,
      type: coverImage?.type
    }
  ];

  return {
    schemaUrl: "https://schema.org/",
    uuid: offerUuid,
    name: productInformation.productTitle,
    description: `${productInformation.description}\n\nTerms for the Boson rNFT Voucher: ${licenseUrl}`,
    animationUrl: getIpfsGatewayUrl(productAnimation?.src || ""),
    animationMetadata: productAnimation
      ? {
          height: productAnimation.height ?? undefined,
          width: productAnimation.width ?? undefined,
          type: productAnimation.type
        }
      : undefined,
    externalUrl,
    licenseUrl,
    image: productMainImageLink ? productMainImageLink : "",
    type: MetadataType.PRODUCT_V1,
    attributes: [...nftAttributes, ...additionalAttributes],
    condition: /*tokenGating?.tokenGatingDesc ||*/ undefined,
    product: {
      uuid: uuid(),
      version: 1,
      title: productInformation.productTitle?.toString(),
      description: productInformation.description?.toString(),
      identification_sKU: productInformation.sku?.toString(),
      identification_productId: productInformation.id?.toString(),
      identification_productIdType: productInformation.idType?.toString(),
      productionInformation_brandName:
        productInformation.brandName?.toString() || createYourProfile.name,
      productionInformation_manufacturer:
        productInformation.manufacture?.toString(),
      productionInformation_manufacturerPartNumber:
        productInformation.manufactureModelName?.toString(),
      productionInformation_modelNumber:
        productInformation.partNumber?.toString(),
      productionInformation_materials: productInformation.materials?.split(","),
      details_category: productInformation.category.value?.toString(),
      details_subCategory: undefined, // no entry in the UI
      details_subCategory2: undefined, // no entry in the UI
      details_offerCategory: productType.productType.toUpperCase(),
      details_tags: productInformation.tags,
      details_sections: undefined, // no entry in the UI
      details_personalisation: undefined, // no entry in the UI
      visuals_images: visualImages,
      visuals_videos: undefined, // no entry in the UI
      packaging_packageQuantity: undefined, // no entry in the UI
      packaging_dimensions_length: shippingInfo.length?.toString(),
      packaging_dimensions_width: shippingInfo.width?.toString(),
      packaging_dimensions_height: shippingInfo.height?.toString(),
      packaging_dimensions_unit: shippingInfo.measurementUnit.value?.toString(),
      packaging_weight_value: shippingInfo?.weight?.toString() || "",
      packaging_weight_unit: shippingInfo?.weightUnit.value?.toString() || ""
    },
    seller: {
      defaultVersion: 1,
      name: createYourProfile.name,
      description: createYourProfile.description,
      externalUrl: createYourProfile.website,
      tokenId: undefined, // no entry in the UI
      contactLinks: [
        {
          url: createYourProfile.email,
          tag: "email"
        }
      ],
      images: sellerImages,
      contactPreference
    },
    exchangePolicy: {
      uuid: Date.now().toString(),
      version: 1,
      label: termsOfExchange.exchangePolicy.label,
      template:
        termsOfExchange.exchangePolicy.value === "fairExchangePolicy" // if there is data in localstorage, the exchangePolicy.value might be the old 'fairExchangePolicy'
          ? OPTIONS_EXCHANGE_POLICY[0].value
          : termsOfExchange.exchangePolicy.value || "",
      sellerContactMethod: CONFIG.defaultSellerContactMethod,
      disputeResolverContactMethod: `email to: ${CONFIG.defaultDisputeResolverContactMethod}`
    },
    shipping: {
      defaultVersion: 1,
      countryOfOrigin:
        /*TODO: NOTE: we might add it back in the future: shippingInfo.country?.label || */ "",
      supportedJurisdictions:
        supportedJurisdictions.length > 0 ? supportedJurisdictions : undefined,
      returnPeriod: shippingInfo.returnPeriod.toString(),
      redemptionPoint: redemptionPointUrl
    }
  };
}

type GetOfferDataFromMetadataProps = {
  coreSDK: CoreSDK;
  config: DappConfig;
  priceBN: BigNumber;
  sellerDeposit: BigNumber | string;
  buyerCancellationPenaltyValue: BigNumber | string;
  quantityAvailable: number;
  voucherRedeemableFromDateInMS: number;
  voucherRedeemableUntilDateInMS: number;
  voucherValidDurationInMS: number;
  validFromDateInMS: number;
  validUntilDateInMS: number;
  disputePeriodDurationInMS: number;
  resolutionPeriodDurationInMS: number;
  exchangeToken: Token | undefined;
};
async function getOfferDataFromMetadata(
  productV1Metadata: productV1.ProductV1Metadata,
  {
    coreSDK,
    config,
    priceBN,
    sellerDeposit,
    buyerCancellationPenaltyValue,
    quantityAvailable,
    voucherRedeemableFromDateInMS,
    voucherRedeemableUntilDateInMS,
    voucherValidDurationInMS,
    validFromDateInMS,
    validUntilDateInMS,
    disputePeriodDurationInMS,
    resolutionPeriodDurationInMS,
    exchangeToken
  }: GetOfferDataFromMetadataProps
): Promise<offers.CreateOfferArgs> {
  const metadataHash = await coreSDK.storeMetadata(productV1Metadata);

  const offerData: offers.CreateOfferArgs = {
    price: priceBN.toString(),
    sellerDeposit: sellerDeposit.toString(),
    buyerCancelPenalty: buyerCancellationPenaltyValue.toString(),
    quantityAvailable: quantityAvailable,
    voucherRedeemableFromDateInMS: voucherRedeemableFromDateInMS.toString(),
    voucherRedeemableUntilDateInMS: voucherRedeemableUntilDateInMS.toString(),
    voucherValidDurationInMS: voucherValidDurationInMS.toString(),
    validFromDateInMS: validFromDateInMS.toString(),
    validUntilDateInMS: validUntilDateInMS.toString(),
    disputePeriodDurationInMS: disputePeriodDurationInMS.toString(),
    resolutionPeriodDurationInMS: resolutionPeriodDurationInMS.toString(),
    exchangeToken: exchangeToken?.address || ethers.constants.AddressZero,
    disputeResolverId: config.envConfig.defaultDisputeResolverId,
    agentId: 0, // no agent
    metadataUri: `ipfs://${metadataHash}`,
    metadataHash: metadataHash,
    collectionIndex: "0"
  };
  return offerData;
}

function extractVisualImages(
  productImages: CreateProductForm["productImages"]
): productV1.ProductBase["visuals_images"] {
  const visualImages = Array.from(
    new Set(
      map(
        productImages,
        (v) =>
          v?.[0]?.src &&
          ({
            url: v?.[0]?.src,
            tag: "product_image",
            height: v?.[0]?.height,
            width: v?.[0]?.width,
            type: v?.[0]?.type,
            name: v?.[0]?.name
          } as productV1.ProductBase["visuals_images"][number])
      ).filter((n): n is productV1.ProductBase["visuals_images"][number] => !!n)
    ).values()
  );
  return visualImages;
}

interface Props {
  initial: CreateProductForm;
  showCreateProductDraftModal: () => void;
  setCreatedOffersIds: Dispatch<SetStateAction<string[]>>;
  isDraftModalClosed: boolean;
}
interface SupportedJuridiction {
  label: string;
  deliveryTime: string;
}

function CreateProductInner({
  initial,
  showCreateProductDraftModal,
  setCreatedOffersIds,
  isDraftModalClosed
}: Props) {
  const { config } = useConfigContext();
  const history = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useKeepQueryParamsNavigate();
  const { chatInitializationStatus } = useChatStatus();
  const [productVariant, setProductVariant] = useState<string>(
    initial?.productType?.productVariant || ProductTypeValues.oneItemType
  );
  const isMultiVariant = useMemo(
    () => productVariant === ProductTypeValues.differentVariants || false,
    [productVariant]
  );
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
  const { account: address } = useAccount();

  const { sellers, lens: lensProfiles } = useCurrentSellers();
  const { mutateAsync: createOffers } = useCreateOffers();
  const currentAssistant = sellers.find((seller) => {
    return seller?.assistant.toLowerCase() === address?.toLowerCase();
  });
  const contactPreference = currentAssistant?.metadata?.contactPreference ?? "";
  // lens profile of the current user
  const assistantLens: Profile | null =
    lensProfiles.find((lensProfile) => {
      return (
        getLensTokenIdDecimal(lensProfile?.id).toString() ===
        currentAssistant?.authTokenId
      );
    }) || null;

  const onViewMyItem = (id: string | null) => {
    hideModal();
    setCurrentStepWithHistory(FIRST_STEP);
    setIsPreviewVisible(false);
    const pathname = id
      ? generatePath(ProductRoutes.ProductDetail, {
          [UrlParameters.sellerId]: currentAssistant?.id || null,
          [UrlParameters.uuid]: id
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
    const metadataInfo = (await coreSDK.getMetadata(
      offerInfo.metadataUri
    )) as any;

    showModal(
      modalTypes.PRODUCT_CREATE_SUCCESS,
      {
        title: `Offer ${offerId}`,
        name: metadataInfo.name,
        message: "You have successfully created:",
        image: metadataInfo.image,
        price: offerInfo.price,
        offer: {
          id: offerInfo.id,
          createdAt: offerInfo.createdAt,
          price: offerInfo.price,
          sellerDeposit: offerInfo.sellerDeposit,
          protocolFee: offerInfo.protocolFee,
          agentFee: offerInfo.agentFee,
          agentId: offerInfo.agentId,
          buyerCancelPenalty: offerInfo.buyerCancelPenalty,
          quantityAvailable: offerInfo.quantityAvailable,
          quantityInitial: offerInfo.quantityInitial,
          validFromDate: offerInfo.validFromDate,
          validUntilDate: offerInfo.validUntilDate,
          voucherRedeemableFromDate: offerInfo.voucherRedeemableFromDate,
          voucherRedeemableUntilDate: offerInfo.voucherRedeemableUntilDate,
          disputePeriodDuration: offerInfo.disputePeriodDuration,
          voucherValidDuration: offerInfo.voucherValidDuration,
          resolutionPeriodDuration: offerInfo.resolutionPeriodDuration,
          metadataUri: offerInfo.metadataUri,
          metadataHash: offerInfo.metadataHash,
          voidedAt: offerInfo.voidedAt,
          disputeResolverId: offerInfo.disputeResolverId,
          seller: offerInfo.seller,
          exchangeToken: offerInfo.exchangeToken,
          metadata: {
            animationUrl: values.productAnimation?.[0]?.src,
            exchangePolicy: {
              label: OPTIONS_EXCHANGE_POLICY[0].label,
              template: OPTIONS_EXCHANGE_POLICY[0].value
            }
          },
          condition: offerInfo.condition ?? null
        },
        hasMultipleVariants: !!values.productVariants.variants.length,
        // these are the ones that we already had before
        onCreateNew: onCreateNew,
        onViewMyItem: () => onViewMyItem(metadataInfo.product?.uuid)
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
      isTokenGated,
      onChangeOneSetOfImages: setIsOneSetOfImages,
      isOneSetOfImages,
      config,
      coreSDK
    });
    return {
      currentStep:
        wizard?.[currentStep as keyof CreateProductSteps]?.ui || null,
      currentValidation:
        wizard?.[currentStep as keyof CreateProductSteps]?.validation || null,
      helpSection:
        wizard?.[currentStep as keyof CreateProductSteps]?.helpSection || null,
      wizardLength: keys(wizard).length - 1
    };
  }, [
    chatInitializationStatus,
    showCreateProductDraftModal,
    isDraftModalClosed,
    showInvalidRoleModal,
    isMultiVariant,
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
        trait_type: string;
        value: string;
      }> = productInformation.attributes.map(({ name, value }) => {
        return {
          trait_type: name || "",
          value: value || ""
        };
      });

      const supportedJurisdictions: Array<SupportedJuridiction> =
        shippingInfo.jurisdiction.reduce((prev, { region, time }) => {
          if (region.length === 0 || time.length === 0) {
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
        return attribute.trait_type.length > 0;
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

      const nftAttributes = [];
      nftAttributes.push({
        trait_type: ProductMetadataAttributeKeys["Token Type"],
        value: "BOSON rNFT"
      });
      nftAttributes.push({
        trait_type: ProductMetadataAttributeKeys["Redeemable At"],
        value: redemptionPointUrl
      });

      if (voucherRedeemableUntilDateInMS) {
        nftAttributes.push({
          trait_type: ProductMetadataAttributeKeys["Redeemable Until"],
          value: voucherRedeemableUntilDateInMS.toString(),
          display_type: "date"
        });
      } else if (voucherValidDurationInMS) {
        nftAttributes.push({
          trait_type: ProductMetadataAttributeKeys["Redeemable After X Days"],
          value: (voucherValidDurationInMS / 86400000).toString()
        });
      }
      if (assistantLens?.name || assistantLens?.handle) {
        nftAttributes.push({
          trait_type: ProductMetadataAttributeKeys["Seller"],
          value: assistantLens?.name || assistantLens?.handle
        });
      } else {
        nftAttributes.push({
          trait_type: ProductMetadataAttributeKeys["Seller"],
          value: createYourProfile.name
        });
      }

      // Be sure the uuid is unique (for all users).
      // Do NOT use Date.now() because nothing prevent 2 users to create 2 offers at the same time
      const offerUuid = uuid();

      // Ddd sellerId in the license and offer-uuid routes (if known)
      const externalUrl = currentAssistant
        ? `${redemptionPointUrl}/#/offer-uuid/${currentAssistant.id}/${offerUuid}`
        : `${redemptionPointUrl}/#/offer-uuid/${offerUuid}`;
      const licenseUrl = currentAssistant
        ? `${window.origin}/#/license/${currentAssistant.id}/${offerUuid}`
        : `${window.origin}/#/license/${offerUuid}`;

      const offersToCreate: offers.CreateOfferArgs[] = [];
      const productAnimation = values.productAnimation?.[0];
      if (isMultiVariant) {
        const { variants = [] } = values.productVariants;
        const variantsForMetadataCreation: Parameters<
          typeof productV1["createVariantProductMetadata"]
        >[1] = [];
        const visualImages: productV1.ProductBase["visuals_images"] = [];
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
        const productV1Metadata = await getProductV1Metadata({
          contactPreference,
          offerUuid,
          productInformation,
          productAnimation,
          externalUrl,
          licenseUrl,
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
        const metadatas = productV1.createVariantProductMetadata(
          productV1Metadata,
          variantsForMetadataCreation
        );

        if (!isOneSetOfImages) {
          // fix main variant image as it should be the variant's thumbnail
          metadatas.forEach((variantMetadata, index) => {
            const productImages =
              productVariantsImages?.[Number(index)]?.productImages;
            if (productImages?.thumbnail?.[0]?.src) {
              variantMetadata.image = productImages.thumbnail[0].src;
            } else {
              // this else clause should never occur
              if (variantMetadata.productOverrides?.visuals_images?.[0]?.url) {
                variantMetadata.image =
                  variantMetadata.productOverrides?.visuals_images[0].url;
              }
            }
          });
        }
        // Fix description as the licenseUrl has changed
        metadatas.forEach((variantMetadata) => {
          variantMetadata.description = `${productInformation.description}\n\nTerms for the Boson rNFT Voucher: ${variantMetadata.licenseUrl}`;
        });
        const offerDataPromises: Promise<offers.CreateOfferArgs>[] =
          metadatas.map((metadata, index) => {
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
            return getOfferDataFromMetadata(metadata, {
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
        const visualImages = extractVisualImages(productImages);
        const productV1Metadata = await getProductV1Metadata({
          contactPreference,
          offerUuid,
          productInformation,
          productAnimation,
          externalUrl,
          licenseUrl,
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
        const price = coreTermsOfSale.price;
        const decimals = Number(exchangeToken?.decimals || 18);
        const { priceBN, buyerCancellationPenaltyValue, sellerDeposit } =
          getTermsOfExchange({
            termsOfExchange,
            price,
            decimals
          });

        const offerData = await getOfferDataFromMetadata(productV1Metadata, {
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
      }
      const isTokenGated = productType?.tokenGatedOffer === "true";
      await createOffers({
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
            detailedErrorMessage: extractUserFriendlyError(error)
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
        const { decimals } = await coreSDK.getExchangeTokenInfo(tokenContract);
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
          data={CREATE_PRODUCT_STEPS(isMultiVariant, isTokenGated)}
          active={currentStep}
          callback={handleClickStep}
          disableInactiveSteps
        />
      </MultiStepsContainer>

      <ProductLayoutContainer isPreviewVisible={isPreviewVisible}>
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
                      seller={currentAssistant as any}
                      isMultiVariant={isMultiVariant}
                      isOneSetOfImages={isOneSetOfImages}
                      hasMultipleVariants={
                        !!values.productVariants.variants.length
                      }
                      decimals={decimals}
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

export default CreateProductInner;
