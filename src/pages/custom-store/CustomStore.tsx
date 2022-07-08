import { BaseIpfsStorage } from "@bosonprotocol/ipfs-storage";
import { useFormik } from "formik";
import { useReducer, useState } from "react";
import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import Layout from "../../components/Layout";
import Button from "../../components/ui/Button";
import { CONFIG } from "../../lib/config";
import { useCSSVariable } from "../../lib/utils/hooks/useCSSVariable";
import {
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
  const primaryColor = useCSSVariable("--primary");

  const { values, handleChange, handleSubmit } = useFormik<StoreFields>({
    initialValues: {
      storeName: "",
      logoUrl: "",
      primaryColor: "",
      secondaryColor: "",
      accentColor: "",
      primaryBgColor: "",
      sellerCurationList: "",
      offerCurationList: "",
      metaTransactionsApiKey: ""
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
          <title>${values.storeName || "Boson Protocol"}</title>
          ${values.logoUrl ? `<link rel="icon" href="${values.logoUrl}">` : ""}
      </head>
      <body>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                height: 100vh;
                background-color:${values.primaryColor || primaryColor};
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

      setIpfsUrl(`https://ipfs.io/ipfs/${cid}`);
      toggleModal();
      return;
    }
  });

  const queryParams = new URLSearchParams(Object.entries(values)).toString();
  return (
    <Root>
      <h1>Create Custom Store</h1>
      <p style={{ color: "red" }}>
        This page will be changed drastically, ignore it
      </p>
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
          <FormElement>
            <FormLabel>Primary Background Colour</FormLabel>
            <div>
              <FormControl
                value={values.primaryBgColor}
                onChange={handleChange}
                name="primaryBgColor"
                type="color"
                placeholder="..."
              />
              <span
                style={{
                  color: values.primaryBgColor
                }}
              >
                {values.primaryBgColor}
              </span>
            </div>
          </FormElement>
          <FormElement>
            <FormLabel>Seller CurationList</FormLabel>
            <FormControl
              value={values.sellerCurationList}
              onChange={handleChange}
              name="sellerCurationList"
              type="text"
              placeholder="Comma-separated list of seller IDs"
            />
          </FormElement>
          <FormElement>
            <FormLabel>Offer CurationList</FormLabel>
            <FormControl
              value={values.offerCurationList}
              onChange={handleChange}
              name="offerCurationList"
              type="text"
              placeholder="Comma-separated list of offer IDs"
            />
          </FormElement>
          <FormElement>
            <FormLabel>Meta Transactions API Key</FormLabel>
            <FormControl
              value={values.metaTransactionsApiKey}
              onChange={handleChange}
              name="metaTransactionsApiKey"
              type="text"
              placeholder="Biconomy API Key"
            />
          </FormElement>
        </FormElementsContainer>

        <PreviewContainer>
          <Collapse title={<p>Preview</p>}>
            <iframe
              src={`${window.location.origin}/#/?${queryParams}`}
              width="100%"
              height="500px"
            ></iframe>
          </Collapse>
        </PreviewContainer>

        <Button type="submit">Create Store</Button>

        <CustomStoreModal
          isOpen={isModalOpened}
          onClose={toggleModal}
          ipfsUrl={ipfsUrl}
        />
      </StyledForm>
    </Root>
  );
}
