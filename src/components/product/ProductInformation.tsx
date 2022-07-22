import { useFormikContext } from "formik";
import styled from "styled-components";

import Field, { FieldType } from "../../components/form/Field";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";
import type { CreateProductForm } from "./validation/createProductValidationSchema";

const AddProductContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 3fr;
  grid-gap: 1rem;
`;

export default function ProductInformation() {
  const { handleChange, values, errors } =
    useFormikContext<CreateProductForm>();
  return (
    <ContainerProductPage>
      <Typography tag="h2">Product Information</Typography>
      <InputGroup
        title="Product Title*"
        subTitle="Use words people would search for when looking for your item."
      >
        <Field
          fieldType={FieldType.Input}
          placeholder="Name"
          name="productTitle"
          value={values.productTitle}
          onChange={handleChange}
          error={errors.productTitle}
        />
      </InputGroup>
      <InputGroup
        title="Description*"
        subTitle="Describe your product. Provide as much detail as possible."
      >
        <Field
          fieldType={FieldType.Textarea}
          placeholder="Describe"
          name="describe"
          value={values.describe}
          onChange={handleChange}
          error={errors.describe}
        />
      </InputGroup>
      <InputGroup
        title="Category*"
        subTitle="Select the category that best matches your product."
      >
        <Field
          fieldType={FieldType.Input}
          placeholder="Click to select"
          name="category"
          value={values.category}
          onChange={handleChange}
          error={errors.category}
        />
      </InputGroup>
      <InputGroup
        title="Search Tags*"
        subTitle="Input any relevant tags to make your offer stand out."
      >
        <Field
          fieldType={FieldType.Input}
          placeholder="Click to add tags"
          name="tags"
          value={values.tags}
          onChange={handleChange}
          error={errors.tags}
        />
      </InputGroup>
      <InputGroup
        title="Add product attribute"
        popper="Need to be added"
        style={{
          marginBottom: 0
        }}
      >
        <AddProductContainer>
          <Field
            fieldType={FieldType.Input}
            placeholder="Attribute"
            name="attribute"
            value={values.attribute}
            onChange={handleChange}
            error={errors.attribute}
          />
          <Field
            fieldType={FieldType.Input}
            placeholder="Attribute value"
            name="attributeValue"
            value={values.attributeValue}
            onChange={handleChange}
            error={errors.attributeValue}
          />
        </AddProductContainer>
      </InputGroup>
      <ProductButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductPage>
  );
}
