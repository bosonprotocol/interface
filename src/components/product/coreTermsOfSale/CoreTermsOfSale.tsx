import { useConfigContext } from "components/config/ConfigContext";
import styled from "styled-components";

import { useForm } from "../../../lib/utils/hooks/useForm";
import { FormField, Input, Select } from "../../form";
import BosonButton from "../../ui/BosonButton";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "../Product.styles";
import { getOptionsCurrencies } from "../utils";
import { CoreTermsOfSaleDates } from "./CoreTermsOfSaleDates";

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
  const { config } = useConfigContext();
  const OPTIONS_CURRENCIES = getOptionsCurrencies(config.envConfig);

  const { nextIsDisabled } = useForm();

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
            subTitle="How many units do you want to sell?"
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

      <CoreTermsOfSaleDates prefix={prefix} />
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
