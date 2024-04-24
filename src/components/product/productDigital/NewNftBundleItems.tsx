import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";

import { newNftInfo } from "../utils";
import { BundleItemsTransferInfo } from "./BundleItemsTransferInfo";
import { Delete, Wrapper } from "./styles";

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
      <Wrapper>
        <FormField
          title={newNftInfo["newNftName"].displayKey}
          required
          style={{ margin: "0 0 1rem 0" }}
        >
          <Input
            placeholder=""
            name={`${prefix}${newNftInfo["newNftName"].key}`}
          />
        </FormField>
        <FormField
          title={newNftInfo["newNftDescription"].displayKey}
          required
          style={{ margin: "0 0 1rem 0" }}
        >
          <Input
            placeholder=""
            name={`${prefix}${newNftInfo["newNftDescription"].key}`}
          />
        </FormField>
        <FormField title="NFT Delivery Info">
          <FormField
            title={newNftInfo["newNftTransferCriteria"].displayKey}
            subTitle={newNftInfo["newNftTransferCriteria"].subtitle}
            style={{ margin: "1rem 0 1rem 0" }}
          >
            <Input
              placeholder=""
              name={`${prefix}${newNftInfo["newNftTransferCriteria"].key}`}
            />
          </FormField>
          <FormField
            title={newNftInfo["newNftTransferTime"].displayKey}
            subTitle={newNftInfo["newNftTransferTime"].subtitle}
            style={{ margin: "0 0 1rem 0" }}
          >
            <Input
              placeholder=""
              name={`${prefix}${newNftInfo["newNftTransferTime"].key}`}
              type="number"
            />
          </FormField>
          <BundleItemsTransferInfo
            selectName={`${prefix}${newNftInfo["newNftBuyerTransferInfo"].key}`}
            withBuyerAddressOption
            withBuyerEmailOption={false}
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
