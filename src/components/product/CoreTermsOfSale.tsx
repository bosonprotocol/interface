import styled from "styled-components";

import { Datepicker, FormField, Input, Select } from "../form";
import Button from "../ui/Button";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import { OPTIONS_CURRENCIES, OPTIONS_TOKEN_GATED } from "./utils";
import { useThisForm } from "./utils/useThisForm";

const PriceContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(8.75rem, 1fr);
  grid-gap: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563px;
`;

export default function CoreTermsOfSale() {
  const { nextIsDisabled } = useThisForm();

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Core Terms of Sale</SectionTitle>
      <FormField
        title="Price"
        required={true}
        subTitle="Input the selling price of the selected item. Note that the price includes shipping."
      >
        <PriceContainer>
          <div>
            <Input
              placeholder="Token amount"
              name="coreTermsOfSale.price"
              type="number"
              min="0"
            />
          </div>
          <div>
            <Select
              placeholder="Choose currency"
              name="coreTermsOfSale.currency"
              options={OPTIONS_CURRENCIES}
            />
          </div>
        </PriceContainer>
      </FormField>
      {/* TODO: use price for all variants */}
      <FormField
        title="Quantity"
        required={true}
        subTitle="How many of this item do you want to sell? You can change this value for each variant."
      >
        <Input
          placeholder="Input the amount"
          name="coreTermsOfSale.quantity"
          type="number"
          min="0"
        />
      </FormField>
      <FormField
        title="Token gated offer"
        subTitle="Limit the purchase of your item to users holding a specific token."
      >
        <Select
          name="coreTermsOfSale.tokenGatedOffer"
          options={OPTIONS_TOKEN_GATED}
          disabled
        />
      </FormField>
      <FormField
        title="Redemption period"
        required={true}
        subTitle="Redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Datepicker name="coreTermsOfSale.redemptionPeriod" period />
      </FormField>
      <FormField
        title="Offer Validity period"
        required={true}
        subTitle="The Offer validity period is the time in which buyers can commit to your offer."
      >
        <Datepicker name="coreTermsOfSale.offerValidityPeriod" period />
      </FormField>
      <ProductInformationButtonGroup>
        <Button theme="secondary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
