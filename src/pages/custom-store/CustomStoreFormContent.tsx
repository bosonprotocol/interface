import { useFormikContext } from "formik";
import { useEffect } from "react";
import styled from "styled-components";

import SimpleError from "../../components/error/SimpleError";
import { Input, Select, Upload } from "../../components/form";
import InputColor from "../../components/form/InputColor";
import { SelectDataProps } from "../../components/form/types";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";
import { getFilesWithEncodedData } from "../../lib/utils/files";
import SocialLogo from "./SocialLogo";
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
const subFieldsMarginLeft = "4rem";
const gap = "0.5rem";
const firstSubFieldBasis = "15%";
const secondSubFieldBasis = "85%";
interface Props {
  hasSubmitError: boolean;
}

const preAppendHttps = (url: string) => {
  return url.startsWith("https://") || url.startsWith("http://")
    ? url
    : `https://${url}`;
};

export default function CustomStoreFormContent({ hasSubmitError }: Props) {
  const { setFieldValue, values, isValid, setFieldTouched } =
    useFormikContext<StoreFormFields>();

  const formValuesWithOneLogoUrl = Object.entries(values)
    .filter(
      ([key]) =>
        !(
          [storeFields.logoUrlText, storeFields.logoUpload] as string[]
        ).includes(key)
    )
    .map(([key, value]) => {
      if (typeof value === "string") {
        let val = value.trim();
        const isCurationList = (
          [
            storeFields.sellerCurationList,
            storeFields.offerCurationList
          ] as string[]
        ).includes(key);
        if (isCurationList) {
          const removedDuplicates = Array.from(
            new Set([
              ...val
                .split(",")
                .filter((v) => !!v)
                .map((v) => v.trim())
            ])
          ).join(",");
          val = removedDuplicates;
        }

        return [[key, val]];
      }
      if (Array.isArray(value)) {
        if (!value.length) {
          return [[key, ""]];
        }
        const valueListWithoutExtraKeys = value
          .map((val) => {
            if (!val || val instanceof File) {
              return null;
            }
            if ("label" in val && "value" in val && "url" in val) {
              // socialMediaLinks
              if (!val.value || !val.url) {
                return null;
              }
              return {
                value: val.value.trim(),
                url: preAppendHttps((val.url as string)?.trim())
              };
            }
            if (Object.values(val).every((v) => !!v)) {
              return {
                label: val.label,
                value: preAppendHttps(val.value || "")
              };
            }
            return null;
          })
          .filter((v) => !!v);
        if (!valueListWithoutExtraKeys.length) {
          return [[key, ""]];
        }
        return [[key, JSON.stringify(valueListWithoutExtraKeys)]];
      }
      return [[key, value?.value?.trim() || ""]];
    })
    .filter((v) => !!v && !!v[0] && !!v[0][0] && !!v[0][1])
    .flat();
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
  const allFilledOut = values.additionalFooterLinks.every((footerLink) => {
    const { label, value } = footerLink || {};
    return !!label && !!value;
  });
  const addFooterLink = () => {
    if (allFilledOut) {
      setFieldValue(
        storeFields.additionalFooterLinks,
        [...values.additionalFooterLinks, { label: "", value: "" }],
        true
      );
    }
  };

  useEffect(() => {
    if (values.withAdditionalFooterLinks?.value) {
      setFieldValue(
        storeFields.additionalFooterLinks,
        [{ label: "", value: "" }],
        true
      );
    }
  }, [values.withAdditionalFooterLinks?.value, setFieldValue]);

  const removeEmptyRowsExceptOne = () => {
    const value = values.additionalFooterLinks;
    const onlyFilledValues = value.filter((v) => !!v?.label || !!v?.value);
    const valueToSet =
      onlyFilledValues.length !== value.length
        ? onlyFilledValues.length - 1 < value.length
          ? [...onlyFilledValues, { label: "", value: "" }]
          : onlyFilledValues
        : value;
    setFieldValue(storeFields.additionalFooterLinks, valueToSet, true);
    valueToSet.forEach((val, index) => {
      if (val?.value) {
        setFieldTouched(
          `${storeFields.additionalFooterLinks}[${index}].label`,
          true
        );
      }
      if (val?.label) {
        setFieldTouched(
          `${storeFields.additionalFooterLinks}[${index}].value`,
          true
        );
      }
    });
  };

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
          <Section>Advanced</Section>
          <Grid
            flexDirection="column"
            alignItems="flex-start"
            gap={gapBetweenInputs}
          >
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Toggle between Header or Side Bar Nav</FieldTitle>

              <Select
                options={
                  formModel.formFields.navigationBarPosition
                    .options as unknown as SelectDataProps<string>[]
                }
                name={storeFields.navigationBarPosition}
                placeholder={
                  formModel.formFields.navigationBarPosition.placeholder
                }
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Toggle footer (show/hide)</FieldTitle>
              <Select
                options={
                  formModel.formFields.showFooter
                    .options as unknown as SelectDataProps<string>[]
                }
                name={storeFields.showFooter}
                placeholder={formModel.formFields.showFooter.placeholder}
              />
            </Grid>
            {values.showFooter?.value === "true" && (
              <Grid
                flexDirection="column"
                margin={`0 0 0 ${subFieldsMarginLeft}`}
                $width={`calc(100% - ${subFieldsMarginLeft})`}
                gap={gapBetweenInputs}
              >
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldTitle>Copyright label</FieldTitle>
                  <FieldDescription>
                    The copyright label shown (e.g. "@ 2022 Example Company")
                  </FieldDescription>
                  <Input
                    name={storeFields.copyright}
                    placeholder={formModel.formFields.copyright.placeholder}
                  />
                </Grid>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldTitle>Social media links</FieldTitle>
                  <FieldDescription>
                    Links to any social media profiles/websites{" "}
                  </FieldDescription>
                  <Select
                    options={
                      formModel.formFields.socialMediaLinks
                        .options as unknown as SelectDataProps<string>[]
                    }
                    name={storeFields.socialMediaLinks}
                    placeholder={
                      formModel.formFields.socialMediaLinks.placeholder
                    }
                    isMulti
                    isClearable
                    isSearchable
                  />
                </Grid>
                <Grid
                  flexDirection="column"
                  alignItems="flex-start"
                  gap="0.5rem"
                >
                  {!!values.socialMediaLinks.length && (
                    <Grid gap={gap}>
                      <Grid flexBasis={firstSubFieldBasis}>
                        <Typography>Logo</Typography>
                      </Grid>
                      <Grid flexBasis={secondSubFieldBasis}>
                        <Typography>URL</Typography>
                      </Grid>
                    </Grid>
                  )}
                  {(values.socialMediaLinks || []).map((selection, index) => {
                    const { label, value } = selection || {};

                    return (
                      <Grid key={label} gap={gap}>
                        <Grid flexBasis={firstSubFieldBasis}>
                          <SocialLogo logo={value} />
                        </Grid>
                        <Grid
                          flexBasis={secondSubFieldBasis}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <Input
                            name={`${storeFields.socialMediaLinks}[${index}].url`}
                            placeholder={`${label} URL`}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldTitle>Additional footer links</FieldTitle>
                  <FieldDescription>
                    Further links to add to your footer (e.g. "Terms &
                    Conditions")
                  </FieldDescription>
                  <Select
                    options={
                      formModel.formFields.withAdditionalFooterLinks
                        .options as unknown as SelectDataProps<string>[]
                    }
                    name={storeFields.withAdditionalFooterLinks}
                    placeholder={
                      formModel.formFields.withAdditionalFooterLinks.placeholder
                    }
                    isClearable
                  />
                </Grid>
                <Grid
                  flexDirection="column"
                  alignItems="flex-start"
                  gap="0.5rem"
                >
                  {values.withAdditionalFooterLinks?.value === "true" && (
                    <>
                      <Grid gap={gap}>
                        <Grid flexBasis="50%">
                          <Typography>Label</Typography>
                        </Grid>
                        <Grid flexBasis="50%">
                          <Typography>URL</Typography>
                        </Grid>
                      </Grid>

                      {(values.additionalFooterLinks || []).map((_, index) => {
                        return (
                          <Grid key={`${index}`} gap={gap}>
                            <Grid flexBasis="50%" flexDirection="column">
                              <Input
                                name={`${storeFields.additionalFooterLinks}[${index}].label`}
                                placeholder={`Label`}
                                onBlur={() => removeEmptyRowsExceptOne()}
                              />
                            </Grid>
                            <Grid
                              flexBasis="50%"
                              flexDirection="column"
                              alignItems="flex-start"
                            >
                              <Input
                                name={`${storeFields.additionalFooterLinks}[${index}].value`}
                                placeholder={`URL`}
                                onBlur={() => removeEmptyRowsExceptOne()}
                              />
                            </Grid>
                          </Grid>
                        );
                      })}
                      <Button
                        disabled={!allFilledOut}
                        onClick={addFooterLink}
                        theme="primary"
                      >
                        + Add
                      </Button>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Products</FieldTitle>
              <FieldDescription>
                Only show your own products in the store
              </FieldDescription>
              <Select
                options={
                  formModel.formFields.withOwnProducts
                    .options as unknown as SelectDataProps<string>[]
                }
                name={storeFields.withOwnProducts}
                placeholder={formModel.formFields.withOwnProducts.placeholder}
                isClearable
              />
            </Grid>
            {values.withOwnProducts?.value === "true" && (
              <Grid
                flexDirection="column"
                margin={`0 0 0 ${subFieldsMarginLeft}`}
                $width={`calc(100% - ${subFieldsMarginLeft})`}
                gap={gapBetweenInputs}
              >
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
                    placeholder={
                      formModel.formFields.offerCurationList.placeholder
                    }
                  />
                </Grid>
              </Grid>
            )}
            <Grid flexDirection="column" alignItems="flex-start">
              <FieldTitle>Meta Transactions</FieldTitle>
              <FieldDescription>
                Pay for your users' transaction fees
              </FieldDescription>
              <Select
                options={
                  formModel.formFields.withMetaTx
                    .options as unknown as SelectDataProps<string>[]
                }
                name={storeFields.withMetaTx}
                placeholder={formModel.formFields.withMetaTx.placeholder}
                isClearable
                disabled
              />
            </Grid>
            {values.withMetaTx?.value === "true" && (
              <Grid
                flexDirection="column"
                margin={`0 0 0 ${subFieldsMarginLeft}`}
                $width={`calc(100% - ${subFieldsMarginLeft})`}
                gap={gapBetweenInputs}
              >
                <Grid flexDirection="column" alignItems="flex-start">
                  <FieldTitle>Meta Transactions API Key</FieldTitle>
                  <FieldDescription>Enter Biconomy API Key</FieldDescription>
                  <Input
                    name={storeFields.metaTransactionsApiKey}
                    placeholder={
                      formModel.formFields.metaTransactionsApiKey.placeholder
                    }
                    disabled
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        {hasSubmitError && <SimpleError />}
        <Button type="submit" theme="secondary" disabled={!isValid}>
          Create
        </Button>
      </Grid>
      <iframe
        src={`${window.location.origin}/#/?${queryParams}`}
        style={{
          alignSelf: "stretch",
          width: "100%",
          display: "flex"
        }}
      ></iframe>
    </Grid>
  );
}
