import { Form, Formik } from "formik";
import React from "react";

import { Channels, FormType, validationSchema } from "./form";
import { SalesChannelsForm } from "./SalesChannelsForm";

interface SalesChannelsModalProps {
  productUuid: string | undefined;
  version: number | undefined;
}

export const SalesChannelsModal: React.FC<SalesChannelsModalProps> = () => {
  return (
    <Formik<FormType>
      initialValues={{
        channels: [{ value: Channels.dApp, label: "dApp", disabled: true }]
      }}
      onSubmit={(...rest) => {
        console.log("onSubmit", { ...rest });
      }}
      validationSchema={validationSchema}
    >
      <Form>
        <SalesChannelsForm />
      </Form>
    </Formik>
  );
};
