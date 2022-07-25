import { useFormikContext } from "formik";
import { Check } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Field, { FieldType } from "../form/Field";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";
import type { CreateProductForm } from "./validation/createProductValidationSchema";

const TermsOfExchangeContainer = styled(ContainerProductPage)`
  max-width: 100%;
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(324px, 1fr);
  grid-gap: 40px;
`;

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(140px, 1fr);
  grid-gap: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 25px;
`;

const CheckIconWrapper = styled.div`
  margin-left: 0.25rem;
  border-radius: 50%;
  width: 19px;
  height: 19px;
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
  padding: 20px 24px 24px 24px;
  background: ${colors.lightGrey};
  > p {
    margin 0;
  }
`;
const InfoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 4px;
  > p {
    margin 0;
  }
`;
const InfoList = styled.ul`
  margin 0 0 0 1.5rem;
  padding: 0;
  line-height: 17px;
`;
const InfoListItem = styled.li`
  margin 0;
  padding 0;
  p {
    font-size: 12px;
    margin: 0;
    color: ${colors.darkGrey};
  }
`;

export default function TermsOfExchange() {
  const { handleChange, values, errors } =
    useFormikContext<CreateProductForm>();
  return (
    <TermsOfExchangeContainer>
      <MainContainer>
        <FormWrapper>
          <Typography tag="h2">Terms of Exchange</Typography>
          <InputGroup
            title="Exchange policy*"
            subTitle="The exchange policy covers the contractual terms of the exchange to protect seller and buyer."
            popper="Need to be added"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="Fair Exchange Policy"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
          <InputGroup
            title="Buyer cancellation  penalty*"
            subTitle="If the buyer fails to redeem the item within the redemption period they will be receive back the payment minus the buyer cancel penalty."
            popper="Need to be added"
          >
            <FieldContainer>
              <Field
                fieldType={FieldType.Input}
                placeholder="10"
                name=""
                value=""
                onChange={handleChange}
                error=""
              />
              <Field
                fieldType={FieldType.Input}
                placeholder="Percent"
                name=""
                value=""
                onChange={handleChange}
                error=""
              />
            </FieldContainer>
          </InputGroup>
          <InputGroup
            title="Seller deposit*"
            subTitle="The seller deposit is charged when a buyers commits to the offer and is used to hold the seller accountable to follow through with their commitment to deliver the physical item. If you break your commitment as a seller, then your deposit will be transferred to the buyer."
            popper="Need to be added"
          >
            <FieldContainer>
              <Field
                fieldType={FieldType.Input}
                placeholder="10"
                name=""
                value=""
                onChange={handleChange}
                error=""
              />
              <Field
                fieldType={FieldType.Input}
                placeholder="Percent"
                name=""
                value=""
                onChange={handleChange}
                error=""
              />
            </FieldContainer>
          </InputGroup>
          <InputGroup
            title="Dispute Resolver*"
            subTitle="Dispute Resolver will resolve disputes between buyer and seller in case they arise."
          >
            <Field
              fieldType={FieldType.Textarea}
              placeholder="Input the amount"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
          <InputGroup
            title="Dispute period*"
            subTitle="The time a buyer has to raise a dispute after they redeemed. When the dispute period passes, you will receive payment for the item."
            popper="Need to be added"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="Click to select"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
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
