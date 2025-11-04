import { useConfigContext } from "components/config/ConfigContext";
import { SwitchForm } from "components/form/Switch";
import { Typography } from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import { useEffect } from "react";
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
  width: 100%;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563px;
`;

const gridProps = {
  justifyContent: "flex-end"
} as const;

interface Props {
  isMultiVariant: boolean;
}

export default function CoreTermsOfSale({ isMultiVariant }: Props) {
  const { config } = useConfigContext();
  const OPTIONS_CURRENCIES = getOptionsCurrencies(config.envConfig);

  const { values, setFieldValue, nextIsDisabled } = useForm();

  const prefix = isMultiVariant ? "variantsCoreTermsOfSale" : "coreTermsOfSale";

  const isPriceDiscoveryOffer =
    !isMultiVariant && !!values["coreTermsOfSale"].isPriceDiscoveryOffer;
  useEffect(() => {
    if (isPriceDiscoveryOffer) {
      setFieldValue(`${prefix}.price`, 0);
    }
  }, [isPriceDiscoveryOffer, setFieldValue, prefix]);

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Core Terms of Sale</SectionTitle>
      {!isMultiVariant && (
        <>
          <FormField
            title="Price"
            required
            subTitle={
              !isPriceDiscoveryOffer
                ? "Input the selling price of the selected item. Note that the price includes shipping."
                : "This offer will use a price discovery mechanism to determine the final selling price."
            }
            titleIcon={
              <SwitchForm
                name={`${prefix}.isPriceDiscoveryOffer`}
                gridProps={gridProps}
                leftChildren
                label={() => (
                  <Typography
                    color={colors.violet}
                    fontSize="0.8rem"
                    cursor="pointer"
                  >
                    use a price discovery mechanism
                  </Typography>
                )}
              />
            }
          >
            <PriceContainer>
              {!isPriceDiscoveryOffer && (
                <div>
                  <Input
                    placeholder="Token amount"
                    name={`${prefix}.price`}
                    type="number"
                    min="0"
                    step="0.0000000001"
                  />
                </div>
              )}
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
