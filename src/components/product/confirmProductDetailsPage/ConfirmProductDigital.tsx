import { Grid } from "@bosonprotocol/react-kit";
import { FormField } from "components/form";
import { useForm } from "lib/utils/hooks/useForm";
import React from "react";
import { styled } from "styled-components";

import { ProductTypeTypeValues } from "../utils";
import { ContentValue, ProductSubtitle } from "./ConfirmProductDetails.styles";

const Wrapper = styled.div`
  #lastRegularField {
    margin: 0;
  }
`;

const BundleItemWrapper = styled.ul`
  list-style-type: circle;
  margin: 0;
  span {
    font-weight: 600;
    font-size: 1rem;
  }
`;

export const ConfirmProductDigital: React.FC = () => {
  const { values } = useForm();
  if (
    values.productType?.productType !== ProductTypeTypeValues.phygital ||
    !values.productDigital
  ) {
    return null;
  }
  return (
    <Wrapper>
      <ProductSubtitle tag="h4">Digital & Experiential Items</ProductSubtitle>
      <FormField title="Bundle type" required>
        <ContentValue tag="p">{values.productDigital.type.label}</ContentValue>
      </FormField>
      <FormField title="NFT type" required>
        <ContentValue tag="p">
          {values.productDigital.nftType.label}
        </ContentValue>
      </FormField>
      <FormField
        title="Is the NFT minted already?"
        required
        id="lastRegularField"
      >
        <ContentValue tag="p">
          {values.productDigital.isNftMintedAlready.label}
        </ContentValue>
      </FormField>
      <FormField title="Bundle items" required marginTop="1rem">
        <Grid
          flexDirection="column"
          alignItems="flex-start"
          gap="1rem"
          marginBottom="1rem"
        >
          {values.productDigital.bundleItems.map((bi, index) => {
            if ("name" in bi) {
              return (
                <div key={`${bi.name}-${bi.description}`}>
                  <div>{index + 1}.</div>
                  <BundleItemWrapper>
                    <li>
                      <span>Name: </span>
                      {bi.name}
                    </li>
                    <li>
                      <span>Description:</span> {bi.description}
                    </li>
                    <li>
                      <span>How will it be sent to the buyer?</span>{" "}
                      {bi.howWillItBeSentToTheBuyer}
                    </li>
                    <li>
                      <span>When will it be sent to the buyer?</span>{" "}
                      {bi.whenWillItBeSentToTheBuyer}
                    </li>
                    <li>
                      <span>Shipping in days</span> {bi.shippingInDays}
                    </li>
                  </BundleItemWrapper>
                </div>
              );
            }
            return (
              <div
                key={`${bi.contractAddress}-${bi.tokenIdRangeMin}-${bi.tokenIdRangeMax}`}
              >
                <div>{index + 1}.</div>
                <BundleItemWrapper>
                  <li>
                    <span>ContractAddress:</span> {bi.contractAddress}
                  </li>
                  <li>
                    <span>Token Range:</span> {bi.tokenIdRangeMin}-
                    {bi.tokenIdRangeMax}
                  </li>
                  <li>
                    <span>External URL:</span> {bi.externalUrl}
                  </li>
                  <li>
                    <span>When will it be sent to the buyer?</span>{" "}
                    {bi.whenWillItBeSentToTheBuyer}
                  </li>
                  <li>
                    <span>Shipping in days</span> {bi.shippingInDays}
                  </li>
                </BundleItemWrapper>
              </div>
            );
          })}
        </Grid>
      </FormField>
    </Wrapper>
  );
};
