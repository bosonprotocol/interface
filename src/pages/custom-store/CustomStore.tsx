import { useFormik } from "formik";
import styled from "styled-components";

import Layout from "../../components/Layout";
import {
  Button,
  FormControl,
  FormElement,
  FormElementsContainer,
  FormLabel,
  StyledForm
} from "../create-offer/CreateOffer";

const Root = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

interface FormValues {
  storeName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function CustomStore() {
  const { values, handleChange, handleSubmit } = useFormik<FormValues>({
    initialValues: {
      storeName: "",
      logoUrl: "",
      primaryColor: "",
      secondaryColor: ""
    },
    onSubmit: async (values: FormValues) => {
      console.log(values);
      return;
    }
  });

  return (
    <Root>
      <h1>Create Custom Store</h1>
      <StyledForm onSubmit={handleSubmit}>
        <FormElementsContainer>
          <FormElement>
            <FormLabel>Store Name</FormLabel>
            <FormControl
              value={values.storeName}
              onChange={handleChange}
              name="storeName"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Logo URL</FormLabel>
            <FormControl
              value={values.logoUrl}
              onChange={handleChange}
              name="logoUrl"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Primary Colour</FormLabel>
            <FormControl
              value={values.primaryColor}
              onChange={handleChange}
              name="primaryColor"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Primary Colour</FormLabel>
            <FormControl
              value={values.secondaryColor}
              onChange={handleChange}
              name="secondaryColor"
              type="text"
              placeholder="..."
            />
          </FormElement>
        </FormElementsContainer>
        <Button>Create Store</Button>
      </StyledForm>
    </Root>
  );
}
