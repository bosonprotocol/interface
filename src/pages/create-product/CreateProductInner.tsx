/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataType, subgraph } from "@bosonprotocol/react-kit";
import { parseUnits } from "@ethersproject/units";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Form, Formik, FormikHelpers } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { generatePath } from "react-router-dom";
import { useAccount } from "wagmi";
dayjs.extend(localizedFormat);

import { ethers } from "ethers";

import { Token } from "../../components/convertion-rate/ConvertionRateContext";
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
import { fromBase64ToBinary } from "../../lib/utils/base64";
import { getLocalStorageItems } from "../../lib/utils/getLocalStorageItems";
import { useChatStatus } from "../../lib/utils/hooks/chat/useChatStatus";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useCurrentSeller } from "../../lib/utils/hooks/useCurrentSeller";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { saveItemInStorage } from "../../lib/utils/hooks/useLocalStorage";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import {
  CreateProductWrapper,
  HelpWrapper,
  ProductLayoutContainer
} from "./CreateProductInner.styles";
import {
  CreateProductSteps,
  createProductSteps,
  FIRST_STEP,
  poll
} from "./utils";
import { ValidateDates } from "./utils/dataValidator";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;

function onKeyPress(event: React.KeyboardEvent<HTMLFormElement>) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
}

interface Props {
  initial: CreateProductForm;
  showCreateProductDraftModal: () => void;
  showInvalidRoleModal: () => void;
}
interface SupportedJuridiction {
  label: string;
  deliveryTime: string;
}

function CreateProductInner({
  initial,
  showCreateProductDraftModal,
  showInvalidRoleModal
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const { chatInitializationStatus } = useChatStatus();
  const [currentStep, setCurrentStep] = useState<number>(FIRST_STEP);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const { showModal, modalTypes, hideModal } = useModal();
  const coreSDK = useCoreSDK();
  const storage = useIpfsStorage();

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

  const { address } = useAccount();

  const { seller, lens: lensProfile } = useCurrentSeller();

  const hasSellerAccount = !!seller;

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
          fulfillmentPeriodDuration: offerInfo.fulfillmentPeriodDuration,
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

  const wizardStep = useMemo(() => {
    const wizard = createProductSteps({
      setIsPreviewVisible,
      chatInitializationStatus,
      showCreateProductDraftModal,
      showInvalidRoleModal
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
    currentStep,
    showCreateProductDraftModal,
    showInvalidRoleModal
  ]);

  const handleNextForm = useCallback(() => {
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    }
    if (currentStep < wizardStep.wizardLength) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, isPreviewVisible, wizardStep.wizardLength, setCurrentStep]);

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
    if (!storage) {
      console.error("Storage is undefined. Unable to progress.");
      return;
    }
    const profileImage = getLocalStorageItems({
      key: "create-product-image_createYourProfile"
    });
    const previewImages = getLocalStorageItems({
      key: "create-product-image_productImages"
    });
    const productMainImage = getLocalStorageItems({
      key: "create-product-image_productImages.thumbnail"
    });

    const uploadPromises = previewImages.map((previewImage) => {
      return storage.add(fromBase64ToBinary(previewImage));
    });

    const profileImageLink = await storage.add(
      fromBase64ToBinary(profileImage[0])
    );
    const productMainImageLink = await storage.add(
      fromBase64ToBinary(productMainImage[0])
    );

    const imagesIpfsLinks = await Promise.all(uploadPromises);

    const visualImages = imagesIpfsLinks.map((link) => {
      return {
        url: `ipfs://${link}`,
        tag: "product_image"
      };
    });

    const {
      coreTermsOfSale,
      createYourProfile,
      productInformation,
      productType,
      termsOfExchange,
      shippingInfo
    } = values;

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
      const metadataHash = await coreSDK.storeMetadata({
        schemaUrl: "https://schema.org/schema",
        uuid: Date.now().toString(),
        name: productInformation.productTitle,
        description: productInformation.description,
        externalUrl: window.origin,
        image: `ipfs://${productMainImageLink}`,
        type: MetadataType.PRODUCT_V1,
        attributes: [
          { trait_type: "productType", value: productType.productType },
          { trait_type: "productVariant", value: productType.productVariant },
          ...additionalAttributes
        ],
        product: {
          uuid: Date.now().toString(),
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
          productionInformation_materials:
            productInformation.materials?.split(","),
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
          packaging_weight_value: shippingInfo.weight,
          packaging_weight_unit: shippingInfo.weightUnit.value
        },
        seller: CONFIG.lens.enabled
          ? {
              defaultVersion: 1,
              name: lensProfile?.name || "",
              description: lensProfile?.bio || "",
              externalUrl: lensProfile
                ? getLensWebsite(lensProfile as Profile) || ""
                : "",
              tokenId: lensProfile
                ? getLensTokenIdDecimal(lensProfile.id).toString()
                : "0",
              images: [
                {
                  url: lensProfile
                    ? getLensProfilePictureUrl(lensProfile as Profile) || ""
                    : "", // TODO: ipfslink or base64?
                  tag: "profile"
                },
                {
                  url: lensProfile
                    ? getLensCoverPictureUrl(lensProfile as Profile) || ""
                    : "", // TODO: ipfslink or base64? // TODO: ipfslink or base64? should I add it?
                  tag: "cover"
                }
              ],
              contactLinks: [
                {
                  url: lensProfile
                    ? getLensEmail(lensProfile as Profile) || ""
                    : "",
                  tag: "email"
                }
              ]
            }
          : {
              defaultVersion: 1,
              name: createYourProfile.name,
              description: createYourProfile.description,
              externalUrl: createYourProfile.website,
              tokenId: undefined, // no entry in the UI
              images: [
                {
                  url: `ipfs://${profileImageLink}`,
                  tag: "profile"
                }
              ],
              contactLinks: [
                {
                  url: createYourProfile.email,
                  tag: "email"
                }
              ]
            },
        exchangePolicy: {
          uuid: Date.now().toString(),
          version: 1,
          label: termsOfExchange.exchangePolicy.value,
          template: termsOfExchange.exchangePolicy.value,
          sellerContactMethod: CONFIG.defaultSellerContactMethod,
          disputeResolverContactMethod:
            CONFIG.defaultDisputeResolverContactMethod
        },
        shipping: {
          defaultVersion: 1,
          countryOfOrigin: shippingInfo.country.label || "",
          supportedJurisdictions:
            supportedJurisdictions.length > 0
              ? supportedJurisdictions
              : undefined,
          returnPeriod: shippingInfo.returnPeriod.toString()
        }
      });

      const exchangeToken = CONFIG.defaultTokens.find(
        (n: Token) => n.symbol === coreTermsOfSale.currency.value
      );

      const priceBN = parseUnits(
        `${coreTermsOfSale.price}`,
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

      const fulfillmentPeriodDurationInMS =
        parseInt(termsOfExchange.disputePeriod) * 24 * 3600 * 1000; // day to msec
      const resolutionPeriodDurationInMS =
        parseInt(CONFIG.defaultDisputeResolutionPeriodDays) * 24 * 3600 * 1000; // day to msec
      const offerData = {
        price: priceBN.toString(),
        sellerDeposit: sellerCancellationPenaltyValue.toString(),
        buyerCancelPenalty: buyerCancellationPenaltyValue.toString(),
        quantityAvailable: coreTermsOfSale.quantity,
        voucherRedeemableFromDateInMS: voucherRedeemableFromDateInMS.toString(),
        voucherRedeemableUntilDateInMS:
          voucherRedeemableUntilDateInMS.toString(),
        voucherValidDurationInMS: 0,
        validFromDateInMS: validFromDateInMS.toString(),
        validUntilDateInMS: validUntilDateInMS.toString(),
        fulfillmentPeriodDurationInMS: fulfillmentPeriodDurationInMS.toString(),
        resolutionPeriodDurationInMS: resolutionPeriodDurationInMS.toString(),
        exchangeToken: exchangeToken?.address || ethers.constants.AddressZero,
        disputeResolverId: CONFIG.defaultDisputeResolverId,
        agentId: 0, // no agent
        metadataUri: `ipfs://${metadataHash}`,
        metadataHash: metadataHash
      };

      showModal("WAITING_FOR_CONFIRMATION");
      const txResponse =
        !hasSellerAccount && address
          ? await coreSDK.createSellerAndOffer(
              {
                operator: address,
                admin: address,
                treasury: address,
                clerk: address,
                contractUri: "ipfs://sample",
                royaltyPercentage: "0",
                authTokenId: "0",
                authTokenType: 0
              },
              offerData
            )
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
    if (currentStep === wizardStep.wizardLength) {
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

  return (
    <CreateProductWrapper>
      <MultiSteps
        data={CREATE_PRODUCT_STEPS}
        active={currentStep}
        callback={handleClickStep}
        disableInactiveSteps
      />

      <ProductLayoutContainer isPreviewVisible={isPreviewVisible}>
        <Formik<CreateProductForm>
          initialValues={initial}
          onSubmit={(formikVal, formikBag) => {
            const newValues = handleFormikValuesBeforeSave(formikVal);
            saveItemInStorage("create-product", newValues);
            return handleSubmit(formikVal, formikBag);
          }}
          validationSchema={wizardStep.currentValidation}
          enableReinitialize
        >
          {() => {
            return (
              <Form onKeyPress={onKeyPress}>
                {isPreviewVisible ? (
                  <Preview
                    togglePreview={setIsPreviewVisible}
                    seller={adminSeller}
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
