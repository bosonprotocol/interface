import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import { Input, Select, Textarea } from "../form";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";

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
  return (
    <ContainerProductPage>
      <Typography tag="h2">Product Information</Typography>
      <InputGroup
        title="Product Title*"
        subTitle="Use words people would search for when looking for your item."
      >
        <Input
          name="productInformation.productTitle"
          placeholder="Product title"
        />
      </InputGroup>
      <InputGroup
        title="Description*"
        subTitle="Describe your product. Provide as much detail as possible."
      >
        <Textarea name="productInformation.describe" placeholder="Describe" />
      </InputGroup>
      <InputGroup
        title="Category*"
        subTitle="Select the category that best matches your product."
      >
        {/* TODO: */}
        <Select
          name="productInformation.category"
          options={[{ value: "0", label: "0" }]}
        />
      </InputGroup>
      <InputGroup
        title="Search Tags*"
        subTitle="Input any relevant tags to make your offer stand out."
      >
        {/* TODO: */}
        <Select
          name="productInformation.tags"
          options={[{ value: "0", label: "0" }]}
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
          <Input placeholder="Attribute" name="productInformation.attribute" />
          <Input
            placeholder="Attribute Value"
            name="productInformation.attributeValue"
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
            <Input placeholder="SKU" name="productInformation.sku" />
          </InputGroup>
          <InputGroup
            title="Product ID"
            subTitle="Input product ID."
            popper="Need to be added"
          >
            <Input placeholder="ID" name="productInformation.id" />
          </InputGroup>
          <InputGroup title="Product ID Type" popper="Need to be added">
            <Input placeholder="ID Type" name="productInformation.idType" />
          </InputGroup>
          <InputGroup
            title="Brand Name"
            subTitle="Input brand name of product"
            popper="Need to be added"
          >
            <Input
              placeholder="Brand name"
              name="productInformation.brandName"
            />
          </InputGroup>
          <InputGroup
            title="Material"
            subTitle="Input material of product"
            popper="Need to be added"
          >
            <Input placeholder="Material" name="productInformation.material" />
          </InputGroup>
          <InputGroup title="Manufacture name" popper="Need to be added">
            <Input
              placeholder="Manufacture"
              name="productInformation.manufacture"
            />
          </InputGroup>
          <InputGroup title="Manufacture model name" popper="Need to be added">
            <Input
              placeholder="Manufacture model name"
              name="productInformation.manufactureModelName"
            />
          </InputGroup>
          <InputGroup title="Manufacture part number" popper="Need to be added">
            <Input
              placeholder="Part number"
              name="productInformation.partNumber"
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
