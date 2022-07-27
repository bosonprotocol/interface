import styled from "styled-components";

import { Datepicker, Input, Select, Textarea } from "../form";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
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
      <InputGroup
        title="Price*"
        subTitle="Input the selling price of the selected item. Note that the price includes shipping."
      >
        <PriceContainer>
          <Input placeholder="Price" name="coreTermsOfSale.price" />
          {/* // TODO: add currencies */}
          <Select
            name="coreTermsOfSale.price"
            options={[{ value: "ETH", label: "ETH" }]}
          />
        </PriceContainer>
      </InputGroup>
      <InputGroup
        title="Quantity*"
        subTitle="How many of this item do you want to sell? You can change this value for each variant."
      >
        <Textarea
          placeholder="Input the amount"
          name="coreTermsOfSale.amount"
        />
      </InputGroup>
      <InputGroup
        title="Token gated offer"
        subTitle="Limit the purchase of your item to users holding a specific token."
      >
        {/* TODO: */}
        <Select
          name="coreTermsOfSale.price"
          options={[{ value: "0", label: "0" }]}
        />
      </InputGroup>
      <InputGroup
        title="Redemption period*"
        subTitle="Redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Datepicker name="coreTermsOfSale.redemptionPeriod" />
      </InputGroup>
      <InputGroup
        title="Offer Validity period*"
        subTitle="The Offer validity period is the time in which buyers can commit to your offer."
      >
        <Datepicker name="coreTermsOfSale.offerValidityPeriod" />
      </InputGroup>
      <ProductInformationButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
