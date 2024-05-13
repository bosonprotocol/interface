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
import { ProductSubtitle } from "./ConfirmProductDetails.styles";

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
                      <span>Type: </span>
                      {bi.type.label}
                    </li>
                    <li>
                      <span>NFT type: </span>
                      {bi.newNftType.label}
                    </li>
                    <li>
                      <span>Name: </span>
                      {bi.newNftName}
                    </li>
                    <li>
                      <span>Description:</span> {bi.newNftDescription}
                    </li>
                    <li>
                      <span>Transfer criteria:</span>{" "}
                      {bi.newNftTransferCriteria}
                    </li>
                    <li>
                      <span>Transfer time:</span> {bi.newNftTransferTime}
                    </li>
                    <li>
                      <span>Buyer information required for transfer:</span>{" "}
                      {bi.newNftBuyerTransferInfo.label}
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
                      <span>Type: </span>
                      {bi.type.label}
                    </li>
                    <li>
                      <span>NFT type: </span>
                      {bi.mintedNftType.label}
                    </li>
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
                      <span>Transfer criteria:</span>{" "}
                      {bi.mintedNftTransferCriteria}
                    </li>
                    <li>
                      <span>Transfer time:</span> {bi.mintedNftTransferTime}
                    </li>
                    <li>
                      <span>Buyer information required for transfer:</span>{" "}
                      {bi.mintedNftBuyerTransferInfo.label}
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
                      <span>Type: </span>
                      {bi.type.label}
                    </li>
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
                      <span>Transfer criteria:</span>{" "}
                      {bi.digitalFileTransferCriteria}
                    </li>
                    <li>
                      <span>Transfer time:</span> {bi.digitalFileTransferTime}
                    </li>
                    <li>
                      <span>Buyer information required for transfer:</span>{" "}
                      {bi.digitalFileBuyerTransferInfo.label}
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
                      <span>Type: </span>
                      {bi.type.label}
                    </li>
                    <li>
                      <span>Name:</span> {bi.experientialName}
                    </li>
                    <li>
                      <span>Description:</span> {bi.experientialDescription}
                    </li>
                    <li>
                      <span>Transfer criteria:</span>{" "}
                      {bi.experientialTransferCriteria}
                    </li>
                    <li>
                      <span>Transfer time:</span> {bi.experientialTransferTime}
                    </li>
                    <li>
                      <span>Buyer information required for transfer:</span>{" "}
                      {bi.experientialBuyerTransferInfo.label}
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
