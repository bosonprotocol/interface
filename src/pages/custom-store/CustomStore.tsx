import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import { useState } from "react";
import styled from "styled-components";

import Layout from "../../components/Layout";
import { useModal } from "../../components/modal/useModal";
import Typography from "../../components/ui/Typography";
import { useCSSVariable } from "../../lib/utils/hooks/useCSSVariable";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import { useSellerCurationListFn } from "../../lib/utils/hooks/useSellers";
import { getIpfsGatewayUrl } from "../../lib/utils/ipfs";
import CustomStoreFormContent, {
  formValuesWithOneLogoUrl
} from "./CustomStoreFormContent";
import {
  initialValues,
  StoreFormFields,
  validationSchema
} from "./store-fields";

const Root = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
`;

export default function CustomStore() {
  const { showModal, modalTypes } = useModal();
  const [hasSubmitError, setHasSubmitError] = useState<boolean>(false);
  const primaryColor = useCSSVariable("--primary");
  const storage = useIpfsStorage();
  const { sellers } = useCurrentSellers();
  const seller = sellers?.[0];
  const checkIfSellerIsInCurationList = useSellerCurationListFn();
  const isSellerCurated = !!seller && checkIfSellerIsInCurationList(seller.id);

  if (!seller) {
    return (
      <div data-testid="notFound">
        No seller account found for the current wallet.
      </div>
    );
  }

  if (!isSellerCurated) {
    return (
      <div data-testid="notCuratedSeller">
        Seller account {seller.id} is not curated.
      </div>
    );
  }

  return (
    <Root>
      <Typography
        tag="h2"
        fontWeight="600"
        $fontSize="2rem"
        lineHeight="2.4rem"
      >
        Create Custom Store
      </Typography>
      <Formik<typeof initialValues>
        initialValues={{ ...initialValues }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          setHasSubmitError(false);
          try {
            const queryParams = new URLSearchParams(
              formValuesWithOneLogoUrl(values as unknown as StoreFormFields)
            ).toString();
            const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${values.storeName || ""}</title>
          ${values.logoUrl ? `<link rel="icon" href="${values.logoUrl}">` : ""}
      </head>
      <body>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                height: 100vh;
                background-color:${values.primaryBgColor || primaryColor};
              }
              iframe {
                border: none;
              }
            </style>
            <iframe
              src="${window.location.origin}/#/?${queryParams}"
              width="100%"
              height="100%"/>
      </body>
      </html>`;

            const cid = await storage.add(html);

            const ipfsUrl = getIpfsGatewayUrl(cid);
            showModal(modalTypes.CUSTOM_STORE, {
              title: "Congratulations!",
              ipfsUrl,
              htmlString: html
            });
          } catch (error) {
            console.error(error);
            Sentry.captureException(error);
            setHasSubmitError(true);
          }
        }}
      >
        {() => {
          return (
            <Form>
              <CustomStoreFormContent hasSubmitError={hasSubmitError} />
            </Form>
          );
        }}
      </Formik>
    </Root>
  );
}
