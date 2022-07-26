import { Form, Formik, FormikHelpers } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import { useMemo } from "react";
import { useCallback } from "react";
import { useState } from "react";
import styled from "styled-components";

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

const createYourProfileInitialValues = {
  creteYourProfile: {
    name: "",
    email: "",
    description: "",
    website: ""
  }
} as const;

const productTypeInitialValues = {
  productType: {
    productType: "",
    productVariant: ""
  }
} as const;

const productInformationInitialValues = {
  productInformation: {
    productTitle: "",
    describe: "",
    category: "",
    tags: "",
    attribute: "",
    attributeValue: ""
  }
} as const;

const initialValues: CreateProductForm = {
  ...createYourProfileInitialValues,
  ...productTypeInitialValues,
  ...productInformationInitialValues
} as const;

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
    // TODO: ADD SEND DATA LOGIC;
    console.log({
      log: "SEND DATA",
      values,
      formikBag
    });
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
    <>
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
    </>
  );
}
