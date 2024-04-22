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
        <FormField title="NFT Delivery Info">
          <FormField
            title={newNftInfo["newNftHowWillItBeSentToTheBuyer"].displayKey}
            marginTop="1rem"
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
