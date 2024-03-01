import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";
import { styled } from "styled-components";

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
        <FormField title="Contract address" required>
          <Input
            placeholder="0x123...32f3"
            name={`${prefix}mintedNftContractAddress`}
          />
        </FormField>
        <FormField title="Min token ID" required>
          <Input
            placeholder="1"
            name={`${prefix}mintedNftTokenIdRangeMin`}
            type="number"
          />
        </FormField>
        <FormField title="Max token ID" required>
          <Input
            placeholder="999999"
            name={`${prefix}mintedNftTokenIdRangeMax`}
            type="number"
          />
        </FormField>
        <FormField title="External URL">
          <Input
            placeholder="https://example.com"
            name={`${prefix}mintedNftExternalUrl`}
          />
        </FormField>
        <FormField title="When will it be sent to the buyer?">
          <Input
            placeholder=""
            name={`${prefix}mintedNftWhenWillItBeSentToTheBuyer`}
          />
        </FormField>
        <FormField title="Shipping in days">
          <Input
            placeholder=""
            name={`${prefix}mintedNftShippingInDays`}
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
