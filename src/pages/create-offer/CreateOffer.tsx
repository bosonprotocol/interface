import { MetadataType } from "@bosonprotocol/react-kit";
import { createOffer } from "@bosonprotocol/widgets-sdk";
import { parseEther } from "@ethersproject/units";
import { useFormik } from "formik";
import { useState } from "react";
import styled from "styled-components";

import Layout from "../../components/Layout";
import Button from "../../components/ui/Button";
import { CONFIG } from "../../lib/config";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";

const CreateOfferContainer = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  > div {
    justify-content: center;
  }
`;

export const StyledForm = styled.form`
  width: 100%;
`;

export const FormElement = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormLabel = styled.label`
  margin-bottom: 6px;
`;

export const FormControl = styled.input`
  font-family: "Plus Jakarta Sans", sans-serif;
  padding: 10px;
  border-radius: 6px;
  border-width: 2px;
  border-color: black;
`;

export const FormElementsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  justify-content: space-between;
  padding-bottom: 24px;

  ${breakpoint.s} {
    grid-template-columns: 1fr 1fr;
  }
`;

const ErrorMsg = styled.div`
  color: ${colors.red};
`;

const dayInMs = 1000 * 60 * 60 * 24;
const minuteInMS = 1000 * 60;

const initialValues = {
  name: `Baggy jeans ${Math.ceil(Math.random() * 1000)}`,
  description: "Lore ipsum",
  externalUrl: window.location.origin,
  schemaUrl: "https://schema.org/schema",
  disputeResolverId: "1",
  price: "0.00002",
  sellerDeposit: "0.00002",
  protocolFee: "0.00001",
  buyerCancelPenalty: "0.00001",
  quantityAvailable: "10",
  exchangeToken: "0x0000000000000000000000000000000000000000",
  voucherRedeemableFromDateInMS: (Date.now() + 3 * minuteInMS).toString(),
  voucherRedeemableUntilDateInMS: (Date.now() + 20 * dayInMs).toString(),
  validFromDateInMS: (Date.now() + 3 * minuteInMS).toString(),
  validUntilDateInMS: (Date.now() + dayInMs).toString(),
  fulfillmentPeriodDurationInMS: dayInMs.toString(),
  resolutionPeriodDurationInMS: dayInMs.toString()
};

export default function CreateOffer() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const core = useCoreSDK();

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        if (!values) {
          return;
        }

        const metadataHash = await core.storeMetadata({
          name: values.name,
          description: values.description,
          externalUrl: values.externalUrl,
          schemaUrl: values.schemaUrl,
          type: MetadataType.BASE
        });
        const metadataUri = `ipfs://${metadataHash}`;

        createOffer(
          {
            ...values,
            price: parseEther(values.price).toString(),
            sellerDeposit: parseEther(values.sellerDeposit).toString(),
            buyerCancelPenalty: parseEther(
              values.buyerCancelPenalty
            ).toString(),
            protocolFee: parseEther(values.protocolFee).toString(),
            metadataHash,
            metadataUri
          },
          CONFIG
        );
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          (error as { message: string })?.message ||
            "There has been an error, please try again"
        );
        console.error(error);
      }
    }
  });

  return (
    <CreateOfferContainer>
      <h1>Create Offer</h1>
      <StyledForm onSubmit={handleSubmit}>
        <FormElementsContainer>
          <FormElement>
            <FormLabel>Name</FormLabel>
            <FormControl
              value={values.name}
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Description</FormLabel>
            <FormControl
              rows={1}
              value={values.description}
              onChange={handleChange}
              name="description"
              as="textarea"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>External Url</FormLabel>
            <FormControl
              value={values.externalUrl}
              onChange={handleChange}
              name="externalUrl"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Schema Url</FormLabel>
            <FormControl
              value={values.schemaUrl}
              onChange={handleChange}
              name="schemaUrl"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Price</FormLabel>
            <FormControl
              value={values.price}
              onChange={handleChange}
              name="price"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>SellerDeposit</FormLabel>
            <FormControl
              value={values.sellerDeposit}
              onChange={handleChange}
              name="sellerDeposit"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>BuyerCancelPenalty</FormLabel>
            <FormControl
              value={values.buyerCancelPenalty}
              onChange={handleChange}
              name="buyerCancelPenalty"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>ProtocolFee</FormLabel>
            <FormControl
              value={values.protocolFee}
              onChange={handleChange}
              name="protocolFee"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Quantity</FormLabel>
            <FormControl
              value={values.quantityAvailable}
              onChange={handleChange}
              name="quantityAvailable"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>DisputeResolverId</FormLabel>
            <FormControl
              value={values.disputeResolverId}
              onChange={handleChange}
              name="disputeResolverId"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Exchange Token</FormLabel>
            <FormControl
              value={values.exchangeToken}
              onChange={handleChange}
              name="exchangeToken"
              type="text"
              placeholder="..."
            />
          </FormElement>

          <FormElement>
            <FormLabel>Valid From Date (ms)</FormLabel>
            <FormControl
              value={values.validFromDateInMS}
              onChange={handleChange}
              name="validFromDateInMS"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Valid Until Date (ms)</FormLabel>
            <FormControl
              value={values.validUntilDateInMS}
              onChange={handleChange}
              name="validUntilDateInMS"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>voucherRedeemableFromDateInMS</FormLabel>
            <FormControl
              value={values.voucherRedeemableFromDateInMS}
              onChange={handleChange}
              name="voucherRedeemableFromDateInMS"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>voucherRedeemableUntilDateInMS</FormLabel>
            <FormControl
              value={values.voucherRedeemableUntilDateInMS}
              onChange={handleChange}
              name="voucherRedeemableUntilDateInMS"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Fulfillment Period Duration (ms)</FormLabel>
            <FormControl
              value={values.fulfillmentPeriodDurationInMS}
              onChange={handleChange}
              name="fulfillmentPeriodDurationInMS"
              type="text"
              placeholder="..."
            />
          </FormElement>
        </FormElementsContainer>
        <SubmitButton type="submit" theme="secondary">
          Submit
        </SubmitButton>
        {errorMessage && (
          <ErrorMsg data-testid="error">{errorMessage}</ErrorMsg>
        )}
      </StyledForm>
    </CreateOfferContainer>
  );
}
