import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";
import { styled } from "styled-components";

import { newNftInfo } from "../utils";
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
        <FormField title={newNftInfo["newNftName"].displayKey} required>
          <Input
            placeholder=""
            name={`${prefix}${newNftInfo["newNftName"].key}`}
          />
        </FormField>
        <FormField title={newNftInfo["newNftDescription"].displayKey} required>
          <Input
            placeholder=""
            name={`${prefix}${newNftInfo["newNftDescription"].key}`}
          />
        </FormField>
        <FormField
          title={newNftInfo["newNftHowWillItBeSentToTheBuyer"].displayKey}
        >
          <Input
            placeholder=""
            name={`${prefix}${newNftInfo["newNftHowWillItBeSentToTheBuyer"].key}`}
          />
        </FormField>
        <FormField
          title={newNftInfo["newNftWhenWillItBeSentToTheBuyer"].displayKey}
        >
          <Input
            placeholder=""
            name={`${prefix}${newNftInfo["newNftWhenWillItBeSentToTheBuyer"].key}`}
          />
        </FormField>
        <FormField title={newNftInfo["newNftShippingInDays"].displayKey}>
          <Input
            placeholder=""
            name={`${prefix}${newNftInfo["newNftShippingInDays"].key}`}
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
