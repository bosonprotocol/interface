import { Check } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { FormField, Input, Select } from "../form";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";

const TermsOfExchangeContainer = styled(ContainerProductPage)`
  max-width: 100%;
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(324px, 1fr);
  grid-gap: 2.5rem;
`;

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(140px, 1fr);
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
  padding-top: 5.5rem;
`;

const InfoWrapperList = styled.div`
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  background: ${colors.lightGrey};
  > p {
    margin 0;
  }
`;
const InfoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 0.25rem;
  > p {
    margin 0;
  }
`;
const InfoList = styled.ul`
  margin 0 0 0 1.5rem;
  padding: 0;
  line-height: 1.063rem;
`;
const InfoListItem = styled.li`
  margin 0;
  padding 0;
  p {
    font-size: 0.75rem;
    margin: 0;
    color: ${colors.darkGrey};
  }
`;

export default function TermsOfExchange() {
  return (
    <TermsOfExchangeContainer>
      <MainContainer>
        <FormWrapper>
          <Typography tag="h2">Terms of Exchange</Typography>
          <FormField
            title="Exchange policy"
            required={true}
            subTitle="The exchange policy covers the contractual terms of the exchange to protect seller and buyer."
            tooltip="TODO: add"
          >
            <Select
              placeholder="Fair Exchange Policy"
              name="termsOfExchange.fairExchangePolicy"
              options={[{ value: "0", label: "0" }]}
            />
          </FormField>
          <FormField
            title="Buyer cancellation penalty"
            required={true}
            subTitle="If the buyer fails to redeem the item within the redemption period they will be receive back the payment minus the buyer cancel penalty."
            tooltip="TODO: add"
          >
            <FieldContainer>
              <div>
                <Input
                  placeholder="Buyer cancellation penalty"
                  name="termsOfExchange.buyerCancellationPenalty"
                />
              </div>
              <div>
                <Select
                  placeholder="Percent"
                  name="termsOfExchange.buyerCancellationPenaltyPercent"
                  options={[{ value: "0", label: "0" }]}
                />
              </div>
            </FieldContainer>
          </FormField>
          <FormField
            title="Seller deposit"
            required={true}
            subTitle="The seller deposit is charged when a buyers commits to the offer and is used to hold the seller accountable to follow through with their commitment to deliver the physical item. If you break your commitment as a seller, then your deposit will be transferred to the buyer."
            tooltip="TODO: add"
          >
            <FieldContainer>
              <div>
                <Input
                  placeholder="Seller deposit"
                  name="termsOfExchange.sellerDeposit"
                />
              </div>
              <div>
                <Select
                  placeholder="Percent"
                  name="termsOfExchange.sellerDepositPercent"
                  options={[{ value: "0", label: "0" }]}
                />
              </div>
            </FieldContainer>
          </FormField>
          <FormField
            title="Dispute Resolver"
            required={true}
            subTitle="Dispute Resolver will resolve disputes between buyer and seller in case they arise.            "
          >
            <Select
              placeholder="Percent"
              name="termsOfExchange.disputeResolverPeriod"
              options={[{ value: "0", label: "0" }]}
            />
          </FormField>
          <FormField
            title="Dispute Period"
            required={true}
            subTitle="The time a buyer has to raise a dispute after they redeemed. When the dispute period passes, you will receive payment for the item."
          >
            <FieldContainer>
              <div>
                <Input
                  placeholder="Input the amount"
                  name="termsOfExchange.disputeResolver"
                />
              </div>
              <div>
                <Select
                  placeholder="Percent"
                  name="termsOfExchange.disputeResolverPeriod"
                  options={[{ value: "0", label: "0" }]}
                />
              </div>
            </FieldContainer>
          </FormField>
          <ProductInformationButtonGroup>
            <Button theme="secondary" type="submit">
              Next
            </Button>
          </ProductInformationButtonGroup>
        </FormWrapper>
        <InfoWrapper>
          <InfoWrapperList>
            <InfoTitleWrapper>
              <Typography tag="p">Fair exhange policy </Typography>
              <CheckIconWrapper>
                <Check size={13} />
              </CheckIconWrapper>
            </InfoTitleWrapper>
            <InfoList>
              <InfoListItem>
                <Typography tag="p">30 days to raise a dispute</Typography>
              </InfoListItem>
              <InfoListItem>
                <Typography tag="p">
                  Fair buyer and seller obligations
                </Typography>
              </InfoListItem>
              <InfoListItem>
                <Typography tag="p">Standard evidence requirements</Typography>
              </InfoListItem>
              <InfoListItem>
                <Typography tag="p">
                  15 days to resolve a raised dispute
                </Typography>
              </InfoListItem>
            </InfoList>
          </InfoWrapperList>
        </InfoWrapper>
      </MainContainer>
    </TermsOfExchangeContainer>
  );
}
