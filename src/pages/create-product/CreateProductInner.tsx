/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataType } from "@bosonprotocol/common";
import { parseUnits } from "@ethersproject/units";
import { Form, Formik, FormikHelpers } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import { useMemo } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useAccount } from "wagmi";

import { useModal } from "../../components/modal/useModal";
import Help from "../../components/product/Help";
import Preview from "../../components/product/Preview";
import { CreateProductForm } from "../../components/product/utils";
import { CREATE_PRODUCT_STEPS } from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import { getLocalStorageItems } from "../../lib/utils/getLocalStorageItems";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import { saveItemInStorage } from "../../lib/utils/hooks/useLocalStorage";
import { useSellers } from "../../lib/utils/hooks/useSellers";
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
  wait
} from "./utils";
import { ValidateDates } from "./utils/dataValidator";

interface Props {
  initial: CreateProductForm;
}

function CreateProductInner({ initial }: Props) {
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

  const onViewMyItem = (id: unknown) => {
    console.log(id);
    hideModal();
    setCurrentStep(FIRST_STEP);
    setIsPreviewVisible(false);
    // TODO: REDIRECT USER {id}
  };

  const { address } = useAccount();

  const { data: sellers } = useSellers({
    admin: address,
    includeFunds: true
  });

  const handleOpenSuccessModal = async ({
    offerId
  }: {
    offerId: string | null;
  }) => {
    const offerInfo = await coreSDK.getOfferById(offerId as string);

    const metadataInfo = (await coreSDK.getMetadata(
      offerInfo.metadataUri
    )) as any;

    showModal(modalTypes.PRODUCT_CREATE_SUCCESS, {
      title: `Offer ${offerId}`,
      name: metadataInfo.name,
      message: "You have successfully created:",
      image: metadataInfo.image,
      price: offerInfo.price,
      offer: {
        id: offerInfo.id,
        createdAt: offerInfo.createdAt,
        price: offerInfo.price,
        metadataHash: offerInfo.metadataHash,
        sellerDeposit: offerInfo.sellerDeposit,
        resolutionPeriodDuration: offerInfo.resolutionPeriodDuration,
        metadataUri: offerInfo.metadataUri,
        buyerCancelPenalty: offerInfo.buyerCancelPenalty,
        quantityAvailable: offerInfo.quantityAvailable,
        quantityInitial: offerInfo.quantityInitial,
        fulfillmentPeriodDuration: offerInfo.fulfillmentPeriodDuration,
        validFromDate: offerInfo.validFromDate,
        validUntilDate: offerInfo.validUntilDate,
        voidedAt: offerInfo.voidedAt,
        voucherValidDuration: offerInfo.voucherValidDuration,
        exchangeToken: {
          id: "",
          address: "0x0000000000000000000000000000000000000000",
          decimals: "18",
          name: "Ether",
          symbol: "ETH"
        },
        seller: offerInfo.seller
      },
      // these are the ones that we already had before
      onCreateNewProject: onCreateNewProject,
      onViewMyItem: () => onViewMyItem(offerId)
    });
  };

  const wizardStep = useMemo(() => {
    const wizard = createProductSteps({ setIsPreviewVisible });
    return {
      currentStep:
        wizard?.[currentStep as keyof CreateProductSteps]?.ui || null,
      currentValidation:
        wizard?.[currentStep as keyof CreateProductSteps]?.validation || null,
      helpSection:
        wizard?.[currentStep as keyof CreateProductSteps]?.helpSection || null,
      wizardLength: keys(wizard).length - 1
    };
  }, [currentStep]);

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
    console.log({
      log: "SEND DATA",
      values,
      formikBag
    });

    const profileImage = getLocalStorageItems({
      key: "create-product-image_createYourProfile"
    });

    const previewImages = getLocalStorageItems({
      key: "create-product-image_productImages"
    });

    const uploadPromises = previewImages.map((previewImage) => {
      return storage.add(previewImage);
    });

    const profileImageLink = await storage.add(profileImage[0]);

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

    const supportedJurisdictions = shippingInfo.jurisdiction.map(
      ({ region, time }: { region: string; time: string }) => {
        return {
          label: region,
          deliveryTime: time
        };
      }
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
        externalUrl: "https://interface-staging.on.fleek.co",
        image: `ipfs://${profileImageLink}`,
        type: MetadataType.PRODUCT_V1,
        attributes: [
          { trait_type: "productType", value: productType.productType },
          { trait_type: "productVariant", value: productType.productVariant },
          ...additionalAttributes
        ],
        product: {
          uuid: Date.now().toString(),
          version: 1,
          productionInformation_brandName: createYourProfile.name,
          title: productInformation.productTitle,
          description: productInformation.description,
          visuals_images: visualImages,
          details_offerCategory: productType.productType.toUpperCase()
        },
        seller: {
          name: createYourProfile.name,
          description: createYourProfile.description,
          externalUrl: createYourProfile.website,
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
          template: termsOfExchange.exchangePolicy.value
        },
        shipping: {
          defaultVersion: 1,
          countryOfOrigin: shippingInfo.country.label || "",
          supportedJurisdictions:
            supportedJurisdictions[0].label.length > 0
              ? supportedJurisdictions
              : undefined
        }
      });

      const buyerCancellationPenaltyValue =
        parseInt(coreTermsOfSale.price) *
        (parseInt(termsOfExchange.buyerCancellationPenalty) / 100);

      const sellerCancellationPenaltyValue =
        parseInt(coreTermsOfSale.price) *
        (parseInt(termsOfExchange.sellerDeposit) / 100);

      const {
        voucherRedeemableFromDateInMS,
        voucherRedeemableUntilDateInMS,
        validFromDateInMS,
        validUntilDateInMS
      } = ValidateDates({
        offerValidityPeriod: coreTermsOfSale.offerValidityPeriod,
        redemptionPeriod: coreTermsOfSale.redemptionPeriod
      });

      const resolutionPeriodDurationInMS =
        parseInt(termsOfExchange.disputePeriod) * 86400;

      const offerData = {
        price: parseUnits(`${coreTermsOfSale.price}`, 18).toString(),
        sellerDeposit: parseUnits(
          `${sellerCancellationPenaltyValue}`,
          18
        ).toString(),
        buyerCancelPenalty: parseUnits(
          `${buyerCancellationPenaltyValue}`,
          18
        ).toString(),
        quantityAvailable: coreTermsOfSale.quantity,
        voucherRedeemableFromDateInMS: voucherRedeemableFromDateInMS.toString(),
        voucherRedeemableUntilDateInMS:
          voucherRedeemableUntilDateInMS.toString(),
        validFromDateInMS: validFromDateInMS.toString(),
        validUntilDateInMS: validUntilDateInMS.toString(),
        fulfillmentPeriodDurationInMS: resolutionPeriodDurationInMS.toString(),
        resolutionPeriodDurationInMS: resolutionPeriodDurationInMS.toString(),
        voucherValidDurationInMS: resolutionPeriodDurationInMS.toString(),
        exchangeToken: "0x0000000000000000000000000000000000000000",
        disputeResolverId: 1,
        agentId: 0, // no agent
        metadataUri: `ipfs://${metadataHash}`,
        metadataHash: metadataHash
      };

      const txResponse =
        sellers?.length === 0 && address
          ? await coreSDK.createSellerAndOffer(
              {
                operator: address,
                admin: address,
                treasury: address,
                clerk: address,
                contractUri: "ipfs://sample",
                authTokenId: "0",
                authTokenType: 0
              },
              offerData
            )
          : await coreSDK.createOffer(offerData);

      const txReceipt = await txResponse.wait();

      const offerId = coreSDK.getCreatedOfferIdFromLogs(txReceipt.logs);

      await wait(3_000);
      handleOpenSuccessModal({ offerId });

      // reset the form
      formikBag.resetForm();
    } catch (error: any) {
      // TODO: FAILURE MODAL
      console.error("error->", error.errors);
    }
  };

  const handleSubmit = (
    values: CreateProductForm,
    formikBag: FormikHelpers<CreateProductForm>
  ) => {
    if (currentStep === wizardStep.wizardLength) {
      return handleSendData(values, formikBag);
    }
    console.log({
      log: "Next step",
      values,
      formikBag
    });

    return handleNextForm();
  };

  return (
    <CreateProductWrapper>
      <MultiSteps
        data={CREATE_PRODUCT_STEPS}
        active={currentStep}
        callback={handleClickStep}
      />

      <ProductLayoutContainer isPreviewVisible={isPreviewVisible}>
        <Formik<CreateProductForm>
          initialValues={initial}
          onSubmit={(formikVal, formikBag) => {
            saveItemInStorage("create-product", formikVal);
            return handleSubmit(formikVal, formikBag);
          }}
          validationSchema={wizardStep.currentValidation}
          enableReinitialize
        >
          {() => {
            return (
              <Form>
                {isPreviewVisible ? (
                  <Preview togglePreview={setIsPreviewVisible} />
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
