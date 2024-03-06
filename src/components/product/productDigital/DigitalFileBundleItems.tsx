import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";
import { styled } from "styled-components";

import { digitalFileInfo } from "../utils";
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
          title={digitalFileInfo["digitalFileName"].displayKey}
          required
          subTitle="Use words people would search for when looking for your item."
        >
          <Input
            name={`${prefix}${digitalFileInfo["digitalFileName"].key}`}
            placeholder="Digital file name"
          />
        </FormField>
        <FormField
          title={digitalFileInfo["digitalFileDescription"].displayKey}
          required
          subTitle="Describe your digital file with as much detail as possible."
        >
          <Input
            name={`${prefix}${digitalFileInfo["digitalFileDescription"].key}`}
            placeholder="Digital file description"
          />
        </FormField>
        <FormField
          title={digitalFileInfo["digitalFileFormat"].displayKey}
          required
          subTitle="Type the expected file format"
        >
          <Input
            name={`${prefix}${digitalFileInfo["digitalFileFormat"].key}`}
            placeholder="PDF, MP4, MP3..."
          />
        </FormField>

        <FormField
          title={
            digitalFileInfo["digitalFileHowWillItBeSentToTheBuyer"].displayKey
          }
        >
          <Input
            placeholder=""
            name={`${prefix}${digitalFileInfo["digitalFileHowWillItBeSentToTheBuyer"].key}`}
          />
        </FormField>
        <FormField
          title={
            digitalFileInfo["digitalFileWhenWillItBeSentToTheBuyer"].displayKey
          }
        >
          <Input
            placeholder=""
            name={`${prefix}${digitalFileInfo["digitalFileWhenWillItBeSentToTheBuyer"].key}`}
          />
        </FormField>
        <FormField
          title={digitalFileInfo["digitalFileShippingInDays"].displayKey}
        >
          <Input
            placeholder=""
            name={`${prefix}${digitalFileInfo["digitalFileShippingInDays"].key}`}
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
