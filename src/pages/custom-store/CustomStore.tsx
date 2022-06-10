import { BaseIpfsStorage } from "@bosonprotocol/ipfs-storage";
import { useFormik } from "formik";
import { useState } from "react";
import styled from "styled-components";

import Layout from "../../components/Layout";
import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import {
  Button,
  FormControl,
  FormElement,
  FormElementsContainer,
  FormLabel,
  StyledForm
} from "../create-offer/CreateOffer";
import { StoreFields } from "./store-fields";

const Root = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

const UrlBox = styled.a`
  background-color: ${colors.lightGrey};
  padding: 10px;
  margin-top: 24px;
  border-radius: 10px;
  display: block;
`;

export default function CustomStore() {
  const [ipfsUrl, setIpfsUrl] = useState<string>("");
  const { values, handleChange, handleSubmit } = useFormik<StoreFields>({
    initialValues: {
      storeName: "",
      logoUrl: "",
      primaryColor: "",
      secondaryColor: "",
      accentColor: ""
    },
    onSubmit: async (values: StoreFields) => {
      const storage = new BaseIpfsStorage({
        url: CONFIG.ipfsMetadataUrl
      });

      const queryParams = new URLSearchParams(
        Object.entries(values)
      ).toString();
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Boson Protocol</title>
      </head>
      <body>
          <script>
              window.location.href = '${window.location.origin}/#/?${queryParams}';
          </script>
      </body>
      </html>`;

      const cid = await storage.add(html);

      setIpfsUrl(`https://ipfs.io/ipfs/${cid}`);
      return;
    }
  });

  return (
    <Root>
      <h1>Create Custom Store</h1>
      <StyledForm onSubmit={handleSubmit}>
        <FormElementsContainer>
          <FormElement>
            <FormLabel>Store Name</FormLabel>
            <FormControl
              value={values.storeName}
              onChange={handleChange}
              name="storeName"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Logo URL</FormLabel>
            <FormControl
              value={values.logoUrl}
              onChange={handleChange}
              name="logoUrl"
              type="text"
              placeholder="..."
            />
          </FormElement>
          <FormElement>
            <FormLabel>Primary Colour</FormLabel>
            <FormControl
              value={values.primaryColor}
              onChange={handleChange}
              name="primaryColor"
              type="color"
              placeholder="..."
            />
            {values.primaryColor}
          </FormElement>
          <FormElement>
            <FormLabel>Secondary Colour</FormLabel>
            <FormControl
              value={values.secondaryColor}
              onChange={handleChange}
              name="secondaryColor"
              type="color"
              placeholder="..."
            />
            {values.secondaryColor}
          </FormElement>
          <FormElement>
            <FormLabel>Accent Colour</FormLabel>
            <FormControl
              value={values.accentColor}
              onChange={handleChange}
              name="accentColor"
              type="color"
              placeholder="..."
            />
            {values.accentColor}
          </FormElement>
        </FormElementsContainer>
        <Button>Create Store</Button>
        {ipfsUrl && <UrlBox href={ipfsUrl}>{ipfsUrl}</UrlBox>}
      </StyledForm>
    </Root>
  );
}
