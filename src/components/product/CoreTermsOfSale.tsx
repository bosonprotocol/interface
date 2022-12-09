import { useState } from "react";
import styled from "styled-components";

import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import { Datepicker, FormField, Input, Select, Textarea } from "../form";
import BosonButton from "../ui/BosonButton";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import {
  OPTIONS_CURRENCIES,
  OPTIONS_TOKEN_GATED,
  TOKEN_CRITERIA,
  TOKEN_TYPES
} from "./utils";
import { useCreateForm } from "./utils/useCreateForm";

const PriceContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(8.75rem, 1fr);
  grid-gap: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563px;
`;

const TokengatedTextarea = styled(Textarea)`
  padding: 0.5rem;
`;

interface Props {
  isMultiVariant: boolean;
}

export default function CoreTermsOfSale({ isMultiVariant }: Props) {
  const { nextIsDisabled, values } = useCreateForm();
  const core = useCoreSDK();
  const [symbol, setSymbol] = useState<string | undefined>(undefined);

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
        />

        {values[prefix].tokenGatedOffer.value === "true" && (
          <>
            {/* TODO: enable once we have more than one variant */}
            {/* <TokengatedInfoWrapper>
              <FormField title="Variant" style={{ margin: "1rem 0 0 0" }}>
                <Select
                  name="coreTermsOfSale.tokenGatedVariants"
                  options={TOKEN_GATED_VARIANTS}
                />
              </FormField>
            </TokengatedInfoWrapper> */}

            <FormField title="Token Contract" style={{ margin: "1rem 0 0 0" }}>
              <Input
                name={`${prefix}.tokenContract`}
                type="string"
                onBlur={async () => {
                  const tokenContract = values[prefix].tokenContract;
                  const tokenType = values[prefix].tokenType;
                  if (
                    tokenContract &&
                    tokenContract?.length > 0 &&
                    tokenType?.value === TOKEN_TYPES[0].value
                  ) {
                    try {
                      const { symbol: symbolLocal } =
                        await core.getExchangeTokenInfo(tokenContract);
                      if (symbolLocal.length > 0) {
                        setSymbol(symbolLocal);
                      } else {
                        setSymbol(undefined);
                      }
                    } catch (error) {
                      setSymbol(undefined);
                    }
                  }
                }}
              />
            </FormField>

            <TokengatedInfoWrapper>
              <FormField title="Token Type:" style={{ margin: "1rem 0 0 0" }}>
                <Select name={`${prefix}.tokenType`} options={TOKEN_TYPES} />
              </FormField>

              <div>
                <FormField
                  title="Token Gating Description:"
                  style={{ margin: "1rem 0 0 0" }}
                  tooltip="This offer requires to own at least one NFT of Makersplace collection: https://opensea.io/collection/makersplace"
                >
                  <TokengatedTextarea
                    name={`${prefix}.tokenGatingDesc`}
                    placeholder="Token Gating Description"
                  />
                </FormField>
              </div>
            </TokengatedInfoWrapper>
            <FormField title="Max commits:" style={{ margin: "1rem 0 0 0" }}>
              <Input name={`${prefix}.maxCommits`} type="string" />
            </FormField>
            <>
              {values[prefix].tokenType?.value === TOKEN_TYPES[1].value && (
                <div>
                  <FormField title="Criteria:" style={{ margin: "1rem 0 0 0" }}>
                    <Select
                      name={`${prefix}.tokenCriteria`}
                      options={TOKEN_CRITERIA}
                    />
                  </FormField>
                </div>
              )}

              {(values[prefix].tokenCriteria?.value ===
                TOKEN_CRITERIA[0].value ||
                values[prefix].tokenType?.value === TOKEN_TYPES[0].value ||
                values[prefix].tokenType?.value === TOKEN_TYPES[2].value) && (
                <TokengatedBalanceWrapper>
                  <FormField
                    title="Min Balance:"
                    style={{ margin: "1rem 0 0 0" }}
                  >
                    <Input
                      style={{ width: "100%" }}
                      name={`${prefix}.minBalance`}
                      type="string"
                    />
                  </FormField>
                  {symbol &&
                    values[prefix].tokenType?.value ===
                      TOKEN_TYPES[0].value && (
                      <SymbolInput
                        type="string"
                        name={`${prefix}.symbol`}
                        value={symbol}
                        disabled
                      />
                    )}
                </TokengatedBalanceWrapper>
              )}
              {((values[prefix].tokenCriteria?.value ===
                TOKEN_CRITERIA[1].value &&
                values[prefix].tokenType?.value === TOKEN_TYPES[1].value) ||
                values[prefix].tokenType?.value === TOKEN_TYPES[2].value) && (
                <FormField title="TokenId:" style={{ margin: "1rem 0 0 0" }}>
                  <Input name={`${prefix}.tokenId`} type="string" />
                </FormField>
              )}
            </>
          </>
        )}
      </FormField>
      <FormField
        title="Offer Validity period"
        required
        subTitle="The Offer validity period is the time in which buyers can commit to your offer."
      >
        <Datepicker name={`${prefix}.offerValidityPeriod`} period selectTime />
      </FormField>
      <FormField
        title="Redemption period"
        required
        subTitle="Redemption period is the time in which buyers can redeem the rNFT for the physical item."
      >
        <Datepicker name={`${prefix}.redemptionPeriod`} period selectTime />
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

const TokengatedInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(8.75rem, 1fr) 4fr;
  grid-gap: 1rem;
`;

const TokengatedBalanceWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-end;
`;

const SymbolInput = styled(Input)`
  width: 20%;
  height: 100%;
  margin-top: 20px;
`;
