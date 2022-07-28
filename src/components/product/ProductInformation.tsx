import { FieldArray } from "formik";
import { Plus } from "phosphor-react";
import { useMemo } from "react";
import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import { colors } from "../../lib/styles/colors";
import { FormField, Input, Select, Textarea } from "../form";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import { MOCK_OPTIONS } from "./utils";
import { useThisForm } from "./utils/useThisForm";

const AddProductContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 3fr;
  grid-gap: 1rem;
  margin-bottom: 1rem;
`;

const AdditionalContainer = styled.div`
  margin-top: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563rem;
`;

const AddAttributesContainer = () => {
  const { values } = useThisForm();

  const elements = useMemo(
    () => values?.productInformation?.attributes,
    [values?.productInformation?.attributes]
  );

  return (
    <FormField title="Add product attribute" tooltip="TODO: add">
      <FieldArray
        name="productInformation.attributes"
        render={(arrayHelpers) => {
          const render = elements && elements.length > 0;

          return (
            <>
              {render && (
                <>
                  {elements.map((el: unknown, key: number) => (
                    <AddProductContainer key={`add_product_container_${key}`}>
                      <div>
                        <Input
                          placeholder="Attribute"
                          name={`productInformation.attributes[${key}].name`}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Attribute Value"
                          name={`productInformation.attributes[${key}].value`}
                        />
                      </div>
                    </AddProductContainer>
                  ))}
                </>
              )}
              <Button
                onClick={() => arrayHelpers.push("")}
                theme="blankSecondary"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                Add new <Plus size={18} />
              </Button>
            </>
          );
        }}
      />
    </FormField>
  );
};
export default function ProductInformation() {
  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Product Information</SectionTitle>
      <FormField
        title="Product Title"
        required={true}
        subTitle="Use words people would search for when looking for your item."
      >
        <Input
          name="productInformation.productTitle"
          placeholder="Product title"
        />
      </FormField>
      <FormField
        title="Description"
        required={true}
        subTitle="Describe your product. Provide as much detail as possible."
      >
        <Textarea
          name="productInformation.description"
          placeholder="Describe"
        />
      </FormField>
      <FormField
        title="Category"
        required={true}
        subTitle="Select the category that best matches your product."
      >
        <Select
          placeholder="Choose category..."
          name="productInformation.category"
          options={MOCK_OPTIONS}
          isClearable
        />
      </FormField>
      <FormField
        title="Search Tags"
        required={true}
        subTitle="Input any relevant tags to make your offer stand out."
      >
        <Select
          placeholder="Choose tags..."
          name="productInformation.tags"
          isMulti
          options={MOCK_OPTIONS}
        />
      </FormField>
      <AddAttributesContainer />
      <AdditionalContainer>
        <Collapse
          title={<Typography tag="h3">Additional information</Typography>}
        >
          <FormField
            title="SKU"
            subTitle="Input product serial number."
            tooltip="TODO: add"
          >
            <Input placeholder="SKU" name="productInformation.sku" />
          </FormField>
          <FormField
            title="Product ID"
            subTitle="Input product ID."
            tooltip="TODO: add"
          >
            <Input placeholder="ID" name="productInformation.id" />
          </FormField>
          <FormField title="Product ID Type" tooltip="TODO: add">
            <Input placeholder="ID Type" name="productInformation.idType" />
          </FormField>
          <FormField
            title="Brand Name"
            subTitle="Input brand name of product"
            tooltip="TODO: add"
          >
            <Input
              placeholder="Brand name"
              name="productInformation.brandName"
            />
          </FormField>
          <FormField
            title="Material"
            subTitle="Input material of product"
            tooltip="TODO: add"
          >
            <Input placeholder="Material" name="productInformation.material" />
          </FormField>
          <FormField title="Manufacture name" tooltip="TODO: add">
            <Input
              placeholder="Manufacture"
              name="productInformation.manufacture"
            />
          </FormField>
          <FormField title="Manufacture model name" tooltip="TODO: add">
            <Input
              placeholder="Manufacture model name"
              name="productInformation.manufactureModelName"
            />
          </FormField>
          <FormField title="Manufacture part number" tooltip="TODO: add">
            <Input
              placeholder="Part number"
              name="productInformation.partNumber"
            />
          </FormField>
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
