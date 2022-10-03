import { Form, Formik } from "formik";
import { useState } from "react";
import styled from "styled-components";

import Layout from "../../components/Layout";
import { useModal } from "../../components/modal/useModal";
import Typography from "../../components/ui/Typography";
import { useCSSVariable } from "../../lib/utils/hooks/useCSSVariable";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import CustomStoreFormContent from "./CustomStoreFormContent";
import { initialValues, validationSchema } from "./store-fields";

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
              Object.entries(values).map(([key, value]) => [
                String(key),
                String(value)
              ])
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

            const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
            showModal(modalTypes.CUSTOM_STORE, {
              title: "Congratulations!",
              ipfsUrl
            });
          } catch (error) {
            console.error(error);
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
