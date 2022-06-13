import { BaseIpfsStorage } from "@bosonprotocol/ipfs-storage";
import { useFormik } from "formik";
import { useReducer, useState } from "react";
import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import Layout from "../../components/Layout";
import { CONFIG } from "../../lib/config";
import {
  Button,
  FormControl,
  FormElement,
  FormElementsContainer,
  FormLabel,
  StyledForm
} from "../create-offer/CreateOffer";
import CustomStoreModal from "./CustomStoreModal";
import { StoreFields } from "./store-fields";

const Root = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

const PreviewContainer = styled.div`
  margin: 20px 0;
`;

export default function CustomStore() {
  const [isModalOpened, toggleModal] = useReducer((state) => !state, false);
  const [ipfsUrl, setIpfsUrl] = useState<string>("test");
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
      toggleModal();
      return;
    }
  });

  const queryParams = new URLSearchParams(Object.entries(values)).toString();
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
            <div>
              <FormControl
                value={values.primaryColor}
                onChange={handleChange}
                name="primaryColor"
                type="color"
                placeholder="..."
              />
              <span
                style={{
                  color: values.primaryColor
                }}
              >
                {values.primaryColor}
              </span>
            </div>
          </FormElement>
          <FormElement>
            <FormLabel>Secondary Colour</FormLabel>
            <div>
              <FormControl
                value={values.secondaryColor}
                onChange={handleChange}
                name="secondaryColor"
                type="color"
                placeholder="..."
              />
              <span
                style={{
                  color: values.secondaryColor
                }}
              >
                {values.secondaryColor}
              </span>
            </div>
          </FormElement>
          <FormElement>
            <FormLabel>Accent Colour</FormLabel>
            <div>
              <FormControl
                value={values.accentColor}
                onChange={handleChange}
                name="accentColor"
                type="color"
                placeholder="..."
              />
              <span
                style={{
                  color: values.accentColor
                }}
              >
                {values.accentColor}
              </span>
            </div>
          </FormElement>
        </FormElementsContainer>

        <PreviewContainer>
          <Collapse title={<p>Preview</p>}>
            <iframe
              src={`http://localhost:3000/#/?${queryParams}`}
              width="100%"
              height="500px"
            ></iframe>
          </Collapse>
        </PreviewContainer>

        <Button>Create Store</Button>

        <CustomStoreModal
          isOpen={isModalOpened}
          onClose={toggleModal}
          ipfsUrl={ipfsUrl}
        />
      </StyledForm>
    </Root>
  );
}
