import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input, Select } from "components/form";
import React from "react";

import { experientialInfo, OPTIONS_PERIOD } from "../utils";
import { BundleItemsTransferInfo } from "./BundleItemsTransferInfo";
import { Wrapper } from "./styles";

type ExperientialBundleItemsProps = {
  prefix: string;
  bundleItemsError: JSX.Element | null;
};

export const ExperientialBundleItems: React.FC<
  ExperientialBundleItemsProps
> = ({ prefix, bundleItemsError }) => {
  return (
    <Grid flexDirection="column">
      <Wrapper>
        <FormField
          title={experientialInfo["experientialName"].displayKey}
          required
          subTitle="Use words people would search for when looking for your item."
          style={{ margin: "0 0 1rem 0" }}
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
          style={{ margin: "0 0 1rem 0" }}
        >
          <Input
            name={`${prefix}${experientialInfo["experientialDescription"].key}`}
            placeholder="Experience description"
          />
        </FormField>
        <FormField
          title="Experiential Delivery Info"
          style={{ margin: "0 0 1rem 0" }}
        >
          <FormField
            title={experientialInfo["experientialTransferCriteria"].displayKey}
            subTitle={experientialInfo["experientialTransferCriteria"].subtitle}
            required
            style={{ margin: "0 0 1rem 0" }}
          >
            <Input
              placeholder=""
              name={`${prefix}${experientialInfo["experientialTransferCriteria"].key}`}
            />
          </FormField>
          <FormField
            title={experientialInfo["experientialTransferTime"].displayKey}
            subTitle={experientialInfo["experientialTransferTime"].subtitle}
            required
            style={{ margin: "0 0 1rem 0" }}
          >
            <Grid gap="1rem" alignItems="flex-start">
              <Grid flexDirection="column" alignItems="flex-start">
                <Input
                  placeholder=""
                  name={`${prefix}${experientialInfo["experientialTransferTime"].key}`}
                  type="number"
                  step="1"
                />
              </Grid>
              <Select
                placeholder="Choose..."
                name={`${prefix}${experientialInfo["experientialTransferTimeUnit"].key}`}
                options={OPTIONS_PERIOD}
              />
            </Grid>
          </FormField>

          <BundleItemsTransferInfo
            selectName={`${prefix}${experientialInfo["experientialBuyerTransferInfo"].key}`}
            withBuyerAddressOption
            withBuyerEmailOption
          />
        </FormField>
      </Wrapper>
      {bundleItemsError}
    </Grid>
  );
};
