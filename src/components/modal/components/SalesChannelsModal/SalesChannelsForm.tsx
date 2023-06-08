import { useFormikContext } from "formik";
import React, { ReactNode } from "react";

import { FormField, Select } from "../../../form";
import { Spinner } from "../../../loading/Spinner";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
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
      {children}
      <BosonButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            Saving <Spinner />
          </>
        ) : (
          "Save"
        )}
      </BosonButton>
    </Grid>
  );
};
