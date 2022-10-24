import styled from "styled-components";

import { Datepicker, FormField, Input, Select } from "../form";
import Button from "../ui/Button";
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

interface Props {
  isMultiVariant: boolean;
}
export default function CoreTermsOfSale({ isMultiVariant }: Props) {
  const { nextIsDisabled } = useCreateForm();
  const prefix = isMultiVariant ? "variantsCoreTermsOfSale" : "coreTermsOfSale";
  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Core Terms of Sale</SectionTitle>
      {!isMultiVariant && (
        <>
          <FormField
            title="Price"
            required
            subTitle="Input the selling price of the selected item. Note that the price includes shipping."
          >
            <PriceContainer>
              <div>
                <Input
                  placeholder="Token amount"
                  name={`${prefix}.price`}
                  type="number"
                  min="0"
                  step="0.0000000001"
                />
              </div>
              <div>
                <Select
                  placeholder="Choose currency"
                  name={`${prefix}.currency`}
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
              name={`${prefix}.quantity`}
              type="number"
              min="1"
            />
          </FormField>
        </>
      )}
      <FormField
        title="Token gated offer"
        subTitle="Limit the purchase of your item to users holding a specific token."
      >
        <Select
          name={`${prefix}.tokenGatedOffer`}
          options={OPTIONS_TOKEN_GATED}
          disabled
        />
      </FormField>
      <FormField
        title="Redemption period"
        required
        subTitle="Redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Datepicker name={`${prefix}.redemptionPeriod`} period selectTime />
      </FormField>
      <FormField
        title="Offer Validity period"
        required
        subTitle="The Offer validity period is the time in which buyers can commit to your offer."
      >
        <Datepicker name={`${prefix}.offerValidityPeriod`} period selectTime />
      </FormField>
      <ProductInformationButtonGroup>
        <Button theme="primary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
