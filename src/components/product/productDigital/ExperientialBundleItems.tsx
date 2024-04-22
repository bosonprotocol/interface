import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";

import { experientialInfo } from "../utils";
import { BundleItemsTransferInfo } from "./BundleItemsTransferInfo";
import { Delete, Wrapper } from "./styles";

type ExperientialBundleItemsProps = {
  prefix: string;
  showDeleteButton: boolean;
  bundleItemsError: JSX.Element | null;
  onClickDelete: () => void;
};

export const ExperientialBundleItems: React.FC<
  ExperientialBundleItemsProps
> = ({ prefix, showDeleteButton, bundleItemsError, onClickDelete }) => {
  return (
    <Grid flexDirection="column" marginBottom="4rem">
      <Wrapper>
        <FormField
          title={experientialInfo["experientialName"].displayKey}
          required
          subTitle="Use words people would search for when looking for your item."
        >
          <Input
            name={`${prefix}${experientialInfo["experientialName"].key}`}
            placeholder="Experience name"
          />
        </FormField>
        <FormField
          title={experientialInfo["experientialDescription"].displayKey}
          required
          subTitle="Describe the experience in detail, including what the buyer will receive in order to access the experience"
        >
          <Input
            name={`${prefix}${experientialInfo["experientialDescription"].key}`}
            placeholder="Experience description"
          />
        </FormField>
        <FormField title="Experiential Delivery Info" required>
          <FormField
            title={
              experientialInfo["experientialHowWillTheBuyerReceiveIt"]
                .displayKey
            }
            required
          >
            <Input
              placeholder=""
              name={`${prefix}${experientialInfo["experientialHowWillTheBuyerReceiveIt"].key}`}
            />
          </FormField>
          <FormField
            title={
              experientialInfo["experientialWhenWillItBeSentToTheBuyer"]
                .displayKey
            }
            required
          >
            <Input
              placeholder=""
              name={`${prefix}${experientialInfo["experientialWhenWillItBeSentToTheBuyer"].key}`}
            />
          </FormField>
          <FormField
            title={experientialInfo["experientialShippingInDays"].displayKey}
            required
          >
            <Input
              placeholder=""
              name={`${prefix}${experientialInfo["experientialShippingInDays"].key}`}
              type="number"
            />
          </FormField>

          <BundleItemsTransferInfo
            selectName={`${prefix}${experientialInfo["experientialBuyerTransferInfo"].key}`}
            withBuyerAddressOption
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
