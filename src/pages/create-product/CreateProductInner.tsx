import { MetadataType } from "@bosonprotocol/common";
import { parseEther } from "@ethersproject/units";
import { Form, Formik, FormikHelpers } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import { useMemo } from "react";
import { useCallback } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useModal } from "../../components/modal/useModal";
import ConfirmProductDetails from "../../components/product/ConfirmProductDetails";
import CoreTermsOfSale from "../../components/product/CoreTermsOfSale";
import CreateYourProfile from "../../components/product/CreateYourProfile";
import Help from "../../components/product/Help";
import Preview from "../../components/product/Preview";
import ProductImages from "../../components/product/ProductImages";
import ProductInformation from "../../components/product/ProductInformation";
import ProductType from "../../components/product/ProductType";
import ShippingInfo from "../../components/product/ShippingInfo";
import TermsOfExchange from "../../components/product/TermsOfExchange";
import type { CreateProductForm } from "../../components/product/utils";
import {
  coreTermsOfSaleValidationSchema,
  CREATE_PRODUCT_STEPS,
  createYourProfileValidationSchema,
  productImagesValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
  shippingInfoValidationSchema,
  termsOfExchangeValidationSchema
} from "../../components/product/utils";
import {
  coreTermsOfSaleHelp,
  createYourProfileHelp,
  productImagesHelp,
  productInformationHelp,
  productTypeHelp,
  shippingInfoHelp,
  termsOfExchangeHelp
} from "../../components/product/utils/productHelpOptions";
import MultiSteps from "../../components/step/MultiSteps";
import { getLocalStorageItems } from "../../lib/utils/getLocalStorageItems";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import { saveItemInStorage } from "../../lib/utils/hooks/useLocalStorage";
import { useSellers } from "../../lib/utils/hooks/useSellers";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";

const ProductLayoutContainer = styled.div(
  ({ isPreviewVisible }: { isPreviewVisible: boolean }) => {
    if (!isPreviewVisible) {
      return `
        display: flex;
        justify-content: space-between;
        > form {
          width: 100%;
        }
      `;
    }
    return "";
  }
);
const HelpWrapper = styled.div`
  padding-left: 3rem;
`;
const CreateProductWrapper = styled.div`
  > div:first-child {
    margin-bottom: 2rem;
  }
`;

type CreateProductSteps = {
  0: {
    ui: JSX.Element;
    validation: typeof createYourProfileValidationSchema;
    helpSection: typeof createYourProfileHelp;
  };
  1: {
    ui: JSX.Element;
    validation: typeof productTypeValidationSchema;
    helpSection: typeof productTypeHelp;
  };
  2: {
    ui: JSX.Element;
    validation: typeof productInformationValidationSchema;
    helpSection: typeof productInformationHelp;
  };
  3: {
    ui: JSX.Element;
    validation: typeof productImagesValidationSchema;
    helpSection: typeof productImagesHelp;
  };
  4: {
    ui: JSX.Element;
    validation: typeof coreTermsOfSaleValidationSchema;
    helpSection: typeof coreTermsOfSaleHelp;
  };
  5: {
    ui: JSX.Element;
    validation: typeof termsOfExchangeValidationSchema;
    helpSection: typeof termsOfExchangeHelp;
  };
  6: {
    ui: JSX.Element;
    validation: typeof shippingInfoValidationSchema;
    helpSection: typeof shippingInfoHelp;
  };
  7: {
    ui: JSX.Element;
    validation: null; // TODO: NEED TO BE ADDED, FOR NOW JUSt PLAIN JSX
    helpSection: null;
  };
};

type CreateProductStepsParams = {
  setIsPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const createProductSteps = ({
  setIsPreviewVisible
}: CreateProductStepsParams) => {
  return {
    0: {
      ui: <CreateYourProfile />,
      validation: createYourProfileValidationSchema,
      helpSection: createYourProfileHelp
    },
    1: {
      ui: <ProductType />,
      validation: productTypeValidationSchema,
      helpSection: productTypeHelp
    },
    2: {
      ui: <ProductInformation />,
      validation: productInformationValidationSchema,
      helpSection: productInformationHelp
    },
    3: {
      ui: <ProductImages />,
      validation: productImagesValidationSchema,
      helpSection: productImagesHelp
    },
    4: {
      ui: <CoreTermsOfSale />,
      validation: coreTermsOfSaleValidationSchema,
      helpSection: coreTermsOfSaleHelp
    },
    5: {
      ui: <TermsOfExchange />,
      validation: termsOfExchangeValidationSchema,
      helpSection: termsOfExchangeHelp
    },
    6: {
      ui: <ShippingInfo />,
      validation: shippingInfoValidationSchema,
      helpSection: shippingInfoHelp
    },
    7: {
      ui: <ConfirmProductDetails togglePreview={setIsPreviewVisible} />,
      validation: null,
      helpSection: null
    }
  } as const;
};

const FIRST_STEP = 0;

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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

    const metadataInfo = await coreSDK.getMetadata(offerInfo.metadataUri);

    showModal(modalTypes.PRODUCT_CREATE_SUCCESS, {
      name: metadataInfo.name,
      message: "You have successfully created:",
      image: "metadataInfo.image",
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

  const handleNextForm = useCallback(
    (formikBag: FormikHelpers<CreateProductForm>) => {
      // roberto: handle next click
      if (isPreviewVisible) {
        setIsPreviewVisible(false);
      }
      if (currentStep < wizardStep.wizardLength) {
        setCurrentStep((prev) => prev + 1);
      }

      formikBag.setFieldValue("isValid", false);
    },
    [currentStep, isPreviewVisible, wizardStep.wizardLength, setCurrentStep]
  );

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
      key: "create-product-image_creteYourProfile"
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
      creteYourProfile,
      productInformation,
      productType,
      termsOfExchange
    } = values;

    const attributes = productInformation.attributes.map(
      ({ name, value }: { name: string; value: string }) => {
        return {
          trait_type: name,
          value: value
        };
      }
    );

    try {
      const metadataHash = await coreSDK.storeMetadata({
        schemaUrl: "https://schema.org/schema",
        uuid: Date.now().toString(),
        name: productInformation.productTitle,
        description: productInformation.description,
        externalUrl: "https://interface-staging.on.fleek.co",
        image: `ipfs://${profileImageLink}`,
        type: MetadataType.PRODUCT_V1,
        attributes,
        product: {
          uuid: Date.now().toString(),
          version: 1,
          productionInformation_brandName: creteYourProfile.name,
          title: productInformation.productTitle,
          description: productInformation.description,
          visuals_images: visualImages,
          details_offerCategory: productType.productType.toUpperCase()
        },
        seller: {
          name: creteYourProfile.name,
          description: creteYourProfile.description,
          externalUrl: creteYourProfile.website,
          images: [
            {
              url: `ipfs://${profileImageLink}`,
              tag: "profile"
            }
          ],
          contactLinks: [
            {
              url: creteYourProfile.email,
              tag: "email"
            }
          ]
        },
        exchangePolicy: {
          uuid: Date.now().toString(),
          version: 1,
          template: termsOfExchange.exchangePolicy.value
        }
      });

      // reset the form
      // roberto
      // formikBag.resetForm();

      const buyerCancellationPenaltyValue =
        parseInt(coreTermsOfSale.price) *
        (parseInt(termsOfExchange.buyerCancellationPenalty) / 100);

      const sellerCancellationPenaltyValue =
        parseInt(coreTermsOfSale.price) *
        (parseInt(termsOfExchange.sellerDeposit) / 100);

      const validFromDateInMS = Date.parse(
        coreTermsOfSale.offerValidityPeriod[0].$d
      );

      const validUntilDateInMS = Date.parse(
        coreTermsOfSale.offerValidityPeriod[1].$d
      );

      const voucherRedeemableFromDateInMS = Date.parse(
        coreTermsOfSale.redemptionPeriod[0].$d
      );

      const voucherRedeemableUntilDateInMS = Date.parse(
        coreTermsOfSale.redemptionPeriod[1].$d
      );

      const resolutionPeriodDurationInMS =
        parseInt(termsOfExchange.disputePeriod) * 86400;

      const offerData = {
        price: parseEther(`${coreTermsOfSale.price}`).toString(),
        sellerDeposit: parseEther(
          `${sellerCancellationPenaltyValue}`
        ).toString(),
        buyerCancelPenalty: parseEther(
          `${buyerCancellationPenaltyValue}`
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
                contractUri: "",
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
    } catch (error) {
      // TODO: FAILURE MODAL
      console.error(error);
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

    return handleNextForm(formikBag);
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
          enableReinitialize
          initialValues={initial}
          onSubmit={(formikVal, formikBag) =>
            handleSubmit(formikVal, formikBag)
          }
          validationSchema={wizardStep.currentValidation}
        >
          {({ values }) => {
            saveItemInStorage("create-product", values);
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
