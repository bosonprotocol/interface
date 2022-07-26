import { useFormikContext } from "formik";
import styled from "styled-components";

import Field, { FieldType } from "../form/Field";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";
import type { CreateProductForm } from "./validation/createProductValidationSchema";

const PriceContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(8.75rem, 1fr);
  grid-gap: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563px;
`;

export default function CoreTermsOfSale() {
  const { handleChange, values, errors } =
    useFormikContext<CreateProductForm>();
  return (
    <ContainerProductPage>
      <Typography tag="h2">Core Terms of Sale</Typography>
      <InputGroup
        title="Price*"
        subTitle="Input the selling price of the selected item. Note that the price includes shipping."
      >
        <PriceContainer>
          <Field
            fieldType={FieldType.Input}
            placeholder="Name"
            name=""
            value=""
            onChange={handleChange}
            error=""
          />
          <Field fieldType={FieldType.Select} disabled />
        </PriceContainer>
      </InputGroup>
      <InputGroup
        title="Quantity*"
        subTitle="How many of this item do you want to sell? You can change this value for each variant."
      >
        <Field
          fieldType={FieldType.Textarea}
          placeholder="Input the amount"
          name=""
          value=""
          onChange={handleChange}
          error=""
        />
      </InputGroup>
      <InputGroup
        title="Token gated offer"
        subTitle="Limit the purchase of your item to users holding a specific token."
      >
        <Field fieldType={FieldType.Select} placeholder="Click to select" />
      </InputGroup>
      <InputGroup
        title="Redemption period*"
        subTitle="Redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Field
          fieldType={FieldType.Input}
          placeholder="Jun 24 – Dec 21"
          name=""
          value=""
          onChange={handleChange}
          error=""
        />
      </InputGroup>
      <InputGroup
        title="Offer Validity period*"
        subTitle="The Offer validity period is the time in which buyers can commit to your offer."
      >
        <Field
          fieldType={FieldType.Input}
          placeholder="Jun 24 – Dec 21"
          name=""
          value=""
          onChange={handleChange}
          error=""
        />
      </InputGroup>
      <ProductInformationButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
