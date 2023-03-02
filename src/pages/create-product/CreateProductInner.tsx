/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CoreSDK,
  IpfsMetadataStorage,
  MetadataType,
  offers,
  productV1,
  subgraph
} from "@bosonprotocol/react-kit";
import { parseUnits } from "@ethersproject/units";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import map from "lodash/map";
import { useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { useAccount } from "wagmi";
dayjs.extend(localizedFormat);

import { BigNumber, ethers } from "ethers";
import { useEffect } from "react";

import { Token } from "../../components/convertion-rate/ConvertionRateContext";
import { FileProps } from "../../components/form/Upload/WithUploadToIpfs";
import { authTokenTypes } from "../../components/modal/components/CreateProfile/Lens/const";
import {
  getLensCoverPictureUrl,
  getLensProfilePictureUrl,
  getLensTokenIdDecimal
} from "../../components/modal/components/CreateProfile/Lens/utils";
import { useModal } from "../../components/modal/useModal";
import Help from "../../components/product/Help";
import Preview from "../../components/product/Preview";
import {
  CREATE_PRODUCT_STEPS,
  CreateProductForm,
  TOKEN_TYPES
} from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import SuccessTransactionToast from "../../components/toasts/SuccessTransactionToast";
import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { ProductRoutes } from "../../lib/routing/routes";
import { fetchIpfsBase64Media } from "../../lib/utils/base64";
import { useChatStatus } from "../../lib/utils/hooks/chat/useChatStatus";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useAddPendingTransaction } from "../../lib/utils/hooks/transactions/usePendingTransactions";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { saveItemInStorage } from "../../lib/utils/hooks/useLocalStorage";
import { getImageMetadata } from "../../lib/utils/images";
import { getIpfsGatewayUrl } from "../../lib/utils/ipfs";
import { fixformattedString } from "../../lib/utils/number";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import {
  CreateProductWrapper,
  HelpWrapper,
  MultiStepsContainer,
  ProductLayoutContainer
} from "./CreateProductInner.styles";
import { createProductSteps, FIRST_STEP, poll } from "./utils";
import { buildCondition } from "./utils/buildCondition";
import { validateDates } from "./utils/dataValidator";
import { CreateProductSteps } from "./utils/index";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;

function onKeyPress(event: React.KeyboardEvent<HTMLFormElement>) {
  const isTargetTextArea = (event.target as any)?.type === "textarea";
  if (!isTargetTextArea && event.key === "Enter") {
    event.preventDefault();
  }
}
type GetProductV1MetadataProps = {
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
  operatorLens: Profile | null;
  profileImage: FileProps | undefined;
  termsOfExchange: CreateProductForm["termsOfExchange"];
  supportedJurisdictions: Array<SupportedJuridiction>;
  commonTermsOfSale:
    | CreateProductForm["coreTermsOfSale"]
    | CreateProductForm["variantsCoreTermsOfSale"];
  ipfsMetadataStorage: IpfsMetadataStorage;
};
async function getProductV1Metadata({
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
  operatorLens,
  profileImage,
  termsOfExchange,
  supportedJurisdictions,
  commonTermsOfSale,
  ipfsMetadataStorage
}: GetProductV1MetadataProps): Promise<productV1.ProductV1Metadata> {
  let sellerImages: productV1.ProductV1Metadata["seller"]["images"] = [
    {
      url: profileImage?.src || "",
      tag: "profile",
      height: profileImage?.height,
      width: profileImage?.width,
      name: profileImage?.name,
      type: profileImage?.type
    }
  ];
  if (CONFIG.lens.enabled) {
    const ipfsLinks = [];
    const pictureUrl = operatorLens
      ? getLensProfilePictureUrl(operatorLens as Profile) || ""
      : "";
    ipfsLinks.push(pictureUrl);
    const coverUrl = operatorLens
      ? getLensCoverPictureUrl(operatorLens as Profile) || ""
      : "";
    ipfsLinks.push(coverUrl);
    const [pictureBase64, coverBase64] = await fetchIpfsBase64Media(
      ipfsLinks,
      ipfsMetadataStorage
    );
    const [pictureMetadata, coverMetadata] = await Promise.all([
      getImageMetadata(pictureBase64),
      getImageMetadata(coverBase64)
    ]);
    sellerImages = [
      {
        url: operatorLens
          ? getLensProfilePictureUrl(operatorLens as Profile) || ""
          : "",
        tag: "profile",
        ...pictureMetadata
      },
      {
        url: operatorLens
          ? getLensCoverPictureUrl(operatorLens as Profile) || ""
          : "",
        tag: "cover",
        ...coverMetadata
      }
    ];
  }
  return {
    schemaUrl: "https://schema.org/",
    uuid: offerUuid,
    name: productInformation.productTitle,
    description: `${productInformation.description}\n\nTerms for the Boson rNFT Voucher: ${licenseUrl}`,
    animationUrl: getIpfsGatewayUrl(productAnimation?.src || ""),
    animationMetadata: productAnimation
      ? {
          height: productAnimation.height,
          width: productAnimation.width,
          type: productAnimation.type
        }
      : undefined,
    externalUrl,
    licenseUrl,
    image: productMainImageLink ? productMainImageLink : "",
    type: MetadataType.PRODUCT_V1,
    attributes: [...nftAttributes, ...additionalAttributes],
    condition: commonTermsOfSale?.tokenGatingDesc || undefined,
    product: {
      uuid: uuid(),
      version: 1,
      title: productInformation.productTitle,
      description: productInformation.description,
      identification_sKU: productInformation.sku,
      identification_productId: productInformation.id,
      identification_productIdType: productInformation.idType,
      productionInformation_brandName:
        productInformation.brandName || createYourProfile.name,
      productionInformation_manufacturer: productInformation.manufacture,
      productionInformation_manufacturerPartNumber:
        productInformation.manufactureModelName,
      productionInformation_modelNumber: productInformation.partNumber,
      productionInformation_materials: productInformation.materials?.split(","),
      details_category: productInformation.category.value,
      details_subCategory: undefined, // no entry in the UI
      details_subCategory2: undefined, // no entry in the UI
      details_offerCategory: productType.productType.toUpperCase(),
      details_tags: productInformation.tags,
      details_sections: undefined, // no entry in the UI
      details_personalisation: undefined, // no entry in the UI
      visuals_images: visualImages,
      visuals_videos: undefined, // no entry in the UI
      packaging_packageQuantity: undefined, // no entry in the UI
      packaging_dimensions_length: shippingInfo.length,
      packaging_dimensions_width: shippingInfo.width,
      packaging_dimensions_height: shippingInfo.height,
      packaging_dimensions_unit: shippingInfo.measurementUnit.value,
      packaging_weight_value: shippingInfo?.weight || "",
      packaging_weight_unit: shippingInfo?.weightUnit.value || ""
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
      images: sellerImages
    },
    exchangePolicy: {
      uuid: Date.now().toString(),
      version: 1,
      label: termsOfExchange.exchangePolicy.value,
      template: termsOfExchange.exchangePolicy.value,
      sellerContactMethod: CONFIG.defaultSellerContactMethod,
      disputeResolverContactMethod: `email to: ${CONFIG.defaultDisputeResolverContactMethod}`
    },
    shipping: {
      defaultVersion: 1,
      countryOfOrigin: shippingInfo.country.label || "",
      supportedJurisdictions:
        supportedJurisdictions.length > 0 ? supportedJurisdictions : undefined,
      returnPeriod: shippingInfo.returnPeriod.toString()
    }
  };
}

type GetOfferDataFromMetadataProps = {
  coreSDK: CoreSDK;
  priceBN: BigNumber;
  sellerDeposit: BigNumber;
  buyerCancellationPenaltyValue: BigNumber;
  quantityAvailable: number;
  voucherRedeemableFromDateInMS: number;
  voucherRedeemableUntilDateInMS: number;
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
    priceBN,
    sellerDeposit,
    buyerCancellationPenaltyValue,
    quantityAvailable,
    voucherRedeemableFromDateInMS,
    voucherRedeemableUntilDateInMS,
    validFromDateInMS,
    validUntilDateInMS,
    disputePeriodDurationInMS,
    resolutionPeriodDurationInMS,
    exchangeToken
  }: GetOfferDataFromMetadataProps
): Promise<offers.CreateOfferArgs> {
  const metadataHash = await coreSDK.storeMetadata(productV1Metadata);

  const offerData = {
    price: priceBN.toString(),
    sellerDeposit: sellerDeposit.toString(),
    buyerCancelPenalty: buyerCancellationPenaltyValue.toString(),
    quantityAvailable: quantityAvailable,
    voucherRedeemableFromDateInMS: voucherRedeemableFromDateInMS.toString(),
    voucherRedeemableUntilDateInMS: voucherRedeemableUntilDateInMS.toString(),
    voucherValidDurationInMS: 0,
    validFromDateInMS: validFromDateInMS.toString(),
    validUntilDateInMS: validUntilDateInMS.toString(),
    disputePeriodDurationInMS: disputePeriodDurationInMS.toString(),
    resolutionPeriodDurationInMS: resolutionPeriodDurationInMS.toString(),
    exchangeToken: exchangeToken?.address || ethers.constants.AddressZero,
    disputeResolverId: CONFIG.defaultDisputeResolverId,
    agentId: 0, // no agent
    metadataUri: `ipfs://${metadataHash}`,
    metadataHash: metadataHash
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
  showInvalidRoleModal: () => void;
  isDraftModalClosed: boolean;
}
interface SupportedJuridiction {
  label: string;
  deliveryTime: string;
}

function CreateProductInner({
  initial,
  showCreateProductDraftModal,
  showInvalidRoleModal,
  isDraftModalClosed
}: Props) {
  const history = useNavigate();
  const location = useLocation();

  const navigate = useKeepQueryParamsNavigate();
  const { chatInitializationStatus } = useChatStatus();
  const [productVariant, setProductVariant] = useState<string>(
    initial?.productType?.productVariant || "oneItemType"
  );
  const isMultiVariant = useMemo(
    () => productVariant === "differentVariants" || false,
    [productVariant]
  );
  const [currentStep, setCurrentStep] = useState<number>(
    location?.state?.step || FIRST_STEP
  );
  const [decimals, setDecimals] = useState<number | undefined>(undefined);

  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const { showModal, modalTypes, hideModal } = useModal();
  const coreSDK = useCoreSDK();

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
      history(".", { replace: true, state: { ...location.state, step } });
      window.history.pushState(null, "", window.location.href);
    },
    [history, location, setCurrentStep]
  );

  const onCreateNewProject = () => {
    hideModal();
    setCurrentStepWithHistory(FIRST_STEP);
    setIsPreviewVisible(false);
  };

  const onViewMyItem = (id: string | null) => {
    hideModal();
    setCurrentStepWithHistory(FIRST_STEP);
    setIsPreviewVisible(false);
    const pathname = id
      ? generatePath(ProductRoutes.ProductDetail, {
          [UrlParameters.uuid]: id
        })
      : generatePath(ProductRoutes.Root);
    navigate({ pathname });
  };
  const [isOneSetOfImages, setIsOneSetOfImages] = useState<boolean>(false);
  const { address } = useAccount();

  const { sellers, lens: lensProfiles } = useCurrentSellers();
  const addPendingTransaction = useAddPendingTransaction();

  const hasSellerAccount = !!sellers?.length;

  const currentOperator = sellers.find((seller) => {
    return seller?.operator.toLowerCase() === address?.toLowerCase();
  });
  // lens profile of the current user
  const operatorLens: Profile | null =
    lensProfiles.find((lensProfile) => {
      return (
        getLensTokenIdDecimal(lensProfile.id).toString() ===
        currentOperator?.authTokenId
      );
    }) || null;

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
            animationUrl: values.productAnimation?.[0]?.src
          },
          condition: offerInfo.condition ?? null
        },
        hasMultipleVariants: !!values.productVariants.variants.length,
        // these are the ones that we already had before
        onCreateNewProject: onCreateNewProject,
        onViewMyItem: () => onViewMyItem(metadataInfo.product?.uuid)
      },
      "auto"
    );
  };
  const formikRef = useRef<FormikProps<CreateProductForm>>(null);
  const ipfsMetadataStorage = useIpfsStorage();
  const wizardStep = useMemo(() => {
    const wizard = createProductSteps({
      setIsPreviewVisible,
      chatInitializationStatus,
      showCreateProductDraftModal,
      isDraftModalClosed,
      showInvalidRoleModal,
      isMultiVariant,
      onChangeOneSetOfImages: setIsOneSetOfImages,
      isOneSetOfImages
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
    isOneSetOfImages,
    currentStep
  ]);
  const handleNextForm = useCallback(() => {
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    }
    if (currentStep < wizardStep.wizardLength) {
      const nextStep = currentStep + 1;
      setCurrentStepWithHistory(nextStep);
    }
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

    const profileImage = createYourProfile?.logo?.[0];
    const productMainImageLink: string | undefined =
      isMultiVariant && !isOneSetOfImages
        ? productVariantsImages?.find((variant) => {
            return variant.productImages?.thumbnail?.[0]?.src;
          })?.productImages?.thumbnail?.[0]?.src
        : productImages?.thumbnail?.[0]?.src;

    const productAttributes: Array<{
      trait_type: string;
      value: string;
    }> = productInformation.attributes.map(
      ({ name, value }: { name: string; value: string }) => {
        return {
          trait_type: name,
          value: value || ""
        };
      }
    );

    const supportedJurisdictions: Array<SupportedJuridiction> =
      shippingInfo.jurisdiction.reduce(
        (
          prev: Array<SupportedJuridiction>,
          { region, time }: { region: string; time: string }
        ) => {
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
        },
        []
      );

    // filter empty attributes
    const additionalAttributes = productAttributes.filter((attribute) => {
      return attribute.trait_type.length > 0;
    });

    try {
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
      const exchangeToken = CONFIG.defaultTokens.find(
        (n: Token) => n.symbol === exchangeSymbol
      );

      const commonTermsOfSale = isMultiVariant
        ? values.variantsCoreTermsOfSale
        : values.coreTermsOfSale;

      const { offerValidityPeriod, redemptionPeriod } = commonTermsOfSale;

      const {
        voucherRedeemableFromDateInMS,
        voucherRedeemableUntilDateInMS,
        validFromDateInMS,
        validUntilDateInMS
      } = validateDates({
        offerValidityPeriod: offerValidityPeriod,
        redemptionPeriod: redemptionPeriod
      });

      const disputePeriodDurationInMS =
        parseInt(termsOfExchange.disputePeriod) * 24 * 3600 * 1000; // day to msec
      const resolutionPeriodDurationInMS =
        parseInt(CONFIG.defaultDisputeResolutionPeriodDays) * 24 * 3600 * 1000; // day to msec

      const nftAttributes = [];
      nftAttributes.push({ trait_type: "Token Type", value: "BOSON rNFT" });
      nftAttributes.push({
        trait_type: "Redeemable At",
        value: redemptionPointUrl
      });
      nftAttributes.push({
        trait_type: "Redeemable Until",
        value: voucherRedeemableUntilDateInMS.toString(),
        display_type: "date"
      });
      if (CONFIG.lens.enabled) {
        if (operatorLens?.name || operatorLens?.handle) {
          nftAttributes.push({
            trait_type: "Seller",
            value: operatorLens?.name || operatorLens?.handle
          });
        }
      } else {
        nftAttributes.push({
          trait_type: "Seller",
          value: createYourProfile.name
        });
      }

      // Be sure the uuid is unique (for all users).
      // Do NOT use Date.now() because nothing prevent 2 users to create 2 offers at the same time
      const offerUuid = uuid();

      const externalUrl = `${redemptionPointUrl}/#/offer-uuid/${offerUuid}`;
      const licenseUrl = `${window.origin}/#/license/${offerUuid}`;

      const offersToCreate: offers.CreateOfferArgs[] = [];
      const productAnimation = values.productAnimation?.[0];
      if (isMultiVariant) {
        const { variants = [] } = values.productVariants;
        const variantsForMetadataCreation: Parameters<
          typeof productV1["createVariantProductMetadata"]
        >[1] = [];
        const variations: productV1.ProductV1Variant = [];
        const visualImages: productV1.ProductBase["visuals_images"] = [];
        const allVariationsWithSameImages =
          values.imagesSpecificOrAll?.value === "all";
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
              type: "Size",
              option: size || "-"
            },
            {
              type: "Color",
              option: color || "-"
            }
          ];
          variations.push(...typeOptions);

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
              productVariant: typeOptions,
              productOverrides: {
                visuals_images: visualImages
              }
            });
          }
        }
        const productV1Metadata = await getProductV1Metadata({
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
          operatorLens,
          profileImage,
          termsOfExchange,
          supportedJurisdictions,
          commonTermsOfSale,
          ipfsMetadataStorage
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
            const exchangeToken = CONFIG.defaultTokens.find(
              (n: Token) => n.symbol === variants[index].currency.label
            );
            const price = variants[index].price;
            const priceBN = parseUnits(
              price < 0.1 ? fixformattedString(price) : price.toString(),
              Number(exchangeToken?.decimals || 18)
            );

            // TODO: change when more than percentage unit
            const buyerCancellationPenaltyValue = priceBN
              .mul(parseFloat(termsOfExchange.buyerCancellationPenalty) * 1000)
              .div(100 * 1000);

            // TODO: change when more than percentage unit
            const sellerDeposit = priceBN
              .mul(parseFloat(termsOfExchange.sellerDeposit) * 1000)
              .div(100 * 1000);
            return getOfferDataFromMetadata(metadata, {
              coreSDK,
              priceBN,
              sellerDeposit,
              buyerCancellationPenaltyValue,
              quantityAvailable: variants[index].quantity,
              voucherRedeemableFromDateInMS,
              voucherRedeemableUntilDateInMS,
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
          operatorLens,
          profileImage,
          termsOfExchange,
          supportedJurisdictions,
          commonTermsOfSale,
          ipfsMetadataStorage
        });
        const price = coreTermsOfSale.price;
        const priceBN = parseUnits(
          price < 0.1 ? fixformattedString(price) : price.toString(),
          Number(exchangeToken?.decimals || 18)
        );

        // TODO: change when more than percentage unit
        const buyerCancellationPenaltyValue = priceBN
          .mul(
            Math.round(
              parseFloat(termsOfExchange.buyerCancellationPenalty) * 1000
            )
          )
          .div(100 * 1000);

        // TODO: change when more than percentage unit
        const sellerDeposit = priceBN
          .mul(Math.round(parseFloat(termsOfExchange.sellerDeposit) * 1000))
          .div(100 * 1000);

        const offerData = await getOfferDataFromMetadata(productV1Metadata, {
          coreSDK,
          priceBN,
          sellerDeposit,
          buyerCancellationPenaltyValue,
          quantityAvailable: coreTermsOfSale.quantity,
          voucherRedeemableFromDateInMS,
          voucherRedeemableUntilDateInMS,
          validFromDateInMS,
          validUntilDateInMS,
          disputePeriodDurationInMS,
          resolutionPeriodDurationInMS,
          exchangeToken
        });
        offersToCreate.push(offerData);
      }

      showModal("WAITING_FOR_CONFIRMATION");
      const isMetaTx = Boolean(coreSDK.isMetaTxConfigSet && address);
      const seller = address
        ? {
            operator: address,
            admin: address,
            treasury: address,
            clerk: address,
            contractUri: "ipfs://sample",
            royaltyPercentage: "0",
            authTokenId: "0",
            authTokenType: authTokenTypes.NONE
          }
        : null;
      const isTokenGated = commonTermsOfSale.tokenGatedOffer.value === "true";
      let txResponse;
      if (isMultiVariant) {
        if (!hasSellerAccount && seller) {
          if (isMetaTx) {
            // createSeller with meta-transaction
            const nonce = Date.now();
            const { r, s, v, functionName, functionSignature } =
              await coreSDK.signMetaTxCreateSeller({
                createSellerArgs: seller,
                nonce
              });
            txResponse = await coreSDK.relayMetaTransaction({
              functionName,
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
              nonce
            });
          } else {
            txResponse = await coreSDK.createSeller(seller);
          }
          showModal("TRANSACTION_SUBMITTED", {
            action: "Create seller",
            txHash: txResponse.hash
          });
          addPendingTransaction({
            type: subgraph.EventType.SellerCreated,
            hash: txResponse.hash,
            isMetaTx,
            accountType: "Seller"
          });
          await txResponse.wait();
          showModal("WAITING_FOR_CONFIRMATION");
        }
        if (isMetaTx) {
          // createOfferBatch with meta-transaction
          const nonce = Date.now();
          const { r, s, v, functionName, functionSignature } =
            await coreSDK.signMetaTxCreateOfferBatch({
              createOffersArgs: offersToCreate,
              nonce
            });
          txResponse = await coreSDK.relayMetaTransaction({
            functionName,
            functionSignature,
            sigR: r,
            sigS: s,
            sigV: v,
            nonce
          });
        } else {
          txResponse = await coreSDK.createOfferBatch(offersToCreate);
        }
        showModal("TRANSACTION_SUBMITTED", {
          action: "Create offer with variants",
          txHash: txResponse.hash
        });
        addPendingTransaction({
          type: subgraph.EventType.OfferCreated,
          hash: txResponse.hash,
          isMetaTx,
          accountType: "Seller"
        });
        const txReceipt = await txResponse.wait();
        const offerIds = coreSDK.getCreatedOfferIdsFromLogs(txReceipt.logs);

        if (isTokenGated) {
          showModal("WAITING_FOR_CONFIRMATION");
          if (
            commonTermsOfSale?.tokenContract &&
            commonTermsOfSale.tokenType?.value === TOKEN_TYPES[0].value
          ) {
            try {
              const { decimals: decimalsLocal } =
                await coreSDK.getExchangeTokenInfo(
                  commonTermsOfSale.tokenContract
                );
              setDecimals(decimalsLocal);
            } catch (error) {
              setDecimals(undefined);
            }
          }
          const condition = buildCondition(commonTermsOfSale, decimals);

          if (isMetaTx) {
            const nonce = Date.now();
            const { r, s, v, functionName, functionSignature } =
              await coreSDK.signMetaTxCreateGroup({
                createGroupArgs: { offerIds, ...condition },
                nonce
              });
            txResponse = await coreSDK.relayMetaTransaction({
              functionName,
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
              nonce
            });
          } else {
            txResponse = await coreSDK.createGroup({ offerIds, ...condition });
          }
          showModal("TRANSACTION_SUBMITTED", {
            action: "Create condition group for offers",
            txHash: txResponse.hash
          });
          await txResponse.wait();
        }
        let createdOffers: OfferFieldsFragment[] | null = null;
        await poll(
          async () => {
            createdOffers = (
              await Promise.all(
                offerIds.map((offerId) =>
                  coreSDK.getOfferById(offerId as string)
                )
              )
            ).filter((offer) => !!offer);
            return createdOffers;
          },
          (offers) => {
            return offers.length !== offerIds.length;
          },
          500
        );
        const [firstOffer] = createdOffers as unknown as OfferFieldsFragment[];
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
      } else {
        const [offerData] = offersToCreate;
        if (isMetaTx) {
          // meta-transaction
          if (!hasSellerAccount && seller) {
            // createSeller with meta-transaction
            const nonce = Date.now();
            const { r, s, v, functionName, functionSignature } =
              await coreSDK.signMetaTxCreateSeller({
                createSellerArgs: seller,
                nonce
              });
            const createSellerResponse = await coreSDK.relayMetaTransaction({
              functionName,
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
              nonce
            });
            showModal("TRANSACTION_SUBMITTED", {
              action: "Create seller",
              txHash: createSellerResponse.hash
            });
            addPendingTransaction({
              type: subgraph.EventType.SellerCreated,
              hash: createSellerResponse.hash,
              isMetaTx,
              accountType: "Seller"
            });
            await createSellerResponse.wait();
            showModal("WAITING_FOR_CONFIRMATION");
          }
          // createOffer with meta-transaction
          const nonce = Date.now();
          if (!isTokenGated) {
            const { r, s, v, functionName, functionSignature } =
              await coreSDK.signMetaTxCreateOffer({
                createOfferArgs: offerData,
                nonce
              });
            txResponse = await coreSDK.relayMetaTransaction({
              functionName,
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
              nonce
            });
          } else {
            if (
              commonTermsOfSale?.tokenContract &&
              commonTermsOfSale.tokenType?.value === TOKEN_TYPES[0].value
            ) {
              try {
                const { decimals: decimalsLocal } =
                  await coreSDK.getExchangeTokenInfo(
                    commonTermsOfSale.tokenContract
                  );
                setDecimals(decimalsLocal);
              } catch (error) {
                setDecimals(undefined);
              }
            }
            const condition = buildCondition(commonTermsOfSale, decimals);
            const { r, s, v, functionName, functionSignature } =
              await coreSDK.signMetaTxCreateOfferWithCondition({
                offerToCreate: offerData,
                condition,
                nonce
              });
            txResponse = await coreSDK.relayMetaTransaction({
              functionName,
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
              nonce
            });
          }
        } else {
          if (isTokenGated) {
            if (
              commonTermsOfSale?.tokenContract &&
              commonTermsOfSale.tokenType?.value === TOKEN_TYPES[0].value
            ) {
              try {
                const { decimals: decimalsLocal } =
                  await coreSDK.getExchangeTokenInfo(
                    commonTermsOfSale.tokenContract
                  );

                setDecimals(decimalsLocal);
              } catch (error) {
                setDecimals(undefined);
              }
            }
            const condition = buildCondition(commonTermsOfSale, decimals);
            txResponse =
              !hasSellerAccount && seller
                ? await coreSDK.createSellerAndOfferWithCondition(
                    seller,
                    offerData,
                    condition
                  )
                : await coreSDK.createOfferWithCondition(offerData, condition);
          } else {
            txResponse =
              !hasSellerAccount && seller
                ? await coreSDK.createSellerAndOffer(seller, offerData)
                : await coreSDK.createOffer(offerData);
          }
        }
        showModal("TRANSACTION_SUBMITTED", {
          action: "Create offer",
          txHash: txResponse.hash
        });

        addPendingTransaction({
          type: subgraph.EventType.OfferCreated,
          hash: txResponse.hash,
          isMetaTx,
          accountType: "Seller"
        });

        if (!hasSellerAccount && seller) {
          addPendingTransaction({
            type: subgraph.EventType.SellerCreated,
            hash: txResponse.hash,
            isMetaTx,
            accountType: "Seller"
          });
        }

        const txReceipt = await txResponse.wait();
        const offerId = coreSDK.getCreatedOfferIdFromLogs(txReceipt.logs);
        let createdOffer: OfferFieldsFragment | null = null;
        await poll(
          async () => {
            createdOffer = await coreSDK.getOfferById(offerId as string);
            return createdOffer;
          },
          (offer) => {
            return !offer;
          },
          500
        );
        if (!createdOffer) {
          return;
        }
        toast((t) => (
          <SuccessTransactionToast
            t={t}
            action={`Created offer: ${createdOffer?.metadata?.name}`}
            onViewDetails={() => {
              handleOpenSuccessModal({
                offerInfo: createdOffer || ({} as subgraph.OfferFieldsFragment),
                values
              });
            }}
          />
        ));
      }

      hideModal();
    } catch (error: any) {
      // TODO: FAILURE MODAL
      console.error("error->", error.errors ?? error);
      showModal("CONFIRMATION_FAILED");
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

      return {
        ...values,
        [coreTermsOfSaleKey]: {
          ...values[coreTermsOfSaleKey],
          redemptionPeriod:
            values?.[coreTermsOfSaleKey]?.redemptionPeriod?.map((d: Dayjs) =>
              dayjs(d).format()
            ) ?? [],
          offerValidityPeriod:
            values?.[coreTermsOfSaleKey]?.offerValidityPeriod?.map((d: Dayjs) =>
              dayjs(d).format()
            ) ?? []
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
    const coreTermsOfSaleKey = isMultiVariant
      ? "variantsCoreTermsOfSale"
      : "coreTermsOfSale";
    const tokenContract = values?.[coreTermsOfSaleKey]?.tokenContract;
    const tokenType = values?.[coreTermsOfSaleKey]?.tokenType;

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
          data={CREATE_PRODUCT_STEPS(isMultiVariant)}
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
            if (productVariant !== values?.productType?.productVariant) {
              setProductVariant(values?.productType?.productVariant);
            }
            getDecimalOnPreview(values);

            return (
              <Form onKeyPress={onKeyPress}>
                {isPreviewVisible ? (
                  <Preview
                    togglePreview={setIsPreviewVisible}
                    seller={currentOperator as any}
                    isMultiVariant={isMultiVariant}
                    isOneSetOfImages={isOneSetOfImages}
                    hasMultipleVariants={
                      !!values.productVariants.variants.length
                    }
                    decimals={decimals}
                  />
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
