import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

import useUpdateSellerMetadata from "../../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import SimpleError from "../../../error/SimpleError";
import { SalesChannels } from "../../../seller/products/types";
import SuccessToast from "../../../toasts/common/SuccessToast";
import { useModal } from "../../useModal";
import { Channels, FormType, validationSchema } from "./form";
import { SalesChannelsForm } from "./SalesChannelsForm";

interface SalesChannelsModalProps {
  productUuid: string | undefined;
  version: number | undefined;
  salesChannels: SalesChannels;
}

export const SalesChannelsModal: React.FC<SalesChannelsModalProps> = ({
  salesChannels
}) => {
  const [hasError, setError] = useState<boolean>(false);
  const { hideModal } = useModal();
  const { mutateAsync: updateSellerMetadata } = useUpdateSellerMetadata();
  return (
    <Formik<FormType>
      initialValues={{
        channels: [
          ...salesChannels.map((saleChannel) => ({
            value: saleChannel.tag,
            label: saleChannel.tag,
            disabled: false,
            isFixed: saleChannel.tag === Channels.dApp
          }))
        ]
      }}
      onSubmit={async ({ channels }) => {
        try {
          setError(false);
          await updateSellerMetadata({
            values: {
              salesChannels:
                channels
                  ?.filter((channel) => channel.value !== Channels.dApp)
                  .map((channel) => ({
                    tag: channel.value
                  })) ?? []
            }
          });
          hideModal();
          toast((t) => (
            <SuccessToast t={t}>Sales channels have been updated</SuccessToast>
          ));
        } catch (error) {
          console.error(error);
          setError(true);
          Sentry.captureException(error);
        }
      }}
      validationSchema={validationSchema}
    >
      {() => {
        return (
          <Form>
            <SalesChannelsForm>{hasError && <SimpleError />}</SalesChannelsForm>
          </Form>
        );
      }}
    </Formik>
  );
};
