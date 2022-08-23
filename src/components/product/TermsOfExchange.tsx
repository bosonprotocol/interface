import { Check } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import FairExchangePolicy from "../exchangePolicy/FairExchangePolicy";
import { FormField, Input, Select } from "../form";
import Button from "../ui/Button";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import {
  OPTIONS_DISPUTE_RESOLVER,
  OPTIONS_EXCHANGE_POLICY,
  OPTIONS_PERIOD,
  OPTIONS_UNIT
} from "./utils/const";
import { useCreateForm } from "./utils/useCreateForm";

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
  background: ${colors.lightGrey};
  > p {
    margin: 0;
  }
  p {
    font-size: 0.75rem;
  }
`;

export default function TermsOfExchange() {
  const { nextIsDisabled } = useCreateForm();

  return (
    <TermsOfExchangeContainer>
      <MainContainer>
        <FormWrapper>
          <SectionTitle tag="h2">Terms of Exchange</SectionTitle>
          <FormField
            title="Exchange policy"
            required
            subTitle="The exchange policy covers the contractual terms of the exchange to protect seller and buyer."
            tooltip="TODO: add"
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
            subTitle="If the buyer fails to redeem the item within the redemption period they will be receive back the payment minus the buyer cancel penalty."
            tooltip="TODO: add"
          >
            <FieldContainer>
              <div>
                <Input
                  placeholder="Buyer cancellation penalty"
                  name="termsOfExchange.buyerCancellationPenalty"
                  type="number"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Select
                  placeholder="Choose unit..."
                  name="termsOfExchange.buyerCancellationPenaltyUnit"
                  options={OPTIONS_UNIT}
                />
              </div>
            </FieldContainer>
          </FormField>
          <FormField
            title="Seller deposit"
            required
            subTitle="The seller deposit is charged when a buyers commits to the offer and is used to hold the seller accountable to follow through with their commitment to deliver the physical item. If you break your commitment as a seller, then your deposit will be transferred to the buyer."
            tooltip="TODO: add"
          >
            <FieldContainer>
              <div>
                <Input
                  placeholder="Seller deposit"
                  name="termsOfExchange.sellerDeposit"
                  type="number"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Select
                  placeholder="Choose unit..."
                  name="termsOfExchange.sellerDepositUnit"
                  options={OPTIONS_UNIT}
                />
              </div>
            </FieldContainer>
          </FormField>
          <FormField
            title="Dispute Resolver"
            required
            subTitle="Dispute Resolver will resolve disputes between buyer and seller in case they arise."
          >
            <Select
              placeholder="Choose Dispute Resolver..."
              name="termsOfExchange.disputeResolver"
              options={OPTIONS_DISPUTE_RESOLVER}
              disabled
            />
          </FormField>
          <FormField
            title="Dispute Period"
            required
            subTitle="The time a buyer has to raise a dispute after they redeemed. When the dispute period passes, you will receive payment for the item."
          >
            <FieldContainer>
              <div>
                <Input
                  placeholder="Dispute Period"
                  name="termsOfExchange.disputePeriod"
                  type="number"
                  min="0"
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
            <Button theme="secondary" type="submit" disabled={nextIsDisabled}>
              Next
            </Button>
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
