/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataType, subgraph } from "@bosonprotocol/react-kit";
import { parseUnits } from "@ethersproject/units";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Form, Formik, FormikHelpers } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import map from "lodash/map";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { generatePath } from "react-router-dom";
import uuid from "react-uuid";
import { useAccount } from "wagmi";
dayjs.extend(localizedFormat);

import { ethers } from "ethers";

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
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import {
  CreateProductWrapper,
  HelpWrapper,
  MultiStepsContainer,
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

  const wizardStep = useMemo(() => {
    const wizard = createProductSteps({
      setIsPreviewVisible,
      chatInitializationStatus,
      showCreateProductDraftModal,
      isDraftModalClosed,
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
    showInvalidRoleModal,
    isDraftModalClosed
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

  const handleSendData = async (values: CreateProductForm) => {
    const {
      coreTermsOfSale,
      createYourProfile,
      productInformation,
      productImages,
      productType,
      termsOfExchange,
      shippingInfo
    } = values;

    const profileImageLink = createYourProfile?.logo?.[0]?.src;
    const productMainImageLink = productImages?.thumbnail?.[0]?.src;

    const visualImages = Array.from(
      new Set(
        map(
          productImages,
          (v) =>
            v?.[0]?.src && {
              url: v?.[0]?.src,
              tag: "product_image"
            }
        ).filter((n) => n)
      ).values()
    );

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

    let offerData = undefined;
    try {
      const redemptionPointUrl =
        shippingInfo.redemptionPointUrl &&
        shippingInfo.redemptionPointUrl.length > 0
          ? shippingInfo.redemptionPointUrl
          : window.origin;

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
      nftAttributes.push({
        trait_type: "Seller",
        value: createYourProfile.name
      });
      nftAttributes.push({
        trait_type: "Offer Category",
        value: productType.productType.toUpperCase()
      });
      // TODO: In case of variants: add Size and Colour as attributes

      // Be sure the uuid is unique (for all users).
      // Do NOT use Date.now() because nothing prevent 2 users to create 2 offers at the same time
      const offerUuid = uuid();

      const externalUrl = `${redemptionPointUrl}/#/offer-uuid/${offerUuid}`;
      const licenseUrl = `${window.origin}/#/license/${offerUuid}`;

      const metadataHash = await coreSDK.storeMetadata({
        schemaUrl: "https://schema.org/",
        uuid: offerUuid,
        name: productInformation.productTitle,
        description: `${productInformation.description}\n\nTerms for the Boson rNFT Voucher: ${licenseUrl}`,
        externalUrl,
        licenseUrl,
        image: `ipfs://${productMainImageLink}`,
        type: MetadataType.PRODUCT_V1,
        attributes: [...nftAttributes, ...additionalAttributes],
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
          visuals_images: visualImages as any,
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
            supportedJurisdictions.length > 0
              ? supportedJurisdictions
              : undefined,
          returnPeriod: shippingInfo.returnPeriod.toString()
        }
      });

      offerData = {
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
        disputePeriodDurationInMS: disputePeriodDurationInMS.toString(),
        resolutionPeriodDurationInMS: resolutionPeriodDurationInMS.toString(),
        exchangeToken: exchangeToken?.address || ethers.constants.AddressZero,
        disputeResolverId: CONFIG.defaultDisputeResolverId,
        agentId: 0, // no agent
        metadataUri: `ipfs://${metadataHash}`,
        metadataHash: metadataHash
      };
    } catch (error: any) {
      // TODO: FAILURE MODAL
      console.error("error->", error.errors ?? error);
    }

    if (offerData) {
      try {
        showModal("WAITING_FOR_CONFIRMATION");
        const isMetaTx = Boolean(coreSDK.isMetaTxConfigSet && address);
        let txReceipt;
        if (isMetaTx) {
          // meta-transaction
          if (!hasSellerAccount && address) {
            // createSeller with meta-transaction
            const nonce = Date.now();
            const { r, s, v, functionName, functionSignature } =
              await coreSDK.signMetaTxCreateSeller({
                createSellerArgs: {
                  operator: address,
                  admin: address,
                  treasury: address,
                  clerk: address,
                  contractUri: "ipfs://sample",
                  royaltyPercentage: "0",
                  authTokenId: "0",
                  authTokenType: authTokenTypes.NONE
                },
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
            await createSellerResponse.wait();
          }
          // createOffer with meta-transaction
          const nonce = Date.now();
          const { r, s, v, functionName, functionSignature } =
            await coreSDK.signMetaTxCreateOffer({
              createOfferArgs: offerData,
              nonce
            });
          const createOfferResponse = await coreSDK.relayMetaTransaction({
            functionName,
            functionSignature,
            sigR: r,
            sigS: s,
            sigV: v,
            nonce
          });
          showModal("TRANSACTION_SUBMITTED", {
            action: "Create offer",
            txHash: createOfferResponse.hash
          });
          txReceipt = await createOfferResponse.wait();
        } else {
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
                    authTokenType: authTokenTypes.NONE
                  },
                  offerData
                )
              : await coreSDK.createOffer(offerData);
          showModal("TRANSACTION_SUBMITTED", {
            action: "Create offer",
            txHash: txResponse.hash
          });
          txReceipt = await txResponse.wait();
        }
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
        hideModal();
      } catch (error: any) {
        console.error("error->", error);
        // show error in all cases
        showModal("CONFIRMATION_FAILED");
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
      <MultiStepsContainer>
        <MultiSteps
          data={CREATE_PRODUCT_STEPS}
          active={currentStep}
          callback={handleClickStep}
          disableInactiveSteps
        />
      </MultiStepsContainer>

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
                    seller={currentOperator as any}
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
