import styled from "styled-components";

import { Datepicker, FormField, Input, Select, Textarea } from "../form";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { MOCK_OPTIONS } from "./const";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";

const PriceContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(8.75rem, 1fr);
  grid-gap: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563px;
`;

export default function CoreTermsOfSale() {
  return (
    <ContainerProductPage>
      <Typography tag="h2">Core Terms of Sale</Typography>
      <FormField
        title="Price"
        required={true}
        subTitle="Input the selling price of the selected item. Note that the price includes shipping."
      >
        <PriceContainer>
          <div>
            <Input placeholder="Price" name="coreTermsOfSale.price" />
          </div>
          <div>
            <Select name="coreTermsOfSale.price" options={MOCK_OPTIONS} />
          </div>
        </PriceContainer>
      </FormField>
      <FormField
        title="Quantity"
        required={true}
        subTitle="How many of this item do you want to sell? You can change this value for each variant."
      >
        <Textarea
          placeholder="Input the amount"
          name="coreTermsOfSale.amount"
        />
      </FormField>
      <FormField
        title="Token gated offer"
        subTitle="Limit the purchase of your item to users holding a specific token."
      >
        <Select name="coreTermsOfSale.price" options={MOCK_OPTIONS} />
      </FormField>
      <FormField
        title="Redemption period"
        required={true}
        subTitle="Redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Datepicker name="coreTermsOfSale.redemptionPeriod" />
      </FormField>
      <FormField
        title="Offer Validity period"
        required={true}
        subTitle="The Offer validity period is the time in which buyers can commit to your offer."
      >
        <Datepicker name="coreTermsOfSale.offerValidityPeriod" />
      </FormField>
      <ProductInformationButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
