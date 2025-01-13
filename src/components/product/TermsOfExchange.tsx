import { useConfigContext } from "components/config/ConfigContext";
import { Check } from "phosphor-react";
import { useEffect, useMemo } from "react";
import styled from "styled-components";

import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { useForm } from "../../lib/utils/hooks/useForm";
import { Token } from "../convertion-rate/ConvertionRateContext";
import FairExchangePolicy from "../exchangePolicy/FairExchangePolicy";
import { FormField, Input, Select } from "../form";
import BosonButton from "../ui/BosonButton";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import {
  OPTIONS_DISPUTE_RESOLVER,
  OPTIONS_EXCHANGE_POLICY,
  OPTIONS_PERIOD,
  OPTIONS_UNIT,
  optionUnitKeys,
  PERCENT_OPTIONS_UNIT,
  ProductTypeVariantsValues
} from "./utils/const";

const TermsOfExchangeContainer = styled(ContainerProductPage)`
  max-width: 100%;
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(23.25rem, 1fr);
  grid-gap: 2.5rem;
`;

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(8.75rem, 1fr);
  grid-gap: 1rem;
  width: 100%;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563rem;
`;

const CheckIconWrapper = styled.div`
  margin-left: 0.25rem;
  border-radius: 50%;
  width: 1.188rem;
  height: 1.188rem;
  background: ${colors.green};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.div``;
const InfoWrapper = styled.div`
  padding-top: 6rem;
`;

const InfoWrapperList = styled.div`
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  background: ${colors.greyLight};
  > p {
    margin: 0;
  }
  p {
    font-size: 0.75rem;
  }
`;

export default function TermsOfExchange() {
  const { config } = useConfigContext();
  const { values, setFieldValue, nextIsDisabled } = useForm();
  const isMultiVariant =
    values.productType?.productVariant ===
      ProductTypeVariantsValues.differentVariants &&
    new Set(
      values.productVariants?.variants?.map(
        (variant: { currency: { value: string } }) => variant.currency.value
      )
    ).size > 1;
  const maxPricePenOrSellerDeposit =
    values.productType?.productVariant ===
    ProductTypeVariantsValues.differentVariants
      ? Math.min(
          ...(values.productVariants?.variants?.map(
            (variant: { price: string }) => variant.price
          ) ?? [])
        )
      : values.coreTermsOfSale?.price;
  const currency: string =
    values.productType?.productVariant ===
    ProductTypeVariantsValues.differentVariants
      ? values.productVariants?.variants?.[0]?.currency?.label || ""
      : values.coreTermsOfSale?.currency?.label || "";
  const exchangeToken = config.envConfig.defaultTokens?.find(
    (n: Token) =>
      n.symbol ===
      (values.productType?.productVariant ===
      ProductTypeVariantsValues.differentVariants
        ? values.productVariants?.variants?.[0]?.currency?.label
        : values.coreTermsOfSale?.currency?.label)
  );
  const decimals = exchangeToken?.decimals;
  const step = 10 ** -(decimals || 0);
  const optionsUnitWithCurrency = useMemo(
    () =>
      OPTIONS_UNIT.map((option) => {
        if (option.value === optionUnitKeys.fixed) {
          return {
            value: option.value,
            label: currency
          };
        }
        return option;
      }),
    [currency]
  );
  const optionsUnitToShow = useMemo(() => {
    return isMultiVariant ? PERCENT_OPTIONS_UNIT : optionsUnitWithCurrency;
  }, [isMultiVariant, optionsUnitWithCurrency]);
  useEffect(() => {
    const buyerUnit = (
      optionsUnitToShow as { value: string; label: string }[]
    ).find(
      (option) =>
        option.value ===
        values.termsOfExchange?.buyerCancellationPenaltyUnit?.value
    );
    if (optionsUnitToShow.length === 1 && !buyerUnit) {
      setFieldValue(
        "termsOfExchange.buyerCancellationPenaltyUnit",
        optionsUnitToShow[0]
      );
      setFieldValue("termsOfExchange.buyerCancellationPenalty", "");
    } else if (
      buyerUnit &&
      values.termsOfExchange?.buyerCancellationPenaltyUnit?.label !==
        buyerUnit.label
    ) {
      setFieldValue("termsOfExchange.buyerCancellationPenaltyUnit", buyerUnit);
      setFieldValue("termsOfExchange.buyerCancellationPenalty", "");
    }
  }, [
    optionsUnitToShow,
    setFieldValue,
    values.termsOfExchange?.buyerCancellationPenaltyUnit?.label,
    values.termsOfExchange?.buyerCancellationPenaltyUnit?.value
  ]);

  useEffect(() => {
    const sellerUnit = (
      optionsUnitToShow as { value: string; label: string }[]
    ).find(
      (option) =>
        option.value === values.termsOfExchange?.sellerDepositUnit?.value
    );
    if (optionsUnitToShow.length === 1 && !sellerUnit) {
      setFieldValue("termsOfExchange.sellerDepositUnit", optionsUnitToShow[0]);
      setFieldValue("termsOfExchange.sellerDeposit", "");
    } else if (
      sellerUnit &&
      values.termsOfExchange?.sellerDepositUnit?.label !== sellerUnit.label
    ) {
      setFieldValue("termsOfExchange.sellerDepositUnit", sellerUnit);
      setFieldValue("termsOfExchange.sellerDeposit", "");
    }
  }, [
    optionsUnitToShow,
    setFieldValue,
    values.termsOfExchange?.sellerDepositUnit?.label,
    values.termsOfExchange?.sellerDepositUnit?.value
  ]);
  return (
    <TermsOfExchangeContainer>
      <MainContainer>
        <FormWrapper>
          <SectionTitle tag="h2">Terms of Exchange</SectionTitle>
          <FormField
            title="Exchange policy"
            required
            subTitle="The exchange policy covers both contractual and protocol terms of the exchange that protect buyer and seller."
          >
            <Select
              placeholder="Choose exchange policy..."
              name="termsOfExchange.exchangePolicy"
              options={OPTIONS_EXCHANGE_POLICY}
              disabled
            />
          </FormField>
          <FormField
            title="Buyer cancellation penalty"
            required
            subTitle="If the buyer fails to redeem the item within the redemption period, they will be reimbursed the amount paid minus the buyer cancellation penalty."
          >
            <FieldContainer>
              <div>
                {values.termsOfExchange?.buyerCancellationPenaltyUnit?.value ===
                optionUnitKeys["%"] ? (
                  <Input
                    placeholder="Buyer cancellation penalty"
                    name="termsOfExchange.buyerCancellationPenalty"
                    type="number"
                    min="0"
                    max="100"
                    step="0.001"
                  />
                ) : (
                  <Input
                    placeholder="Buyer cancellation penalty"
                    name="termsOfExchange.buyerCancellationPenalty"
                    type="number"
                    min="0"
                    max={maxPricePenOrSellerDeposit}
                    step={step}
                  />
                )}
              </div>
              <div>
                <Select
                  placeholder="Choose unit..."
                  name="termsOfExchange.buyerCancellationPenaltyUnit"
                  options={optionsUnitToShow}
                />
              </div>
            </FieldContainer>
          </FormField>
          <FormField
            title="Seller deposit"
            required
            subTitle="The seller deposit is used to ensure that the seller follows through with their commitment to deliver the physical item and is charged when a buyer commits to the offer. If a seller breaks this commitment, then the seller deposit will be transferred to the buyer along with the amount the buyer paid for the offer. A deposit value is required to be set below, but it is up to the seller to choose this value or set it to 0."
          >
            <FieldContainer>
              <div>
                {values.termsOfExchange?.sellerDepositUnit?.value === "%" ? (
                  <Input
                    placeholder="Seller deposit"
                    name="termsOfExchange.sellerDeposit"
                    type="number"
                    min="0"
                    max="100"
                    step="0.001"
                  />
                ) : (
                  <Input
                    placeholder="Seller deposit"
                    name="termsOfExchange.sellerDeposit"
                    type="number"
                    min="0"
                    max={maxPricePenOrSellerDeposit}
                    step={step}
                  />
                )}
              </div>
              <div>
                <Select
                  placeholder="Choose unit..."
                  name="termsOfExchange.sellerDepositUnit"
                  options={optionsUnitToShow}
                />
              </div>
            </FieldContainer>
          </FormField>
          <FormField
            title="Dispute resolver"
            required
            subTitle="The dispute resolver will resolve disputes between buyer and seller when disputes arise."
          >
            <Select
              placeholder="Choose Dispute Resolver..."
              name="termsOfExchange.disputeResolver"
              options={OPTIONS_DISPUTE_RESOLVER}
              disabled
            />
          </FormField>
          <FormField
            title="Dispute period"
            required
            subTitle="The time a buyer has to raise a dispute after the offer was redeemed. When the dispute period ends, the seller will receive payment for the item."
          >
            <FieldContainer>
              <div>
                <Input
                  placeholder="Dispute Period"
                  name="termsOfExchange.disputePeriod"
                  type="number"
                  min={CONFIG.minimumDisputePeriodInDays}
                  step="1"
                />
              </div>
              <div>
                <Select
                  placeholder="Choose Dispute Period Unit..."
                  name="termsOfExchange.disputePeriodUnit"
                  options={OPTIONS_PERIOD}
                />
              </div>
            </FieldContainer>
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
        </FormWrapper>
        <InfoWrapper>
          <InfoWrapperList>
            <FairExchangePolicy
              policyIcon={
                <CheckIconWrapper>
                  <Check size={13} />
                </CheckIconWrapper>
              }
            />
          </InfoWrapperList>
        </InfoWrapper>
      </MainContainer>
    </TermsOfExchangeContainer>
  );
}
