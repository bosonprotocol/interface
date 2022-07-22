import { Form, Formik, FormikHelpers } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import { useMemo } from "react";
import { useCallback } from "react";
// import reduce from "lodash/reduce";
import { useState } from "react";
import styled from "styled-components";

import CreateYourProfile from "../../components/product/CreateYourProfile";
import Help from "../../components/product/Help";
import ProductInformation from "../../components/product/ProductInformation";
import ProductType from "../../components/product/ProductType";
import {
  CreateProductForm,
  createYourProfileValidationSchema,
  productInformationValidationSchema,
  productTypeValidationSchema
} from "../../components/product/validation/createProductValidationSchema";
import MultiSteps from "../../components/step/MultiSteps";
import { createYourProfileHelp } from "../../lib/const/productHelpOptions";

const ProductLayoutContainer = styled.main`
  display: flex;
  justify-content: space-between;
  > form {
    width: 100%;
  }
`;

const createYourProfileInitialValues = {
  name: "",
  email: "",
  description: "",
  website: ""
} as const;

const productTypeInitialValues = {
  productType: "",
  productVariant: ""
} as const;

const productInformationInitialValues = {
  productTitle: "",
  describe: "",
  category: "",
  tags: "",
  attribute: "",
  attributeValue: ""
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
  };
  1: {
    ui: JSX.Element;
    validation: typeof productTypeValidationSchema;
  };
  2: {
    ui: JSX.Element;
    validation: typeof productInformationValidationSchema;
  };
};

const createProductSteps: CreateProductSteps = {
  0: {
    ui: <CreateYourProfile />,
    validation: createYourProfileValidationSchema
  },
  1: {
    ui: <ProductType />,
    validation: productTypeValidationSchema
  },
  2: {
    ui: <ProductInformation />,
    validation: productInformationValidationSchema
  }
} as const;

const steps = [
  {
    name: "Profile info",
    steps: 1
  } as const,
  {
    name: "Product Data",
    // steps: 4
    steps: 2 // NOTE: FOR CURRENT SCOPE PRODUCTS VARIANTS ARE EXCLUDED
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

const formLength = keys(createProductSteps).length - 1;

console.log({
  createYourProfileValidationSchema,
  productTypeValidationSchema
});
export default function CreateProduct() {
  const [currentForm, setCurrentForm] = useState<number>(0);
  const wizardStep = useMemo(() => {
    return {
      currentForm:
        createProductSteps?.[currentForm as keyof CreateProductSteps]?.ui ||
        null,
      currentValidation:
        createProductSteps?.[currentForm as keyof CreateProductSteps]
          ?.validation || null
    };
  }, [currentForm]);

  const handleNextForm = useCallback(() => {
    if (currentForm < formLength) {
      setCurrentForm((prev) => prev + 1);
    }
  }, [currentForm]);

  const handleSubmit = (
    values: CreateProductForm,
    formikBag: FormikHelpers<CreateProductForm>
  ) => {
    console.log(formikBag, "formikBag");
    console.log(values, "values");
    handleNextForm();
  };
  return (
    <>
      <MultiSteps
        data={steps}
        active={currentForm}
        callback={(i) => setCurrentForm(i)}
      />
      <ProductLayoutContainer>
        <Formik<CreateProductForm>
          initialValues={initialValues}
          onSubmit={(formikVal, formikBag) =>
            handleSubmit(formikVal, formikBag)
          }
          validationSchema={wizardStep.currentValidation}
        >
          <Form>{wizardStep.currentForm}</Form>
        </Formik>
        {isArray(createYourProfileHelp) && (
          <Help data={createYourProfileHelp} />
        )}
      </ProductLayoutContainer>
    </>
  );
}
