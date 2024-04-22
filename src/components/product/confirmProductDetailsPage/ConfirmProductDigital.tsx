import { Grid } from "@bosonprotocol/react-kit";
import { FormField } from "components/form";
import { useForm } from "lib/utils/hooks/useForm";
import React from "react";
import { styled } from "styled-components";

import { getBundleItemId } from "../productDigital/getBundleItemId";
import {
  DigitalFile,
  ExistingNFT,
  Experiential,
  getIsBundleItem,
  NewNFT
} from "../productDigital/getIsBundleItem";
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
      {values.productDigital.nftType && (
        <FormField title="NFT type" required>
          <ContentValue tag="p">
            {values.productDigital.nftType.label}
          </ContentValue>
        </FormField>
      )}
      {values.productDigital.isNftMintedAlready && (
        <FormField
          title="Is the NFT minted already?"
          required
          id="lastRegularField"
        >
          <ContentValue tag="p">
            {values.productDigital.isNftMintedAlready.label}
          </ContentValue>
        </FormField>
      )}
      <FormField title="Bundle items" required marginTop="1rem">
        <Grid
          flexDirection="column"
          alignItems="flex-start"
          gap="1rem"
          marginBottom="1rem"
        >
          {values.productDigital.bundleItems.map((bi, index) => {
            if (getIsBundleItem<NewNFT>(bi, "newNftName")) {
              return (
                <div key={getBundleItemId(bi)}>
                  <div>{index + 1}.</div>
                  <BundleItemWrapper>
                    <li>
                      <span>Name: </span>
                      {bi.newNftName}
                    </li>
                    <li>
                      <span>Description:</span> {bi.newNftDescription}
                    </li>
                    <li>
                      <span>How will it be sent to the buyer?</span>{" "}
                      {bi.newNftHowWillItBeSentToTheBuyer}
                    </li>
                    <li>
                      <span>When will it be sent to the buyer?</span>{" "}
                      {bi.newNftWhenWillItBeSentToTheBuyer}
                    </li>
                    <li>
                      <span>Shipping in days</span> {bi.newNftShippingInDays}
                    </li>
                  </BundleItemWrapper>
                </div>
              );
            }
            if (getIsBundleItem<ExistingNFT>(bi, "mintedNftContractAddress")) {
              return (
                <div key={getBundleItemId(bi)}>
                  <div>{index + 1}.</div>
                  <BundleItemWrapper>
                    <li>
                      <span>ContractAddress:</span>{" "}
                      {bi.mintedNftContractAddress}
                    </li>
                    <li>
                      <span>Token Range:</span> {bi.mintedNftTokenIdRangeMin}-
                      {bi.mintedNftTokenIdRangeMax}
                    </li>
                    <li>
                      <span>External URL:</span> {bi.mintedNftExternalUrl}
                    </li>
                    <li>
                      <span>When will it be sent to the buyer?</span>{" "}
                      {bi.mintedNftWhenWillItBeSentToTheBuyer}
                    </li>
                    <li>
                      <span>Shipping in days</span> {bi.mintedNftShippingInDays}
                    </li>
                  </BundleItemWrapper>
                </div>
              );
            }
            if (getIsBundleItem<DigitalFile>(bi, "digitalFileName")) {
              return (
                <div key={getBundleItemId(bi)}>
                  <div>{index + 1}.</div>
                  <BundleItemWrapper>
                    <li>
                      <span>Name:</span> {bi.digitalFileName}
                    </li>
                    <li>
                      <span>Description:</span> {bi.digitalFileDescription}
                    </li>
                    <li>
                      <span>File format</span> {bi.digitalFileFormat}
                    </li>
                    <li>
                      <span>How will it be sent to the buyer?</span>{" "}
                      {bi.digitalFileHowWillItBeSentToTheBuyer}
                    </li>
                    <li>
                      <span>When will it be sent to the buyer?</span>{" "}
                      {bi.digitalFileWhenWillItBeSentToTheBuyer}
                    </li>
                    <li>
                      <span>Shipping in days</span>{" "}
                      {bi.digitalFileShippingInDays}
                    </li>
                  </BundleItemWrapper>
                </div>
              );
            }
            if (getIsBundleItem<Experiential>(bi, "experientialName")) {
              return (
                <div key={getBundleItemId(bi)}>
                  <div>{index + 1}.</div>
                  <BundleItemWrapper>
                    <li>
                      <span>Name:</span> {bi.experientialName}
                    </li>
                    <li>
                      <span>Description:</span> {bi.experientialDescription}
                    </li>
                    <li>
                      <span>How will the Buyer receive the access pass?</span>{" "}
                      {bi.experientialHowWillTheBuyerReceiveIt}
                    </li>
                    <li>
                      <span>When will it be sent to the buyer?</span>{" "}
                      {bi.experientialWhenWillItBeSentToTheBuyer}
                    </li>
                    <li>
                      <span>Shipping in days</span>{" "}
                      {bi.experientialShippingInDays}
                    </li>
                  </BundleItemWrapper>
                </div>
              );
            }
            return null;
          })}
        </Grid>
      </FormField>
    </Wrapper>
  );
};
