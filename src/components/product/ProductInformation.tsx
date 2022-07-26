import { useFormikContext } from "formik";
import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
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

const AdditionalContainer = styled.div`
  margin-top: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563rem;
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
          name="productInformation.productTitle"
          value={values.productInformation.productTitle}
          onChange={handleChange}
          error={errors.productInformation?.productTitle}
        />
      </InputGroup>
      <InputGroup
        title="Description*"
        subTitle="Describe your product. Provide as much detail as possible."
      >
        <Field
          fieldType={FieldType.Textarea}
          placeholder="Describe"
          name="productInformation.describe"
          value={values.productInformation.describe}
          onChange={handleChange}
          error={errors.productInformation?.describe}
        />
      </InputGroup>
      <InputGroup
        title="Category*"
        subTitle="Select the category that best matches your product."
      >
        <Field
          fieldType={FieldType.Input}
          placeholder="Click to select"
          name="productInformation.category"
          value={values.productInformation.category}
          onChange={handleChange}
          error={errors.productInformation?.category}
        />
      </InputGroup>
      <InputGroup
        title="Search Tags*"
        subTitle="Input any relevant tags to make your offer stand out."
      >
        <Field
          fieldType={FieldType.Input}
          placeholder="Click to add tags"
          name="productInformation.tags"
          value={values.productInformation.tags}
          onChange={handleChange}
          error={errors.productInformation?.tags}
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
            name="productInformation.attribute"
            value={values.productInformation.attribute}
            onChange={handleChange}
            error={errors.productInformation?.attribute}
          />
          <Field
            fieldType={FieldType.Input}
            placeholder="Attribute value"
            name="productInformation.attributeValue"
            value={values.productInformation.attributeValue}
            onChange={handleChange}
            error={errors.productInformation?.attributeValue}
          />
        </AddProductContainer>
      </InputGroup>
      <AdditionalContainer>
        <Collapse
          title={<Typography tag="h3">Additional information</Typography>}
        >
          <InputGroup
            title="SKU"
            subTitle="Input product serial number."
            popper="Need to be added"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="SKU"
              name=""
              value={values.productInformation.productTitle}
              onChange={handleChange}
              error={errors.productInformation?.productTitle}
            />
          </InputGroup>
          <InputGroup
            title="Product ID"
            subTitle="Input product ID."
            popper="Need to be added"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="ID"
              name=""
              value={values.productInformation.productTitle}
              onChange={handleChange}
              error={errors.productInformation?.productTitle}
            />
          </InputGroup>
          <InputGroup title="Product ID Type" popper="Need to be added">
            <Field
              fieldType={FieldType.Input}
              placeholder="ID type"
              name=""
              value={values.productInformation.productTitle}
              onChange={handleChange}
              error={errors.productInformation?.productTitle}
            />
          </InputGroup>
          <InputGroup
            title="Brand Name"
            subTitle="Input brand name of product"
            popper="Need to be added"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="Brand name"
              name=""
              value={values.productInformation.productTitle}
              onChange={handleChange}
              error={errors.productInformation?.productTitle}
            />
          </InputGroup>
          <InputGroup
            title="Material"
            subTitle="Input material of product"
            popper="Need to be added"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="Material"
              name=""
              value={values.productInformation.productTitle}
              onChange={handleChange}
              error={errors.productInformation?.productTitle}
            />
          </InputGroup>
          <InputGroup title="Manufacture name" popper="Need to be added">
            <Field
              fieldType={FieldType.Input}
              placeholder="Manufacture name"
              name=""
              value={values.productInformation.productTitle}
              onChange={handleChange}
              error={errors.productInformation?.productTitle}
            />
          </InputGroup>
          <InputGroup title="Manufacture model name" popper="Need to be added">
            <Field
              fieldType={FieldType.Input}
              placeholder="Model name"
              name=""
              value={values.productInformation.productTitle}
              onChange={handleChange}
              error={errors.productInformation?.productTitle}
            />
          </InputGroup>
          <InputGroup title="Manufacture part number" popper="Need to be added">
            <Field
              fieldType={FieldType.Input}
              placeholder="Part number"
              name=""
              value={values.productInformation.productTitle}
              onChange={handleChange}
              error={errors.productInformation?.productTitle}
            />
          </InputGroup>
        </Collapse>
      </AdditionalContainer>
      <ProductInformationButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
