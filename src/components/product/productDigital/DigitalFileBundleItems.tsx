import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";

import { digitalFileInfo } from "../utils";
import { BundleItemsTransferInfo } from "./BundleItemsTransferInfo";
import { Delete, Wrapper } from "./styles";

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
            placeholder={digitalFileInfo["digitalFileName"].displayKey}
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
        <FormField title="Digital Delivery Info" required>
          <FormField
            title={
              digitalFileInfo["digitalFileHowWillItBeSentToTheBuyer"].displayKey
            }
            required
          >
            <Input
              placeholder=""
              name={`${prefix}${digitalFileInfo["digitalFileHowWillItBeSentToTheBuyer"].key}`}
            />
          </FormField>
          <FormField
            title={
              digitalFileInfo["digitalFileWhenWillItBeSentToTheBuyer"]
                .displayKey
            }
            required
          >
            <Input
              placeholder=""
              name={`${prefix}${digitalFileInfo["digitalFileWhenWillItBeSentToTheBuyer"].key}`}
            />
          </FormField>
          <FormField
            title={digitalFileInfo["digitalFileShippingInDays"].displayKey}
            required
          >
            <Input
              placeholder=""
              name={`${prefix}${digitalFileInfo["digitalFileShippingInDays"].key}`}
              type="number"
            />
          </FormField>
          <BundleItemsTransferInfo
            selectName={`${prefix}${digitalFileInfo["digitalFileBuyerTransferInfo"].key}`}
            withBuyerAddressOption={false}
            withBuyerEmailOption
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
