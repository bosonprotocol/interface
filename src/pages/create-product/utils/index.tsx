import React from "react";

import ConfirmProductDetails from "../../../components/product/ConfirmProductDetails";
import CoreTermsOfSale from "../../../components/product/coreTermsOfSale/CoreTermsOfSale";
import ProductImages from "../../../components/product/ProductImages";
import ProductInformation from "../../../components/product/ProductInformation";
import ProductType from "../../../components/product/ProductType";
import ProductVariants from "../../../components/product/ProductVariants";
import ShippingInfo from "../../../components/product/ShippingInfo";
import TermsOfExchange from "../../../components/product/TermsOfExchange";
import TokenGating from "../../../components/product/tokenGating/TokenGating";
import {
  coreTermsOfSaleValidationSchema,
  productImagesValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
  productVariantsImagesValidationSchema,
  productVariantsValidationSchema,
  shippingInfoValidationSchema,
  termsOfExchangeValidationSchema,
  tokenGatingValidationSchema,
  variantsCoreTermsOfSaleValidationSchema
} from "../../../components/product/utils";
import {
  coreTermsOfSaleHelp,
  productImagesHelp,
  productInformationHelp,
  productTypeHelp,
  productVariantsHelp,
  shippingInfoHelp,
  termsOfExchangeHelp
} from "../../../components/product/utils/productHelpOptions";
import { ScroolToID } from "../../../components/utils/Scroll";
import { isTruthy } from "../../../lib/types/helpers";
import { ChatInitializationStatus } from "../../../lib/utils/hooks/chat/useChatStatus";

export const poll = async function <T>(
  fn: () => Promise<T>,
  fnConditionToKeepPolling: (arg: T) => boolean,
  ms: number
) {
  let result = await fn();
  while (fnConditionToKeepPolling(result)) {
    await wait(ms);
    result = await fn();
  }
  return result;
};

const wait = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

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
    validation: typeof coreTermsOfSaleValidationSchema;
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
  isOneSetOfImages
}: CreateProductStepsParams) => {
  const productType = {
    ui: (
      <>
        <ScroolToID id="multisteps_wrapper" />
        <ProductType
          showCreateProductDraftModal={showCreateProductDraftModal}
          showInvalidRoleModal={showInvalidRoleModal}
          isDraftModalClosed={isDraftModalClosed}
        />
      </>
    ),
    validation: productTypeValidationSchema,
    helpSection: productTypeHelp
  };
  const productInformation = {
    ui: (
      <>
        <ScroolToID id="multisteps_wrapper" />
        <ProductInformation />
      </>
    ),
    validation: productInformationValidationSchema,
    helpSection: productInformationHelp
  };
  const productImages = {
    ui: (
      <>
        <ScroolToID id="multisteps_wrapper" />
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
        <ScroolToID id="multisteps_wrapper" />
        <CoreTermsOfSale isMultiVariant={isMultiVariant} />
      </>
    ),
    validation: isMultiVariant
      ? variantsCoreTermsOfSaleValidationSchema
      : coreTermsOfSaleValidationSchema,
    helpSection: coreTermsOfSaleHelp
  };
  const tokenGating = {
    ui: (
      <>
        <ScroolToID id="multisteps_wrapper" />
        <TokenGating />
      </>
    ),
    validation: tokenGatingValidationSchema,
    helpSection: coreTermsOfSaleHelp
  };
  const termsOfExchange = {
    ui: (
      <>
        <ScroolToID id="multisteps_wrapper" />
        <TermsOfExchange />
      </>
    ),
    validation: termsOfExchangeValidationSchema,
    helpSection: termsOfExchangeHelp
  };
  const shippingInfo = {
    ui: (
      <>
        <ScroolToID id="multisteps_wrapper" />
        <ShippingInfo />
      </>
    ),
    validation: shippingInfoValidationSchema,
    helpSection: shippingInfoHelp
  };
  const preview = {
    ui: (
      <>
        <ScroolToID id="multisteps_wrapper" />
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
          <ScroolToID id="multisteps_wrapper" />
          <ProductVariants />
        </>
      ),
      validation: productVariantsValidationSchema,
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
