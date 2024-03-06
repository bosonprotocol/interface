import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";
import { styled } from "styled-components";

import { mintedNftInfo } from "../utils";
import { Delete } from "./styles";
const ExistingNftContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 1rem;

  > * {
    flex: 1 1 30%;
    margin: initial;
  }
`;
type MintedNftBundleItemsProps = {
  prefix: string;
  showDeleteButton: boolean;
  bundleItemsError: JSX.Element | null;
  onClickDelete: () => void;
};

export const MintedNftBundleItems: React.FC<MintedNftBundleItemsProps> = ({
  prefix,
  showDeleteButton,
  bundleItemsError,
  onClickDelete
}) => {
  return (
    <Grid flexDirection="column" marginBottom="4rem">
      <ExistingNftContainer>
        <FormField
          title={mintedNftInfo["mintedNftContractAddress"].displayKey}
          required
        >
          <Input
            placeholder="0x123...32f3"
            name={`${prefix}${mintedNftInfo["mintedNftContractAddress"].key}`}
          />
        </FormField>
        <FormField
          title={mintedNftInfo["mintedNftTokenIdRangeMin"].displayKey}
          required
        >
          <Input
            placeholder="1"
            name={`${prefix}${mintedNftInfo["mintedNftTokenIdRangeMin"].key}`}
            type="number"
          />
        </FormField>
        <FormField
          title={mintedNftInfo["mintedNftTokenIdRangeMax"].displayKey}
          required
        >
          <Input
            placeholder="999999"
            name={`${prefix}${mintedNftInfo["mintedNftTokenIdRangeMax"].key}`}
            type="number"
          />
        </FormField>
        <FormField title={mintedNftInfo["mintedNftExternalUrl"].displayKey}>
          <Input
            placeholder="https://example.com"
            name={`${prefix}${mintedNftInfo["mintedNftExternalUrl"].key}`}
          />
        </FormField>
        <FormField
          title={
            mintedNftInfo["mintedNftWhenWillItBeSentToTheBuyer"].displayKey
          }
        >
          <Input
            placeholder=""
            name={`${prefix}${mintedNftInfo["mintedNftWhenWillItBeSentToTheBuyer"].key}`}
          />
        </FormField>
        <FormField title={mintedNftInfo["mintedNftShippingInDays"].displayKey}>
          <Input
            placeholder=""
            name={`${prefix}${mintedNftInfo["mintedNftShippingInDays"].key}`}
            type="number"
          />
        </FormField>
        {showDeleteButton && (
          <FormField title="Action">
            <Delete
              size={18}
              style={{
                gridColumn: "delete",
                gridRow: "delete"
              }}
              onClick={onClickDelete}
            />
          </FormField>
        )}
      </ExistingNftContainer>
      {bundleItemsError}
    </Grid>
  );
};
