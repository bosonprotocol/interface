import { Form, Formik } from "formik";
import React from "react";

import { FormField, Select } from "../../../form";
import Grid from "../../../ui/Grid";

interface SalesChannelsModalProps {
  productUuid: string | undefined;
  version: number | undefined;
}

export const SalesChannelsModal: React.FC<SalesChannelsModalProps> = () => {
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        //
      }}
    >
      <Form>
        <Grid flexDirection="column">
          <FormField title="Current channels">
            <Select
              name="channels"
              options={[
                {
                  label: "BOSON DCL",
                  value: "DCL-PORTAL"
                }
              ]}
            />
          </FormField>
        </Grid>
      </Form>
    </Formik>
  );
};
