import { useFormikContext } from "formik";
import React, { ReactNode } from "react";

import { FormField, Select } from "../../../form";
import { Spinner } from "../../../loading/Spinner";
import BosonButton from "../../../ui/BosonButton";
import { Grid } from "../../../ui/Grid";
import { Channels, FormType } from "./form";

type SalesChannelsFormProps = {
  children: ReactNode;
};

export const SalesChannelsForm: React.FC<SalesChannelsFormProps> = ({
  children
}) => {
  const { isSubmitting } = useFormikContext<FormType>();
  return (
    <Grid flexDirection="column" gap="2rem" alignItems="flex-end">
      <FormField
        title="Current channels"
        subTitle="Add the channel(s) where this product is live. Sales channel information is not updated automatically. "
      >
        <Select
          name="channels"
          options={[
            {
              label: Channels["Boson Boulevard"],
              value: Channels["Boson Boulevard"]
            },
            {
              label: Channels["Own land"],
              value: Channels["Own land"]
            }
          ]}
          isMulti
        />
      </FormField>
      {children}
      <BosonButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            Saving <Spinner size={15} />
          </>
        ) : (
          "Save"
        )}
      </BosonButton>
    </Grid>
  );
};
