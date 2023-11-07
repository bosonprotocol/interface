import ConfirmProductDetails from "components/product/confirmProductDetailsPage/ConfirmProductDetails";
import CoreTermsOfSale from "components/product/coreTermsOfSale/CoreTermsOfSale";
import ProductImages from "components/product/ProductImages";
import ProductInformation from "components/product/ProductInformation";
import ProductType from "components/product/ProductType";
import ProductVariants from "components/product/ProductVariants";
import ShippingInfo from "components/product/ShippingInfo";
import TermsOfExchange from "components/product/TermsOfExchange";
import TokenGating from "components/product/tokenGating/TokenGating";
import {
  CoreTermsOfSaleValidationSchema,
  getCoreTermsOfSaleValidationSchema,
  getProductVariantsValidationSchema,
  productImagesValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
  productVariantsImagesValidationSchema,
  regularProfileValidationSchema,
  shippingInfoValidationSchema,
  termsOfExchangeValidationSchema,
  tokenGatingValidationSchema,
  variantsCoreTermsOfSaleValidationSchema
} from "components/product/utils";
import {
  coreTermsOfSaleHelp,
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

export type CreateProductSteps = {
  0: {
    ui: JSX.Element;
    validation: typeof productTypeValidationSchema;
    helpSection: typeof productTypeHelp;
  };
  1: {
    ui: JSX.Element;
    validation: typeof productInformationValidationSchema;
    helpSection: typeof productInformationHelp;
  };
  2: {
    ui: JSX.Element;
    validation: typeof productImagesValidationSchema;
    helpSection: typeof productImagesHelp;
  };
  3: {
    ui: JSX.Element;
    validation: CoreTermsOfSaleValidationSchema;
    helpSection: typeof coreTermsOfSaleHelp;
  };
  4: {
    ui: JSX.Element;
    validation: typeof termsOfExchangeValidationSchema;
    helpSection: typeof termsOfExchangeHelp;
  };
  5: {
    ui: JSX.Element;
    validation: typeof shippingInfoValidationSchema;
    helpSection: typeof shippingInfoHelp;
  };
  6: {
    ui: JSX.Element;
    validation: null; // TODO: NEED TO BE ADDED, FOR NOW JUSt PLAIN JSX
    helpSection: null;
  };
};

type CreateProductStepsParams = {
  setIsPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  chatInitializationStatus: ChatInitializationStatus;
  showCreateProductDraftModal: () => void;
  showInvalidRoleModal: () => void;
  isDraftModalClosed: boolean;
  isMultiVariant: boolean;
  isTokenGated: boolean;
  onChangeOneSetOfImages: (oneSetOfImages: boolean) => void;
  isOneSetOfImages: boolean;
  config: DappConfig;
};

export const createProductSteps = ({
  setIsPreviewVisible,
  chatInitializationStatus,
  showCreateProductDraftModal,
  showInvalidRoleModal,
  isDraftModalClosed,
  isMultiVariant,
  isTokenGated,
  onChangeOneSetOfImages,
  isOneSetOfImages,
  config
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
      ? productImagesValidationSchema
      : productVariantsImagesValidationSchema,
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
    validation: tokenGatingValidationSchema,
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

  const defaultSteps = Object.fromEntries(
    Object.entries(
      [
        productType,
        productInformation,
        productImages,
        coreTermsOfSale,
        isTokenGated && tokenGating,
        termsOfExchange,
        shippingInfo,
        preview
      ].filter(isTruthy)
    )
  );

  if (isMultiVariant) {
    const productVariants = {
      ui: (
        <>
          <ScrollToID id="multisteps_wrapper" />
          <ProductVariants />
        </>
      ),
      validation: getProductVariantsValidationSchema(config),
      helpSection: productVariantsHelp,
      stepNo: "productVariants"
    };
    return Object.fromEntries(
      Object.entries(
        [
          productType,
          productInformation,
          productVariants,
          productImages,
          coreTermsOfSale,
          isTokenGated && tokenGating,
          termsOfExchange,
          shippingInfo,
          preview
        ].filter(isTruthy)
      )
    );
  }

  return defaultSteps;
};

export const FIRST_STEP = 0;
