import { FormField } from "components/form";
import { SelectForm } from "components/form/Select";
import React from "react";

import { BUYER_TRANSFER_INFO_OPTIONS, buyerTranferInfoTitle } from "../utils";

type BundleItemsTransferInfoProps = {
  selectName: string;
  withBuyerAddressOption: boolean;
  withBuyerEmailOption: boolean;
};

export const BundleItemsTransferInfo: React.FC<
  BundleItemsTransferInfoProps
> = ({ selectName, withBuyerAddressOption, withBuyerEmailOption }) => {
  const isDisabled =
    (withBuyerAddressOption && !withBuyerEmailOption) ||
    (!withBuyerAddressOption && withBuyerEmailOption);
  return (
    <FormField
      title={buyerTranferInfoTitle}
      subTitle="Describe what information the buyer needs to provide to receive the digital or experiential item"
      required={!isDisabled}
      style={{ margin: "0 0 1rem 0" }}
    >
      <SelectForm
        name={selectName}
        options={BUYER_TRANSFER_INFO_OPTIONS}
        disabled={isDisabled}
      />
    </FormField>
  );
};
