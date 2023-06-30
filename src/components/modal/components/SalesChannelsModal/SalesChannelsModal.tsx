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
  productUuid: string;
  version: number;
  sellerSalesChannels: SalesChannels;
}

export const SalesChannelsModal: React.FC<SalesChannelsModalProps> = ({
  sellerSalesChannels,
  productUuid,
  version
}) => {
  const [hasError, setError] = useState<boolean>(false);
  const { hideModal } = useModal();
  const { mutateAsync: updateSellerMetadata } = useUpdateSellerMetadata();
  return (
    <Formik<FormType>
      initialValues={{
        channels: [
          ...sellerSalesChannels
            .filter((ch) => {
              return (
                [Channels.dApp, Channels["Custom storefront"]].includes(
                  ch.tag as unknown as Channels
                ) ||
                ch.deployments?.some((ch) => ch.product?.uuid === productUuid)
              );
            })
            .map((saleChannel) => ({
              value: saleChannel.tag,
              label: saleChannel.name ?? saleChannel.tag,
              disabled: false,
              isFixed: [Channels.dApp, Channels["Custom storefront"]].includes(
                saleChannel.tag as unknown as Channels
              )
            }))
        ]
      }}
      onSubmit={async ({ channels }) => {
        try {
          setError(false);

          await updateSellerMetadata({
            values: {
              salesChannels: Object.keys(Channels)
                .filter(
                  (chKey) =>
                    channels?.some((ch) => ch.value === chKey) ||
                    sellerSalesChannels.some((slch) => slch.tag === chKey)
                )
                .map((chKey) => {
                  const sl = sellerSalesChannels.find(
                    (slch) => slch.tag === chKey
                  );
                  const channel = channels?.find((ch) => ch.value === chKey);
                  const isProductInChannel = !!channels?.some(
                    (ch) => ch.value === chKey
                  );
                  return {
                    ...sl,
                    tag: sl?.tag || channel?.value || "",
                    link: sl?.link || undefined,
                    settingsEditor: sl?.settingsEditor || undefined,
                    settingsUri: sl?.settingsUri || undefined,
                    deployments: [
                      ...(sl?.deployments
                        ?.filter(
                          (deployment) =>
                            deployment.product?.uuid !== productUuid
                        )
                        .map((d) => ({
                          ...d,
                          status: d.status || undefined,
                          link: d.link || undefined,
                          lastUpdated: d.lastUpdated || undefined,
                          product: d.product || undefined
                        })) ?? []),
                      ...(isProductInChannel
                        ? [
                            {
                              product: {
                                uuid: productUuid,
                                version
                              },
                              lastUpdated: Math.floor(
                                Date.now() / 1000
                              ).toString()
                            }
                          ]
                        : [])
                    ]
                  };
                })
                ?.filter(
                  (channel) =>
                    channel.tag &&
                    channel.tag !== Channels.dApp &&
                    channel.deployments.length // no products in deployments means we can delete the channel
                )
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
