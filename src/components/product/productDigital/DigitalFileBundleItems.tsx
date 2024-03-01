import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";
import { styled } from "styled-components";

import { Delete } from "./styles";
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 1rem;

  > * {
    flex: 1 1 100%;
    margin: initial;
  }
`;
type DigitalFileBundleItemsProps = {
  prefix: string;
  showDeleteButton: boolean;
  bundleItemsError: JSX.Element | null;
  onClickDelete: () => void;
};

export const DigitalFileBundleItems: React.FC<DigitalFileBundleItemsProps> = ({
  prefix,
  showDeleteButton,
  bundleItemsError,
  onClickDelete
}) => {
  return (
    <Grid flexDirection="column" marginBottom="4rem">
      <Wrapper>
        <FormField
          title="Digital file name"
          required
          subTitle="Use words people would search for when looking for your item."
        >
          <Input
            name={`${prefix}digitalFileName`}
            placeholder="Digital file name"
          />
        </FormField>
        <FormField
          title="Digital file description"
          required
          subTitle="Describe your digital file with as much detail as possible."
        >
          <Input
            name={`${prefix}digitalFileDescription`}
            placeholder="Digital file description"
          />
        </FormField>
        <FormField
          title="Digital file format"
          required
          subTitle="Type the expected file format"
        >
          <Input
            name={`${prefix}digitalFileFormat`}
            placeholder="PDF, MP4, MP3..."
          />
        </FormField>

        <FormField title="How will it be sent to the buyer?">
          <Input
            placeholder=""
            name={`${prefix}digitalFileHowWillItBeSentToTheBuyer`}
          />
        </FormField>
        <FormField title="When will it be sent to the buyer?">
          <Input
            placeholder=""
            name={`${prefix}digitalFileWhenWillItBeSentToTheBuyer`}
          />
        </FormField>
        <FormField title="Shipping in days">
          <Input
            placeholder=""
            name={`${prefix}digitalFileShippingInDays`}
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
      </Wrapper>
      {bundleItemsError}
    </Grid>
  );
};
