/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CoreSDK,
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { generatePath } from "react-router-dom";
import uuid from "react-uuid";
import { useAccount } from "wagmi";
dayjs.extend(localizedFormat);

import { BigNumber, ethers } from "ethers";

import { Token } from "../../components/convertion-rate/ConvertionRateContext";
import { authTokenTypes } from "../../components/modal/components/CreateProfile/Lens/const";
import {
  getLensCoverPictureUrl,
  getLensEmail,
  getLensProfilePictureUrl,
  getLensTokenIdDecimal,
  getLensWebsite
} from "../../components/modal/components/CreateProfile/Lens/utils";
import { useModal } from "../../components/modal/useModal";
import Help from "../../components/product/Help";
import Preview from "../../components/product/Preview";
import {
  CREATE_PRODUCT_STEPS,
  CreateProductForm
} from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import SuccessTransactionToast from "../../components/toasts/SuccessTransactionToast";
import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { OffersRoutes } from "../../lib/routing/routes";
import { useChatStatus } from "../../lib/utils/hooks/chat/useChatStatus";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { saveItemInStorage } from "../../lib/utils/hooks/useLocalStorage";
import { fixformattedString } from "../../lib/utils/number";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import {
  CreateProductWrapper,
  HelpWrapper,
  ProductLayoutContainer
} from "./CreateProductInner.styles";
import { createProductSteps, FIRST_STEP, poll } from "./utils";
import { ValidateDates } from "./utils/dataValidator";
import { CreateProductSteps } from "./utils/index";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;

function onKeyPress(event: React.KeyboardEvent<HTMLFormElement>) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
}
type GetProductV1MetadataProps = {
  offerUuid: string;
  productInformation: CreateProductForm["productInformation"];
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
  profileImageLink: string | undefined;
  termsOfExchange: CreateProductForm["termsOfExchange"];
  supportedJurisdictions: Array<SupportedJuridiction>;
};
function getProductV1Metadata({
  offerUuid,
  productInformation,
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
  profileImageLink,
  termsOfExchange,
  supportedJurisdictions
}: GetProductV1MetadataProps): productV1.ProductV1Metadata {
  return {
    schemaUrl: "https://schema.org/",
    uuid: offerUuid,
    name: productInformation.productTitle,
    description: `${productInformation.description}\n\nTerms for the Boson rNFT Voucher: ${licenseUrl}`,
    externalUrl,
    licenseUrl,
    image: productMainImageLink ? `ipfs://${productMainImageLink}` : "",
    type: MetadataType.PRODUCT_V1,
    attributes: [...nftAttributes, ...additionalAttributes],
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
    seller: CONFIG.lens.enabled
      ? ({
          defaultVersion: 1,
          name: operatorLens?.name || "",
          description: operatorLens?.bio || "",
          externalUrl: operatorLens
            ? getLensWebsite(operatorLens as Profile) || ""
            : "",
          tokenId: operatorLens
            ? getLensTokenIdDecimal(operatorLens.id).toString()
            : "0",
          images: [
            {
              url: operatorLens
                ? getLensProfilePictureUrl(operatorLens as Profile) || ""
                : "",
              tag: "profile"
            },
            {
              url: operatorLens
                ? getLensCoverPictureUrl(operatorLens as Profile) || ""
                : "",
              tag: "cover"
            }
          ],
          contactLinks: [
            {
              url: operatorLens
                ? getLensEmail(operatorLens as Profile) || ""
                : "",
              tag: "email"
            }
          ]
        } as any)
      : ({
          defaultVersion: 1,
          name: createYourProfile.name,
          description: createYourProfile.description,
          externalUrl: createYourProfile.website,
          tokenId: undefined, // no entry in the UI
          images: [
            {
              url: profileImageLink,
              tag: "profile"
            }
          ],
          contactLinks: [
            {
              url: createYourProfile.email,
              tag: "email"
            }
          ]
        } as any),
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
  sellerCancellationPenaltyValue: BigNumber;
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
    sellerCancellationPenaltyValue,
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
    sellerDeposit: sellerCancellationPenaltyValue.toString(),
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
          v?.[0]?.src && {
            url: v?.[0]?.src,
            tag: "product_image"
          }
      ).filter(
        (
          n
        ): n is {
          url: string;
          tag: string;
        } => !!n
      )
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
  const navigate = useKeepQueryParamsNavigate();
  const { chatInitializationStatus } = useChatStatus();
  const [productVariant, setProductVariant] = useState<string>(
    initial?.productType?.productVariant || "oneItemType"
  );
  const isMultiVariant = useMemo(
    () => productVariant === "differentVariants" || false,
    [productVariant]
  );
  const [currentStep, setCurrentStep] = useState<number>(FIRST_STEP);

  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const { showModal, modalTypes, hideModal } = useModal();
  const coreSDK = useCoreSDK();

  const onCreateNewProject = () => {
    hideModal();
    setCurrentStep(FIRST_STEP);
    setIsPreviewVisible(false);
  };

  const onViewMyItem = (id: string | null) => {
    hideModal();
    setCurrentStep(FIRST_STEP);
    setIsPreviewVisible(false);
    const pathname = id
      ? generatePath(OffersRoutes.OfferDetail, {
          [UrlParameters.offerId]: id
        })
      : generatePath(OffersRoutes.Root);
    navigate({ pathname });
  };
  const [isOneSetOfImages, setIsOneSetOfImages] = useState<boolean>(false);
  const { address } = useAccount();

  const { sellers, lens: lensProfiles } = useCurrentSellers();

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
    offerInfo
  }: {
    offerInfo: OfferFieldsFragment;
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
          exchangeToken: offerInfo.exchangeToken
        },
        // these are the ones that we already had before
        onCreateNewProject: onCreateNewProject,
        onViewMyItem: () => onViewMyItem(offerId)
      },
      "auto"
    );
  };
  const formikRef = useRef<FormikProps<CreateProductForm>>(null);
  const wizardSteps = createProductSteps({
    setIsPreviewVisible,
    chatInitializationStatus,
    showCreateProductDraftModal,
    isDraftModalClosed,
    showInvalidRoleModal,
    isMultiVariant,
    onChangeOneSetOfImages: setIsOneSetOfImages,
    isOneSetOfImages
  });
  const wizardLength = keys(wizardSteps).length - 1;
  const wizardStep = useMemo(() => {
    return wizardSteps[currentStep as keyof CreateProductSteps];
  }, [wizardSteps, currentStep]);
  console.log("wizardStep", wizardStep);
  const handleNextForm = useCallback(() => {
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    }
    if (currentStep < wizardLength) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, isPreviewVisible, wizardLength, setCurrentStep]);

  const handleClickStep = (val: number) => {
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    }
    if (currentStep > val) {
      setCurrentStep(val);
    }
  };

  const handleSendData = async (
    values: CreateProductForm,
    formikBag: FormikHelpers<CreateProductForm>
  ) => {
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

    const profileImageLink = createYourProfile?.logo?.[0]?.src;
    const productMainImageLink: string | undefined = isMultiVariant
      ? productVariantsImages?.find((variant) => {
          return variant.images?.thumbnail?.[0]?.src;
        })?.images?.thumbnail?.[0]?.src
      : productImages?.thumbnail?.[0]?.src;

    const productAttributes: Array<{
      trait_type: string;
      value: string;
    }> = productInformation.attributes.map(
      ({ name, value }: { name: string; value: string }) => {
        return {
          trait_type: name,
          value: value
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

      const exchangeToken = CONFIG.defaultTokens.find(
        (n: Token) => n.symbol === coreTermsOfSale.currency.value
      );
      const { price } = coreTermsOfSale;
      const priceBN = parseUnits(
        price < 0.1 ? fixformattedString(price) : price.toString(),
        Number(exchangeToken?.decimals || 18)
      );

      // TODO: change when more than percentage unit
      const buyerCancellationPenaltyValue = priceBN
        .mul(parseFloat(termsOfExchange.buyerCancellationPenalty) * 1000)
        .div(100 * 1000);

      // TODO: change when more than percentage unit
      const sellerCancellationPenaltyValue = priceBN
        .mul(parseFloat(termsOfExchange.sellerDeposit) * 1000)
        .div(100 * 1000);
      const {
        voucherRedeemableFromDateInMS,
        voucherRedeemableUntilDateInMS,
        validFromDateInMS,
        validUntilDateInMS
      } = ValidateDates({
        offerValidityPeriod: coreTermsOfSale.offerValidityPeriod,
        redemptionPeriod: coreTermsOfSale.redemptionPeriod
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
      if (isMultiVariant) {
        const { variants = [] } = values.productVariants;
        const variantsForMetadataCreation: {
          productVariant: productV1.ProductV1Variant;
        }[] = [];
        const variations: productV1.ProductV1Variant = [];
        const visualImages: productV1.ProductBase["visuals_images"] = [];
        const allVariationsWithSameImages =
          values.imagesSpecificOrAll?.value === "all";
        if (allVariationsWithSameImages) {
          const variantVisualImages = extractVisualImages(productImages);

          visualImages.push(...variantVisualImages);
        }
        for (const [index, variant] of Object.entries(variants)) {
          const productImages = productVariantsImages?.[Number(index)].images;
          const { color, size } = variant;
          const typeOptions = [
            {
              type: "size",
              option: size
            },
            {
              type: "color",
              option: color
            }
          ];
          variations.push(...typeOptions);
          variantsForMetadataCreation.push({
            productVariant: typeOptions
          });
          if (!allVariationsWithSameImages && productImages) {
            const variantVisualImages = extractVisualImages(productImages);

            visualImages.push(...variantVisualImages);
          }
        }
        const productV1Metadata = getProductV1Metadata({
          offerUuid,
          productInformation,
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
          profileImageLink,
          termsOfExchange,
          supportedJurisdictions
        });
        const variantsMetadata = productV1.createVariantProductMetadata(
          productV1Metadata,
          variantsForMetadataCreation
        );
        const offerDataPromises: Promise<offers.CreateOfferArgs>[] =
          variantsMetadata.map((metadata, index) => {
            const exchangeToken = CONFIG.defaultTokens.find(
              (n: Token) => n.symbol === variants[index].currency.label
            );
            const price = variants[index].price;
            return getOfferDataFromMetadata(metadata, {
              coreSDK,
              priceBN: parseUnits(
                price < 0.1 ? fixformattedString(price) : price.toString(),
                exchangeToken?.decimals || 18
              ),
              sellerCancellationPenaltyValue,
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
        const productV1Metadata = getProductV1Metadata({
          offerUuid,
          productInformation,
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
          profileImageLink,
          termsOfExchange,
          supportedJurisdictions
        });
        const offerData = await getOfferDataFromMetadata(productV1Metadata, {
          coreSDK,
          priceBN,
          sellerCancellationPenaltyValue,
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
      let txResponse;
      if (isMultiVariant) {
        if (!hasSellerAccount && seller) {
          txResponse = await coreSDK.createSeller(seller);
          showModal("TRANSACTION_SUBMITTED", {
            action: "Create seller",
            txHash: txResponse.hash
          });
        }
        showModal("WAITING_FOR_CONFIRMATION");
        txResponse = await coreSDK.createOfferBatch(offersToCreate);
        showModal("TRANSACTION_SUBMITTED", {
          action: "Create offer with variants",
          txHash: txResponse.hash
        });
        const txReceipt = await txResponse.wait();
        const offerIds = coreSDK.getCreatedOfferIdsFromLogs(txReceipt.logs);
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
                offerInfo: firstOffer || ({} as subgraph.OfferFieldsFragment)
              });
            }}
          />
        ));
      } else {
        const [offerData] = offersToCreate;
        txResponse =
          !hasSellerAccount && seller
            ? await coreSDK.createSellerAndOffer(seller, offerData)
            : await coreSDK.createOffer(offerData);
        showModal("TRANSACTION_SUBMITTED", {
          action: "Create offer",
          txHash: txResponse.hash
        });
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
                offerInfo: createdOffer || ({} as subgraph.OfferFieldsFragment)
              });
            }}
          />
        ));
      }

      hideModal();
      formikBag.resetForm();
    } catch (error: any) {
      // TODO: FAILURE MODAL
      console.error("error->", error.errors ?? error.toString());
      const hasUserRejectedTx =
        "code" in error &&
        (error as unknown as { code: string }).code === "ACTION_REJECTED";
      if (hasUserRejectedTx) {
        showModal("CONFIRMATION_FAILED");
      }
    }
  };

  const handleSubmit = (
    values: CreateProductForm,
    formikBag: FormikHelpers<CreateProductForm>
  ) => {
    if (currentStep === wizardLength) {
      return handleSendData(values, formikBag);
    }
    formikBag.setTouched({});
    return handleNextForm();
  };

  const handleFormikValuesBeforeSave = useCallback(
    (values: CreateProductForm) => {
      return {
        ...values,
        coreTermsOfSale: {
          ...values.coreTermsOfSale,
          redemptionPeriod:
            values?.coreTermsOfSale?.redemptionPeriod?.map((d: Dayjs) =>
              dayjs(d).format()
            ) ?? [],
          offerValidityPeriod:
            values?.coreTermsOfSale?.offerValidityPeriod?.map((d: Dayjs) =>
              dayjs(d).format()
            ) ?? []
        }
      };
    },
    []
  );
  useEffect(() => {
    formikRef?.current?.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOneSetOfImages]);
  return (
    <CreateProductWrapper>
      <MultiSteps
        data={CREATE_PRODUCT_STEPS(isMultiVariant)}
        active={currentStep}
        callback={handleClickStep}
        disableInactiveSteps
      />

      <ProductLayoutContainer isPreviewVisible={isPreviewVisible}>
        <Formik<CreateProductForm>
          innerRef={formikRef}
          initialValues={initial}
          onSubmit={(formikVal, formikBag) => {
            const newValues = handleFormikValuesBeforeSave(formikVal);
            saveItemInStorage("create-product", newValues);
            return handleSubmit(formikVal, formikBag);
          }}
          validationSchema={wizardStep.validation}
          enableReinitialize
        >
          {({ values, errors }) => {
            if (productVariant !== values?.productType?.productVariant) {
              setProductVariant(values?.productType?.productVariant);
            }
            console.log("errors", errors);
            return (
              <Form onKeyPress={onKeyPress}>
                {isPreviewVisible ? (
                  <Preview
                    togglePreview={setIsPreviewVisible}
                    seller={currentOperator as any}
                  />
                ) : (
                  wizardStep.ui
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
