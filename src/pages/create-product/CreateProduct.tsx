import { Form, Formik, FormikHelpers } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import { useMemo } from "react";
import { useCallback } from "react";
import { useState } from "react";
import styled from "styled-components";

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
import {
  CreateProductForm,
  createYourProfileValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema
} from "../../components/product/validation/createProductValidationSchema";
import MultiSteps from "../../components/step/MultiSteps";
import { createYourProfileHelp } from "../../lib/const/productHelpOptions";
import { initialValues } from "./initialValues";

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
    helpSection: null;
  };
  2: {
    ui: JSX.Element;
    validation: typeof productInformationValidationSchema;
    helpSection: null;
  };
  3: {
    ui: JSX.Element;
    validation: null; // TODO: NEED TO BE ADDED, FOR NOW JUSt PLAIN JSX
    helpSection: null;
  };
  4: {
    ui: JSX.Element;
    validation: null; // TODO: NEED TO BE ADDED, FOR NOW JUSt PLAIN JSX
    helpSection: null;
  };
  5: {
    ui: JSX.Element;
    validation: null; // TODO: NEED TO BE ADDED, FOR NOW JUSt PLAIN JSX
    helpSection: null;
  };
  6: {
    ui: JSX.Element;
    validation: null; // TODO: NEED TO BE ADDED, FOR NOW JUSt PLAIN JSX
    helpSection: null;
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
      helpSection: null
    },
    2: {
      ui: <ProductInformation />,
      validation: productInformationValidationSchema,
      helpSection: null
    },
    3: {
      ui: <ProductImages />,
      validation: null,
      helpSection: null
    },
    4: {
      ui: <CoreTermsOfSale />,
      validation: null,
      helpSection: null
    },
    5: {
      ui: <TermsOfExchange />,
      validation: null,
      helpSection: null
    },
    6: {
      ui: <ShippingInfo />,
      validation: null,
      helpSection: null
    },
    7: {
      ui: <ConfirmProductDetails togglePreview={setIsPreviewVisible} />,
      validation: null,
      helpSection: null
    }
  } as const;
};

const steps = [
  {
    name: "Profile info",
    steps: 1
  } as const,
  {
    name: "Product Data",
    // steps: 4
    steps: 3 // NOTE: FOR CURRENT SCOPE PRODUCTS VARIANTS ARE EXCLUDED
  } as const,
  {
    name: "Terms of Sale",
    steps: 3
  } as const,
  {
    name: "Confirm",
    steps: 1
  } as const
];

export default function CreateProduct() {
  const [currentForm, setCurrentForm] = useState<number>(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const { showModal, modalTypes, hideModal } = useModal();

  const onCreateNewProject = () => {
    hideModal();
    setCurrentForm(0);
    setIsPreviewVisible(false);
  };

  const onViewMyItem = (id: unknown) => {
    hideModal();
    setCurrentForm(0);
    setIsPreviewVisible(false);
    // TODO: REDIRECT USER {id}
  };
  const handleOpenSuccessModal = ({ offerId }: { offerId: unknown }) => {
    showModal(modalTypes.PRODUCT_CREATE_SUCCESS, {
      noCloseIcon: true,
      title: "Congratulations!",
      name: "FEWO SHOE EPIC #76/207",
      message: "You have successfully created:",
      image: "https://picsum.photos/seed/58/700",
      price: "2000000000000000",
      offer: {
        id: "35",
        createdAt: "1657198698",
        price: "2000000000000000",
        metadataHash: "Qmf77HBcgxaiB2XT8fYSdDPMWo58VrMu1PVPXoBsBpgAko",
        sellerDeposit: "20000000000000",
        fulfillmentPeriodDuration: "86400",
        resolutionPeriodDuration: "86400",
        metadataUri: "ipfs://Qmf77HBcgxaiB2XT8fYSdDPMWo58VrMu1PVPXoBsBpgAko",
        buyerCancelPenalty: "10000000000000",
        quantityAvailable: "994",
        quantityInitial: "1000",
        validFromDate: "1657198839",
        validUntilDate: "1677285059",
        voidedAt: null,
        voucherValidDuration: "21727820",
        exchanges: [
          {
            committedDate: "1657730973",
            redeemedDate: "1657789278"
          },
          {
            committedDate: "1657198878",
            redeemedDate: null
          },
          {
            committedDate: "1657288773",
            redeemedDate: null
          },
          {
            committedDate: "1657538028",
            redeemedDate: null
          },
          {
            committedDate: "1657538133",
            redeemedDate: null
          },
          {
            committedDate: "1657641168",
            redeemedDate: null
          }
        ],
        seller: {
          id: "4",
          admin: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
          clerk: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
          treasury: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
          operator: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
          active: true
        },
        exchangeToken: {
          address: "0x0000000000000000000000000000000000000000",
          decimals: "18",
          name: "Ether",
          symbol: "ETH"
        },
        metadata: {
          name: "Long-lived Test Item",
          description: "Lore ipsum",
          externalUrl: "https://interface-test.on.fleek.co",
          schemaUrl: "https://schema.org/schema",
          type: "BASE",
          imageUrl: "https://picsum.photos/seed/35/700"
        },
        isValid: true
      },
      onCreateNewProject: onCreateNewProject,
      onViewMyItem: () => onViewMyItem(offerId)
    });
  };

  const wizardStep = useMemo(() => {
    const wizard = createProductSteps({ setIsPreviewVisible });
    return {
      currentForm:
        wizard?.[currentForm as keyof CreateProductSteps]?.ui || null,
      currentValidation:
        wizard?.[currentForm as keyof CreateProductSteps]?.validation || null,
      helpSection:
        wizard?.[currentForm as keyof CreateProductSteps]?.helpSection || null,
      wizardLength: keys(wizard).length - 1
    };
  }, [currentForm]);

  const handleNextForm = useCallback(() => {
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    }
    if (currentForm < wizardStep.wizardLength) {
      setCurrentForm((prev) => prev + 1);
    }
  }, [currentForm, isPreviewVisible, wizardStep.wizardLength]);

  const handleClickStep = (val: number) => {
    if (isPreviewVisible) {
      setIsPreviewVisible(false);
    }
    setCurrentForm(val);
  };

  const handleSendData = (
    values: CreateProductForm,
    formikBag: FormikHelpers<CreateProductForm>
  ) => {
    console.log({
      log: "SEND DATA",
      values,
      formikBag
    });
    try {
      // TODO: ADD SEND DATA LOGIC;
      // const { offerId } = TODO SEND DATA HERE
      handleOpenSuccessModal({ offerId: "" });
    } catch (error) {
      // TODO: FAILURE MODAL
    }
  };

  const handleSubmit = (
    values: CreateProductForm,
    formikBag: FormikHelpers<CreateProductForm>
  ) => {
    if (currentForm === wizardStep.wizardLength) {
      return handleSendData(values, formikBag);
    }
    console.log({
      log: "Next step",
      values,
      formikBag
    });
    formikBag.setSubmitting(false);
    return handleNextForm();
  };
  return (
    <CreateProductWrapper>
      <MultiSteps
        data={steps}
        active={currentForm}
        callback={handleClickStep}
      />
      <ProductLayoutContainer isPreviewVisible={isPreviewVisible}>
        <Formik<CreateProductForm>
          initialValues={initialValues}
          onSubmit={(formikVal, formikBag) =>
            handleSubmit(formikVal, formikBag)
          }
          validationSchema={wizardStep.currentValidation}
        >
          {({ values, errors }) => {
            console.log(values, errors);
            return (
              <Form>
                {isPreviewVisible ? (
                  <Preview togglePreview={setIsPreviewVisible} />
                ) : (
                  wizardStep.currentForm
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
