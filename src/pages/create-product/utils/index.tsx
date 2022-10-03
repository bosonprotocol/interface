import React from "react";

import ConfirmProductDetails from "../../../components/product/ConfirmProductDetails";
import CoreTermsOfSale from "../../../components/product/CoreTermsOfSale";
import ProductImages from "../../../components/product/ProductImages";
import ProductInformation from "../../../components/product/ProductInformation";
import ProductType from "../../../components/product/ProductType";
import ShippingInfo from "../../../components/product/ShippingInfo";
import TermsOfExchange from "../../../components/product/TermsOfExchange";
import {
  coreTermsOfSaleValidationSchema,
  productImagesValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema,
  shippingInfoValidationSchema,
  termsOfExchangeValidationSchema
} from "../../../components/product/utils";
import {
  coreTermsOfSaleHelp,
  productImagesHelp,
  productInformationHelp,
  productTypeHelp,
  shippingInfoHelp,
  termsOfExchangeHelp
} from "../../../components/product/utils/productHelpOptions";
import { ScroolToID } from "../../../components/utils/Scroll";
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

export const wait = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export type CreateProductSteps = {
  // 0: {
  //   ui: JSX.Element;
  //   validation: typeof createYourProfileValidationSchema;
  //   helpSection: typeof createYourProfileHelp;
  // };
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

export type CreateProductStepsParams = {
  setIsPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  chatInitializationStatus: ChatInitializationStatus;
  showCreateProductDraftModal: () => void;
};

export const createProductSteps = ({
  setIsPreviewVisible,
  chatInitializationStatus,
  showCreateProductDraftModal
}: CreateProductStepsParams) => {
  return {
    // 0: {
    //   ui: (
    //     <>
    //       <ScroolToID id="multisteps_wrapper" />
    //       <CreateYourProfile />
    //     </>
    //   ),
    //   validation: createYourProfileValidationSchema,
    //   helpSection: createYourProfileHelp
    // },
    0: {
      ui: (
        <>
          <ScroolToID id="multisteps_wrapper" />
          <ProductType
            showCreateProductDraftModal={showCreateProductDraftModal}
          />
        </>
      ),
      validation: productTypeValidationSchema,
      helpSection: productTypeHelp
    },
    1: {
      ui: (
        <>
          <ScroolToID id="multisteps_wrapper" />
          <ProductInformation />
        </>
      ),
      validation: productInformationValidationSchema,
      helpSection: productInformationHelp
    },
    2: {
      ui: (
        <>
          <ScroolToID id="multisteps_wrapper" />
          <ProductImages />
        </>
      ),
      validation: productImagesValidationSchema,
      helpSection: productImagesHelp
    },
    3: {
      ui: (
        <>
          <ScroolToID id="multisteps_wrapper" />
          <CoreTermsOfSale />
        </>
      ),
      validation: coreTermsOfSaleValidationSchema,
      helpSection: coreTermsOfSaleHelp
    },
    4: {
      ui: (
        <>
          <ScroolToID id="multisteps_wrapper" />
          <TermsOfExchange />
        </>
      ),
      validation: termsOfExchangeValidationSchema,
      helpSection: termsOfExchangeHelp
    },
    5: {
      ui: (
        <>
          <ScroolToID id="multisteps_wrapper" />
          <ShippingInfo />
        </>
      ),
      validation: shippingInfoValidationSchema,
      helpSection: shippingInfoHelp
    },
    6: {
      ui: (
        <>
          <ScroolToID id="multisteps_wrapper" />
          <ConfirmProductDetails
            togglePreview={setIsPreviewVisible}
            chatInitializationStatus={chatInitializationStatus}
          />
        </>
      ),
      validation: null,
      helpSection: null
    }
  } as const;
};

export const FIRST_STEP = 0;
