import styled from "styled-components";

import { Datepicker, FormField, Input, Select } from "../form";
import BosonButton from "../ui/BosonButton";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import { OPTIONS_CURRENCIES, OPTIONS_TOKEN_GATED } from "./utils";
import { useCreateForm } from "./utils/useCreateForm";

const PriceContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(8.75rem, 1fr);
  grid-gap: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563px;
`;

export default function CoreTermsOfSale() {
  const { nextIsDisabled } = useCreateForm();

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Core Terms of Sale</SectionTitle>
      <FormField
        title="Price"
        required
        subTitle="Input the selling price of the selected item. Note that the price includes shipping."
      >
        <PriceContainer>
          <div>
            <Input
              placeholder="Token amount"
              name="coreTermsOfSale.price"
              type="number"
              min="0"
              step="0.0000000001"
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
      <FormField
        title="Quantity"
        required
        subTitle="How many products do you want to sell?"
      >
        <Input
          placeholder="Input the amount"
          name="coreTermsOfSale.quantity"
          type="number"
          min="1"
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
        required
        subTitle="Redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Datepicker name="coreTermsOfSale.redemptionPeriod" period selectTime />
      </FormField>
      <FormField
        title="Offer Validity period"
        required
        subTitle="The Offer validity period is the time in which buyers can commit to your offer."
      >
        <Datepicker
          name="coreTermsOfSale.offerValidityPeriod"
          period
          selectTime
        />
      </FormField>
      <ProductInformationButtonGroup>
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={nextIsDisabled}
        >
          Next
        </BosonButton>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
