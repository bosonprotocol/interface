import { useFormikContext } from "formik";
import { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import CollapseWithTrigger from "../../components/collapse/CollapseWithTrigger";
import SimpleError from "../../components/error/SimpleError";
import { Input, Select, Upload } from "../../components/form";
import InputColor from "../../components/form/InputColor";
import { SelectDataProps } from "../../components/form/types";
import BosonButton from "../../components/ui/BosonButton";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { preAppendHttps } from "../../lib/validation/regex/url";
import SocialLogo from "./SocialLogo";
import {
  formModel,
  initialValues,
  SelectType,
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

const ignoreStoreFields = [
  storeFields.logoUrlText,
  storeFields.logoUpload,
  storeFields.customStoreUrl
] as string[];

export const formValuesWithOneLogoUrl = (values: StoreFormFields) => {
  return Object.entries(values)
    .filter(([key]) => !ignoreStoreFields.includes(key))
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
        if (!value?.length) {
          return [[key, ""]];
        }
        if (([storeFields.supportFunctionality] as string[]).includes(key)) {
          return [
            [
              key,
              JSON.stringify(
                (value as SelectType<string>[])
                  .map((obj) => obj?.value)
                  .filter((v) => !!v)
              )
            ]
          ];
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
            if (
              "label" in val &&
              "value" in val &&
              Object.values(val).every((v) => !!v)
            ) {
              return {
                label: val.label,
                value: preAppendHttps(val.value || "")
              };
            }
            return null;
          })
          .filter((v) => !!v);
        if (!valueListWithoutExtraKeys?.length) {
          return [[key, ""]];
        }
        return [[key, JSON.stringify(valueListWithoutExtraKeys)]];
      }
      return [[key, value?.value?.trim() || ""]];
    })
    .filter((v) => !!v && !!v[0] && !!v[0][0] && !!v[0][1])
    .flat();
};

export default function CustomStoreFormContent({ hasSubmitError }: Props) {
  const { setFieldValue, values, isValid, setFieldTouched, setValues } =
    useFormikContext<StoreFormFields>();

  const { sellerIds } = useCurrentSellers();

  const queryParams = new URLSearchParams(
    formValuesWithOneLogoUrl(values)
  ).toString();
  const lastLogoUpdated = useRef<"logoUrlText" | "logoUpload" | null>(null);
  useEffect(() => {
    const logoUploadWasUpdated = lastLogoUpdated.current === "logoUpload";
    if (logoUploadWasUpdated) {
      lastLogoUpdated.current = null;
      return;
    }
    lastLogoUpdated.current = "logoUrlText";
    setFieldValue(storeFields.logoUrl, "", true);
    if (values.logoUrlText) {
      if (Array.isArray(values.logoUpload) && !values.logoUpload.length) {
        lastLogoUpdated.current = null;
      } else {
        setFieldValue(storeFields.logoUpload, [], true);
      }
      setFieldValue(storeFields.logoUrl, values.logoUrlText, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.logoUrlText]);

  useEffect(() => {
    const logoUrlTextWasUpdated = lastLogoUpdated.current === "logoUrlText";
    if (logoUrlTextWasUpdated) {
      lastLogoUpdated.current = null;
      return;
    }
    lastLogoUpdated.current = "logoUpload";
    setFieldValue(storeFields.logoUrl, "", true);
    if (values.logoUpload?.length) {
      if (values.logoUrlText === "") {
        lastLogoUpdated.current = null;
      } else {
        setFieldValue(storeFields.logoUrlText, "", true);
      }
      const ipfsWithoutPrefix = values.logoUpload[0].src.replace("ipfs://", "");
      setFieldValue(
        storeFields.logoUrl,
        `${CONFIG.ipfsGateway}${ipfsWithoutPrefix}`,
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.logoUpload]);

  const allFilledOut = values.additionalFooterLinks?.every((footerLink) => {
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
    if (
      values.withAdditionalFooterLinks?.value &&
      !values.additionalFooterLinks?.length
    ) {
      setFieldValue(
        storeFields.additionalFooterLinks,
        [{ label: "", value: "" }],
        true
      );
    }
  }, [
    values.withAdditionalFooterLinks?.value,
    setFieldValue,
    values.additionalFooterLinks?.length
  ]);

  const disableCurationLists = ["mine"].includes(
    values.withOwnProducts?.value || ""
  );
  useEffect(() => {
    if (
      sellerIds?.length &&
      ["mine"].includes(values.withOwnProducts?.value || "")
    ) {
      setFieldValue(storeFields.sellerCurationList, sellerIds.join(","), true);
    }
  }, [values.withOwnProducts?.value, setFieldValue, sellerIds]);

  useEffect(() => {
    if (values.headerBgColor !== initialValues.headerBgColor) {
      setFieldValue(storeFields.footerBgColor, values.headerBgColor, true);
    }
  }, [values.headerBgColor, setFieldValue]);

  useEffect(() => {
    if (values.headerTextColor !== initialValues.headerTextColor) {
      setFieldValue(storeFields.footerTextColor, values.headerTextColor, true);
    }
  }, [setFieldValue, values.headerTextColor]);

  const removeEmptyRowsExceptOne = () => {
    const value = values.additionalFooterLinks;
    const onlyFilledValues = value.filter((v) => !!v?.label || !!v?.value);
    const valueToSet =
      onlyFilledValues?.length !== value?.length
        ? onlyFilledValues.length - 1 < value?.length
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

  const renderCommitProxyField = useMemo(() => {
    const numSellers = new Set(
      values.sellerCurationList
        ?.split(",")
        .map((str) => str.trim())
        .filter(isTruthy) || []
    ).size;
    const numOffers = new Set(
      values.offerCurationList
        ?.split(",")
        .map((str) => str.trim())
        .filter(isTruthy) || []
    ).size;
    // TODO: render field if 1 seller and many offers but all of them are from the same seller
    return (
      (["custom"].includes(values.withOwnProducts?.value || "") &&
        ((numSellers === 1 && numOffers === 0) ||
          (numSellers === 0 && numOffers === 1))) ||
      ["mine"].includes(values.withOwnProducts?.value || "")
    );
  }, [
    values.offerCurationList,
    values.sellerCurationList,
    values.withOwnProducts?.value
  ]);

  const CommitProxyField = useCallback(() => {
    if (!renderCommitProxyField) {
      return null;
    }
    return (
      <>
        <Grid flexDirection="column" alignItems="flex-start">
          <FieldTitle>Commit Proxy Address</FieldTitle>
          <FieldDescription>
            Careful: This will override the commit function for your buyers.
          </FieldDescription>
          <Input
            name={storeFields.commitProxyAddress}
            placeholder={formModel.formFields.commitProxyAddress.placeholder}
          />
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <FieldTitle>Link to collection/contract</FieldTitle>
          <FieldDescription>
            Users who view your product are shown a message which will include
            this link
          </FieldDescription>
          <Input
            name={storeFields.openseaLinkToOriginalMainnetCollection}
            placeholder={
              formModel.formFields.openseaLinkToOriginalMainnetCollection
                .placeholder
            }
          />
        </Grid>
      </>
    );
  }, [renderCommitProxyField]);

  useEffect(() => {
    if (!renderCommitProxyField) {
      setFieldValue(storeFields.commitProxyAddress, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderCommitProxyField]);

  useEffect(() => {
    if (!values.customStoreUrl) {
      return;
    }
    (async () => {
      try {
        let iframeSrc = values.customStoreUrl;
        const urlWithoutHash = iframeSrc.replace("/#/", "/");
        const urlWithoutTrailingQuotationMarks = urlWithoutHash.startsWith(
          "http"
        )
          ? urlWithoutHash
          : urlWithoutHash.substring(urlWithoutHash.indexOf("http"));
        let url = new URL(urlWithoutTrailingQuotationMarks);
        if (!url.searchParams.has(storeFields.isCustomStoreFront)) {
          try {
            const response = await fetch(urlWithoutHash);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const src = Array.from(doc.querySelectorAll("iframe"))
              .filter(isTruthy)
              .map((iframe) => iframe.getAttribute("src"))
              .find((src) => src?.includes(storeFields.isCustomStoreFront));
            if (src) {
              iframeSrc = src;
            }
          } catch (error) {
            console.error(error);
          }
        }
        url = new URL(iframeSrc);
        const entries = Array.from(url.searchParams.entries());

        const allKeys = Object.keys(storeFields);
        const cleanedEntries = entries
          .filter(([key]) => {
            return (
              key !== storeFields.isCustomStoreFront &&
              allKeys.includes(key) &&
              !ignoreStoreFields.includes(key)
            );
          })
          .map(([keyWithMaybeAmp, value]) => {
            const key = keyWithMaybeAmp.replace("amp;", "");
            try {
              switch (key) {
                case storeFields.fontFamily:
                case storeFields.navigationBarPosition:
                case storeFields.showFooter:
                case storeFields.withAdditionalFooterLinks:
                case storeFields.withOwnProducts: {
                  const options = formModel.formFields[key]
                    .options as unknown as {
                    value: typeof value;
                  }[];
                  const option = options.find(
                    (option) => option.value === value
                  );
                  if (option) {
                    return [key, option];
                  }
                  return null;
                }
                case storeFields.socialMediaLinks: {
                  const socialMediaLinks = JSON.parse(value) as {
                    value: string;
                    url: string;
                  }[];
                  const values = socialMediaLinks
                    .map((socialMediaObject) => {
                      const option =
                        formModel.formFields.socialMediaLinks.options.find(
                          (opt) => {
                            return opt.value === socialMediaObject.value;
                          }
                        );
                      if (option) {
                        return {
                          ...option,
                          url: socialMediaObject.url
                        };
                      }
                      return null;
                    })
                    .filter(isTruthy);
                  if (values?.length) {
                    return [key, values];
                  }
                  return null;
                }

                case storeFields.additionalFooterLinks:
                  return [key, JSON.parse(value)];
                case storeFields.logoUrl:
                  return [storeFields.logoUrlText, value];
              }
            } catch (error) {
              console.error(error);
              return null;
            }

            return [key, value];
          })
          .filter(isTruthy);
        setValues({ ...values, ...Object.fromEntries(cleanedEntries) }, true);
      } catch (error) {
        console.error(error);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.customStoreUrl]);

  const AdvancedTrigger = useCallback(() => {
    return <Section>Advanced</Section>;
  }, []);

  const StyleTrigger = useCallback(() => {
    return <Section>Style</Section>;
  }, []);

  return (
    <Grid alignItems="flex-start" gap="2.875rem">
      <Grid
        flexDirection="column"
        alignItems="flex-start"
        flex="1 1 50%"
        gap="2rem"
      >
        <Grid flexDirection="column" alignItems="flex-start">
          <FieldTitle>Load data from an existing storefront</FieldTitle>
          <FieldDescription>
            Paste the URL to an existing custom storefront here
          </FieldDescription>
          <Input
            name={storeFields.customStoreUrl}
            placeholder={formModel.formFields.customStoreUrl.placeholder}
          />
        </Grid>
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
                You can set the landing page Headline
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
              />
              <FieldDescription margin="0.5rem 0 0 0">
                or upload the image here (max. size {uploadMaxMB}MB)
              </FieldDescription>
              <Upload
                name={storeFields.logoUpload}
                placeholder={formModel.formFields.logoUpload.placeholder}
                withUpload
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <CollapseWithTrigger isInitiallyOpen trigger={StyleTrigger}>
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
                      name={storeFields.headerBgColor}
                      placeholder={
                        formModel.formFields.headerBgColor.placeholder
                      }
                    />
                  </Grid>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>Text color</FieldDescription>
                    <InputColor
                      name={storeFields.headerTextColor}
                      placeholder={
                        formModel.formFields.headerTextColor.placeholder
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid flexDirection="column" alignItems="flex-start">
                <FieldTitle>Body / Content</FieldTitle>
                <Grid gap={gapBetweenInputs}>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>
                      Primary background color
                    </FieldDescription>
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
                      name={storeFields.accentColor}
                      placeholder={formModel.formFields.accentColor.placeholder}
                    />
                  </Grid>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>Text Color</FieldDescription>
                    <InputColor
                      name={storeFields.textColor}
                      placeholder={formModel.formFields.textColor.placeholder}
                    />
                  </Grid>
                </Grid>
                <Grid gap={gapBetweenInputs}>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>Button background</FieldDescription>
                    <InputColor
                      name={storeFields.buttonBgColor}
                      placeholder={
                        formModel.formFields.buttonBgColor.placeholder
                      }
                    />
                  </Grid>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>Button Text Color</FieldDescription>
                    <InputColor
                      name={storeFields.buttonTextColor}
                      placeholder={
                        formModel.formFields.buttonTextColor.placeholder
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* // NOTE: we may wish to show it again in the future */}
              {/* <Grid flexDirection="column" alignItems="flex-start">
                <FieldTitle>Footer Color</FieldTitle>
                <Grid gap={gapBetweenInputs}>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>Background color</FieldDescription>
                    <InputColor
                      name={storeFields.footerBgColor}
                      placeholder={
                        formModel.formFields.footerBgColor.placeholder
                      }
                    />
                  </Grid>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>Text color</FieldDescription>
                    <InputColor
                      name={storeFields.footerTextColor}
                      placeholder={
                        formModel.formFields.footerTextColor.placeholder
                      }
                    />
                  </Grid>
                </Grid>
              </Grid> */}
              <Grid flexDirection="column" alignItems="flex-start">
                <FieldTitle>Font family</FieldTitle>
                <FieldDescription>Choose your font type</FieldDescription>
                <Select
                  options={
                    formModel.formFields.fontFamily
                      .options as unknown as SelectDataProps<string>[]
                  }
                  name={storeFields.fontFamily}
                  placeholder={formModel.formFields.fontFamily.placeholder}
                  isSearchable
                />
              </Grid>
            </Grid>
          </CollapseWithTrigger>
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <CollapseWithTrigger isInitiallyOpen trigger={AdvancedTrigger}>
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
                    {!!values.socialMediaLinks?.length && (
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
                        formModel.formFields.withAdditionalFooterLinks
                          .placeholder
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

                        {(values.additionalFooterLinks || []).map(
                          (_, index) => {
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
                          }
                        )}
                        <BosonButton
                          disabled={!allFilledOut}
                          onClick={addFooterLink}
                          variant="primaryFill"
                        >
                          + Add
                        </BosonButton>
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
              {["custom"].includes(values.withOwnProducts?.value || "") ? (
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
                      disabled={disableCurationLists}
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
                      disabled={disableCurationLists}
                      name={storeFields.offerCurationList}
                      placeholder={
                        formModel.formFields.offerCurationList.placeholder
                      }
                    />
                  </Grid>
                  <CommitProxyField />
                </Grid>
              ) : ["mine"].includes(values.withOwnProducts?.value || "") ? (
                <Grid
                  flexDirection="column"
                  margin={`0 0 0 ${subFieldsMarginLeft}`}
                  $width={`calc(100% - ${subFieldsMarginLeft})`}
                  gap={gapBetweenInputs}
                >
                  <CommitProxyField />
                </Grid>
              ) : null}
              {/* <Grid flexDirection="column" alignItems="flex-start">
                <FieldTitle>Toggle header/footer options</FieldTitle>
                <FieldDescription>
                  Focus your user's attention exclusively on relevant actions
                  (buyer, seller and/or dispute resolver)
                </FieldDescription>
                <Select
                  options={
                    formModel.formFields.supportFunctionality
                      .options as unknown as SelectDataProps<string>[]
                  }
                  name={storeFields.supportFunctionality}
                  placeholder={
                    formModel.formFields.supportFunctionality.placeholder
                  }
                  isClearable
                  isMulti
                />
              </Grid> */}
            </Grid>
          </CollapseWithTrigger>
        </Grid>
        {hasSubmitError && <SimpleError />}
        <BosonButton type="submit" variant="primaryFill" disabled={!isValid}>
          Create
        </BosonButton>
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
