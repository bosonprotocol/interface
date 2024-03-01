import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";
import { styled } from "styled-components";

import { Delete } from "./styles";
const NewNftContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-items: start;
  grid-gap: 1rem;
  > * {
    margin: initial;
  }
`;
type NewNftBundleItemsProps = {
  prefix: string;
  showDeleteButton: boolean;
  bundleItemsError: JSX.Element | null;
  onClickDelete: () => void;
};

export const NewNftBundleItems: React.FC<NewNftBundleItemsProps> = ({
  prefix,
  showDeleteButton,
  bundleItemsError,
  onClickDelete
}) => {
  return (
    <Grid flexDirection="column" marginBottom="4rem">
      <NewNftContainer>
        <FormField title="Name" required>
          <Input placeholder="" name={`${prefix}newNftName`} />
        </FormField>
        <FormField title="Description" required>
          <Input placeholder="" name={`${prefix}newNftDescription`} />
        </FormField>
        <FormField title="How will it be sent to the buyer?">
          <Input
            placeholder=""
            name={`${prefix}newNftHowWillItBeSentToTheBuyer`}
          />
        </FormField>
        <FormField title="When will it be sent to the buyer?">
          <Input
            placeholder=""
            name={`${prefix}newNftWhenWillItBeSentToTheBuyer`}
          />
        </FormField>
        <FormField title="Shipping in days">
          <Input
            placeholder=""
            name={`${prefix}newNftShippingInDays`}
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
      </NewNftContainer>
      {bundleItemsError}
    </Grid>
  );
};
