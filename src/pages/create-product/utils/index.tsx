import { CoreSDK } from "@bosonprotocol/react-kit";
import ConfirmProductDetails from "components/product/confirmProductDetailsPage/ConfirmProductDetails";
import CoreTermsOfSale from "components/product/coreTermsOfSale/CoreTermsOfSale";
import { ProductDigital } from "components/product/ProductDigital";
import ProductImages from "components/product/ProductImages";
import ProductInformation from "components/product/ProductInformation";
import ProductType from "components/product/ProductType";
import ProductVariants from "components/product/ProductVariants";
import ShippingInfo from "components/product/ShippingInfo";
import TermsOfExchange from "components/product/TermsOfExchange";
import TokenGating from "components/product/tokenGating/TokenGating";
import {
  getCoreTermsOfSaleValidationSchema,
  getProductImagesValidationSchema,
  getProductVariantsImagesValidationSchema,
  getProductVariantsValidationSchema,
  getTokenGatingValidationSchema,
  productDigitalValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
  regularProfileValidationSchema,
  shippingInfoValidationSchema,
  termsOfExchangeValidationSchema,
  variantsCoreTermsOfSaleValidationSchema
} from "components/product/utils";
import {
  coreTermsOfSaleHelp,
  productDigitalHelp,
  productImagesHelp,
  productInformationHelp,
  productTypeHelp,
  productVariantsHelp,
  shippingInfoHelp,
  termsOfExchangeHelp,
  tokenGatingHelp
} from "components/product/utils/productHelpOptions";
import { ScrollToID } from "components/utils/Scroll";
import { DappConfig } from "lib/config";
import { isTruthy } from "lib/types/helpers";
import { ChatInitializationStatus } from "lib/utils/hooks/chat/useChatStatus";
import React from "react";

type CreateProductStepsParams = {
  setIsPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  chatInitializationStatus: ChatInitializationStatus;
  showCreateProductDraftModal: () => void;
  showInvalidRoleModal: () => void;
  isDraftModalClosed: boolean;
  isMultiVariant: boolean;
  isPhygital: boolean;
  isTokenGated: boolean;
  onChangeOneSetOfImages: (oneSetOfImages: boolean) => void;
  isOneSetOfImages: boolean;
  config: DappConfig;
  coreSDK: CoreSDK;
};

export const createProductSteps = ({
  setIsPreviewVisible,
  chatInitializationStatus,
  showCreateProductDraftModal,
  showInvalidRoleModal,
  isDraftModalClosed,
  isMultiVariant,
  isPhygital,
  isTokenGated,
  onChangeOneSetOfImages,
  isOneSetOfImages,
  config,
  coreSDK
}: CreateProductStepsParams) => {
  const productType = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <ProductType
          showCreateProductDraftModal={showCreateProductDraftModal}
          showInvalidRoleModal={showInvalidRoleModal}
          isDraftModalClosed={isDraftModalClosed}
        />
      </>
    ),
    validation: regularProfileValidationSchema.concat(
      productTypeValidationSchema
    ),
    helpSection: productTypeHelp
  };
  const productInformation = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <ProductInformation />
      </>
    ),
    validation: productInformationValidationSchema,
    helpSection: productInformationHelp
  };
  const productImages = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <ProductImages onChangeOneSetOfImages={onChangeOneSetOfImages} />
      </>
    ),
    validation: isOneSetOfImages
      ? getProductImagesValidationSchema({ isPhygital })
      : getProductVariantsImagesValidationSchema({ isPhygital }),
    helpSection: productImagesHelp
  };
  const coreTermsOfSale = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <CoreTermsOfSale isMultiVariant={isMultiVariant} />
      </>
    ),
    validation: isMultiVariant
      ? variantsCoreTermsOfSaleValidationSchema
      : getCoreTermsOfSaleValidationSchema(config),
    helpSection: coreTermsOfSaleHelp
  };
  const tokenGating = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <TokenGating />
      </>
    ),
    validation: getTokenGatingValidationSchema({ coreSDK }),
    helpSection: tokenGatingHelp
  };
  const termsOfExchange = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <TermsOfExchange />
      </>
    ),
    validation: termsOfExchangeValidationSchema,
    helpSection: termsOfExchangeHelp
  };
  const shippingInfo = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <ShippingInfo />
      </>
    ),
    validation: shippingInfoValidationSchema,
    helpSection: shippingInfoHelp
  };
  const preview = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <ConfirmProductDetails
          togglePreview={setIsPreviewVisible}
          chatInitializationStatus={chatInitializationStatus}
          isMultiVariant={isMultiVariant}
          isOneSetOfImages={isOneSetOfImages}
        />
      </>
    ),
    validation: null,
    helpSection: null
  };
  const productDigital = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <ProductDigital />
      </>
    ),
    validation: productDigitalValidationSchema,
    helpSection: productDigitalHelp
  };
  const productVariants = {
    ui: (
      <>
        <ScrollToID id="multisteps_wrapper" />
        <ProductVariants />
      </>
    ),
    validation: getProductVariantsValidationSchema(config),
    helpSection: productVariantsHelp
  };

  return Object.fromEntries(
    Object.entries(
      [
        productType,
        productInformation,
        isPhygital && productDigital,
        isMultiVariant && productVariants,
        productImages,
        coreTermsOfSale,
        isTokenGated && tokenGating,
        termsOfExchange,
        shippingInfo,
        preview
      ].filter(isTruthy)
    )
  );
};

export const FIRST_STEP = 0;
