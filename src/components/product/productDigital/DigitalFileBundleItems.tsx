import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input, Select } from "components/form";
import React from "react";

import { digitalFileInfo, OPTIONS_PERIOD } from "../utils";
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
    <Grid flexDirection="column">
      <Wrapper>
        <FormField
          title={digitalFileInfo["digitalFileName"].displayKey}
          required
          subTitle="Use words people would search for when looking for your item."
          style={{ margin: "0 0 1rem 0" }}
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
          style={{ margin: "0 0 1rem 0" }}
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
          style={{ margin: "0 0 1rem 0" }}
        >
          <Input
            name={`${prefix}${digitalFileInfo["digitalFileFormat"].key}`}
            placeholder="PDF, MP4, MP3..."
          />
        </FormField>
        <FormField
          title="Digital Delivery Info"
          style={{ margin: "0 0 1rem 0" }}
        >
          <FormField
            title={digitalFileInfo["digitalFileTransferCriteria"].displayKey}
            subTitle={digitalFileInfo["digitalFileTransferCriteria"].subtitle}
            required
            style={{ margin: "0 0 1rem 0" }}
          >
            <Input
              placeholder=""
              name={`${prefix}${digitalFileInfo["digitalFileTransferCriteria"].key}`}
            />
          </FormField>
          <FormField
            title={digitalFileInfo["digitalFileTransferTime"].displayKey}
            subTitle={digitalFileInfo["digitalFileTransferTime"].subtitle}
            required
            style={{ margin: "0 0 1rem 0" }}
          >
            <Grid gap="1rem" alignItems="flex-start">
              <Grid flexDirection="column" alignItems="flex-start">
                <Input
                  placeholder=""
                  name={`${prefix}${digitalFileInfo["digitalFileTransferTime"].key}`}
                  type="number"
                  step="1"
                />
              </Grid>
              <Select
                placeholder="Choose..."
                name={`${prefix}${digitalFileInfo["digitalFileTransferTimeUnit"].key}`}
                options={OPTIONS_PERIOD}
              />
            </Grid>
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
