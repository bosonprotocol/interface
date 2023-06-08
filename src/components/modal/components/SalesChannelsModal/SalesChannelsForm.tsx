import React from "react";

import { FormField, Select } from "../../../form";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import { Channels } from "./form";

export const SalesChannelsForm: React.FC = () => {
  return (
    <Grid flexDirection="column" gap="2rem" alignItems="flex-end">
      <FormField title="Current channels">
        <Select
          name="channels"
          options={[
            {
              label: "BOSON DCL",
              value: Channels.BosonDCL
            },
            {
              label: "Custom DCL",
              value: Channels.CustomDCL
            }
          ]}
          isMulti
        />
      </FormField>
      <BosonButton type="submit">Save</BosonButton>
    </Grid>
  );
};
