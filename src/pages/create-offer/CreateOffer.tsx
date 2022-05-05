import { MetadataType } from "@bosonprotocol/common";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { createOffer } from "@bosonprotocol/widgets-sdk";
import { parseEther } from "@ethersproject/units";
import { useFormik } from "formik";
import { useState } from "react";
import styled from "styled-components";

import { Layout } from "../../components/Layout";
import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";

const CreateOfferContainer = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

const StyledForm = styled.form`
  width: 100%;
`;

const FormElement = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 6px;
`;

const FormControl = styled.input`
  font-family: "Manrope", sans-serif;
  padding: 10px;
  border-radius: 6px;
`;

const Button = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  width: 100%;
  background-color: ${colors.green};
  padding: 10px 0;
  font-size: 16px;
  text-transform: uppercase;
  color: ${colors.navy};
  cursor: pointer;
`;

const FormElementsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  justify-content: space-between;
  padding-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ErrorMsg = styled.div`
  color: ${colors.red};
`;

interface FormValues {
  name: string;
  description: string;
  externalUrl: string;
  schemaUrl: string;
  price: string;
  sellerDeposit: string;
  buyerCancelPenalty: string;
  quantityAvailable: string;
  exchangeToken: string;
  redeemableFromDateInMS: string;
  validFromDateInMS: string;
  validUntilDateInMS: string;
  fulfillmentPeriodDurationInMS: string;
  voucherValidDurationInMS: string;
}

const dayInMs = 1000 * 60 * 60 * 24;
const minuteInMS = 1000 * 60;

export default function CreateOffer() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "Baggy jeans",
      description: "Lore ipsum",
      externalUrl: window.location.origin,
      schemaUrl: "https://schema.org/schema",
      price: "1",
      sellerDeposit: "2",
      buyerCancelPenalty: "1",
      quantityAvailable: "10",
      // exchangeToken: "0xf47E4fd9d2eBd6182F597eE12E487CcA37FC524c", // ropsten boson address
      exchangeToken: "0x0000000000000000000000000000000000000000",
      redeemableFromDateInMS: (Date.now() + minuteInMS).toString(),
      validFromDateInMS: (Date.now() + minuteInMS).toString(),
      validUntilDateInMS: (Date.now() + dayInMs).toString(),
      fulfillmentPeriodDurationInMS: dayInMs.toString(),
      voucherValidDurationInMS: dayInMs.toString()
    } as FormValues,
    onSubmit: async (values: FormValues) => {
      try {
        if (!values) {
          return;
        }
        const storage = new IpfsMetadata({
          url: CONFIG.ipfsMetadataUrl
        });

        const metadataHash = await storage.storeMetadata({
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
            offerChecksum: metadataHash, // TODO: use correct checksum
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
              name="deposit"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>BuyerCancelPenalty</FormLabel>
            <FormControl
              value={values.buyerCancelPenalty}
              onChange={handleChange}
              name="penalty"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Quantity</FormLabel>
            <FormControl
              value={values.quantityAvailable}
              onChange={handleChange}
              name="quantity"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Voucher Valid Duration (ms)</FormLabel>
            <FormControl
              value={values.voucherValidDurationInMS}
              onChange={handleChange}
              name="voucherValidDurationInMS"
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
            <FormLabel>Redeemable Date (ms)</FormLabel>
            <FormControl
              value={values.redeemableFromDateInMS}
              onChange={handleChange}
              name="redeemableDateInMS"
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
        <Button type="submit">Submit</Button>
        {errorMessage && (
          <ErrorMsg data-testid="error">{errorMessage}</ErrorMsg>
        )}
      </StyledForm>
    </CreateOfferContainer>
  );
}
