import { useFormikContext } from "formik";
import { useEffect } from "react";
import styled from "styled-components";

import { Input, Upload } from "../../components/form";
import InputColor from "../../components/form/InputColor";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";
import { getFilesWithEncodedData } from "../../lib/utils/files";
import {
  formModel,
  storeFields,
  StoreFormFields,
  uploadMaxMB
} from "./store-fields";

const Section = styled.div`
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 0.945rem;
  text-transform: uppercase;
  padding: 0.8125rem 0;
  color: ${colors.grey3};
`;

const FieldTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 150%;
  font-feature-settings: "zero" on, "ordn" on;
`;

const FieldDescription = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 150%;
  font-feature-settings: "zero" on;
  color: ${colors.darkGrey};
`;
const gapBetweenInputs = "2rem";

export default function CustomStoreFormContent() {
  const { setFieldValue, values } = useFormikContext<StoreFormFields>();

  const formValuesWithOneLogoUrl = Object.entries(values).filter(
    ([key]) =>
      !([storeFields.logoUrlText, storeFields.logoUpload] as string[]).includes(
        key
      )
  ) as unknown as string[][];
  const queryParams = new URLSearchParams(formValuesWithOneLogoUrl).toString();

  useEffect(() => {
    setFieldValue(storeFields.logoUrl, "", true);
    if (values.logoUpload.length) {
      setFieldValue(storeFields.logoUrlText, "", true);
      getFilesWithEncodedData(values.logoUpload)
        .then(([file]) => {
          setFieldValue(storeFields.logoUrl, file.encodedData, true);
        })
        .catch(console.error);
    } else if (values.logoUrlText) {
      setFieldValue(storeFields.logoUpload, "", true);
      setFieldValue(storeFields.logoUrl, values.logoUrlText, true);
    }
  }, [values.logoUpload, values.logoUrlText, setFieldValue]);

  return (
    <Grid alignItems="flex-start" gap="2.875rem">
      <Grid
        flexDirection="column"
        alignItems="flex-start"
        flex="1 1 50%"
        gap="2rem"
      >
        <Grid flexDirection="column" alignItems="flex-start">
          <Section>General</Section>
          <Grid
            flexDirection="column"
            alignItems="flex-start"
            gap={gapBetweenInputs}
          >
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Store Name</FieldTitle>
              <FieldDescription>
                Give your store a name. This will be only shown in browser tab
                title
              </FieldDescription>
              <Input
                name={storeFields.storeName}
                placeholder={formModel.formFields.storeName.placeholder}
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Title</FieldTitle>
              <FieldDescription>
                You can set landing page Headline
              </FieldDescription>
              <Input
                name={storeFields.title}
                placeholder={formModel.formFields.title.placeholder}
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Description</FieldTitle>
              <FieldDescription>
                You can change or provide landing page subtext
              </FieldDescription>
              <Input
                name={storeFields.description}
                placeholder={formModel.formFields.description.placeholder}
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Logo URL</FieldTitle>
              <FieldDescription>
                Paste the link of your logo here
              </FieldDescription>
              <Input
                name={storeFields.logoUrlText}
                placeholder={formModel.formFields.logoUrlText.placeholder}
                onChange={(e) => {
                  const { value } = e.target;
                  setFieldValue(storeFields.logoUrlText, value, true);
                  setFieldValue(storeFields.logoUpload, "", true);
                }}
              />
              <FieldDescription margin="0.5rem 0 0 0">
                or upload the image here (max. size {uploadMaxMB}MB)
              </FieldDescription>
              <Upload
                name={storeFields.logoUpload}
                placeholder={formModel.formFields.logoUpload.placeholder}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Section>Style</Section>
          <Grid
            flexDirection="column"
            alignItems="flex-start"
            gap={gapBetweenInputs}
          >
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Header / Nav</FieldTitle>
              <Grid gap={gapBetweenInputs}>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldDescription>Background color</FieldDescription>
                  <InputColor
                    name={storeFields.primaryBgColor}
                    placeholder={
                      formModel.formFields.primaryBgColor.placeholder
                    }
                  />
                </Grid>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldDescription>Text color</FieldDescription>
                  <InputColor
                    name={storeFields.secondaryBgColor}
                    placeholder={
                      formModel.formFields.secondaryBgColor.placeholder
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Body / Content</FieldTitle>
              <Grid gap={gapBetweenInputs}>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldDescription>Primary background color</FieldDescription>
                  <InputColor
                    name={storeFields.primaryBgColor}
                    placeholder={
                      formModel.formFields.primaryBgColor.placeholder
                    }
                  />
                </Grid>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldDescription>
                    Secondary background color
                  </FieldDescription>
                  <InputColor
                    name={storeFields.secondaryBgColor}
                    placeholder={
                      formModel.formFields.secondaryBgColor.placeholder
                    }
                  />
                </Grid>
              </Grid>
              <Grid gap={gapBetweenInputs}>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldDescription>Accent color</FieldDescription>
                  <InputColor
                    name={storeFields.primaryBgColor}
                    placeholder={
                      formModel.formFields.primaryBgColor.placeholder
                    }
                  />
                </Grid>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldDescription>Text Color</FieldDescription>
                  <InputColor
                    name={storeFields.secondaryBgColor}
                    placeholder={
                      formModel.formFields.secondaryBgColor.placeholder
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Footer Color</FieldTitle>
              <Grid gap={gapBetweenInputs}>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldDescription>Background color</FieldDescription>
                  <InputColor
                    name={storeFields.primaryBgColor}
                    placeholder={
                      formModel.formFields.primaryBgColor.placeholder
                    }
                  />
                </Grid>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldDescription>Text color</FieldDescription>
                  <InputColor
                    name={storeFields.secondaryBgColor}
                    placeholder={
                      formModel.formFields.secondaryBgColor.placeholder
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Font family</FieldTitle>
              <FieldDescription>Choose your font type</FieldDescription>
              <Input
                name={storeFields.fontFamily}
                placeholder={formModel.formFields.fontFamily.placeholder}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Section>Others</Section>
          <Grid
            flexDirection="column"
            alignItems="flex-start"
            gap={gapBetweenInputs}
          >
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Toggle between Header or Side Bar Nav</FieldTitle>
              <FieldDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </FieldDescription>
              <Input
                name={storeFields.navigationBarPosition}
                placeholder={
                  formModel.formFields.navigationBarPosition.placeholder
                }
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Seller Curation List</FieldTitle>
              <FieldDescription>
                Enter Seller IDs separated by comma
              </FieldDescription>
              <Input
                name={storeFields.sellerCurationList}
                placeholder={
                  formModel.formFields.sellerCurationList.placeholder
                }
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Offer Curation List</FieldTitle>
              <FieldDescription>
                Enter Offer IDs separated by comma
              </FieldDescription>
              <Input
                name={storeFields.offerCurationList}
                placeholder={formModel.formFields.offerCurationList.placeholder}
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Meta Transactions API Key</FieldTitle>
              <FieldDescription>Enter Biconomy API Key</FieldDescription>
              <Input
                name={storeFields.metaTransactionsApiKey}
                placeholder={
                  formModel.formFields.metaTransactionsApiKey.placeholder
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Button type="submit" theme="secondary">
          Create
        </Button>
      </Grid>
      <Grid flex="1 1 50%">
        <iframe
          src={`${window.location.origin}/#/?${queryParams}`}
          width="100%"
          style={{ height: "100vh" }}
        ></iframe>
      </Grid>
    </Grid>
  );
}
