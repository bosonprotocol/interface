import { Form, Formik } from "formik";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import { useMemo } from "react";
import { useCallback } from "react";
// import reduce from "lodash/reduce";
import { useState } from "react";
import styled from "styled-components";

import CreateYourProfile from "../../components/product/CreateYourProfile";
import Help from "../../components/product/Help";
import ProductType from "../../components/product/ProductType";
import MultiSteps from "../../components/step/MultiSteps";
import { createYourProfileHelp } from "./helpData";

const ProductLayoutContainer = styled.main`
  display: flex;
  justify-content: space-between;
  > form {
    width: 100%;
  }
`;

export interface CreateProductForm {
  name: string;
  email: string;
  description: string;
  website: string;
  physical: string;
  productVariant: string;
}

const initialValues: CreateProductForm = {
  name: "",
  email: "",
  description: "",
  website: "",
  physical: "",
  productVariant: ""
};

type CreateProductSteps = {
  0: JSX.Element;
  1: JSX.Element;
};

const createProductSteps: CreateProductSteps = {
  0: <CreateYourProfile />,
  1: <ProductType />
} as const;

const steps = [
  {
    name: "Profile info",
    steps: 1
  } as const,
  {
    name: "Product Data",
    steps: 4
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

export default function CreateProduct() {
  const [currentForm, setCurrentForm] = useState<number>(0);
  const renderForm = useMemo(() => {
    return (
      createProductSteps?.[currentForm as keyof CreateProductSteps] || null
    );
  }, [currentForm]);
  const handleNextForm = useCallback(() => {
    if (currentForm < formLength) {
      setCurrentForm((prev) => prev + 1);
    }
  }, [currentForm]);

  const handleSubmit = (values: CreateProductForm) => {
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
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form>{renderForm}</Form>
        </Formik>
        {isArray(createYourProfileHelp) && (
          <Help data={createYourProfileHelp} />
        )}
      </ProductLayoutContainer>
    </>
  );
}
