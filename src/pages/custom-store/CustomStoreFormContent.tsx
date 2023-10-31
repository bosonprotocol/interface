import * as Sentry from "@sentry/browser";
import { useField, useFormikContext } from "formik";
import { BosonRoutes } from "lib/routing/routes";
import { getViewModeUrl, ViewMode } from "lib/viewMode";
import { ArrowsOut } from "phosphor-react";
import { useEffect, useMemo, useRef } from "react";

import CollapseWithTrigger from "../../components/collapse/CollapseWithTrigger";
import SimpleError from "../../components/error/SimpleError";
import { Input, Select, Upload } from "../../components/form";
import InputColor from "../../components/form/InputColor";
import { SwitchForm } from "../../components/form/Switch";
import { SelectDataProps } from "../../components/form/types";
import { Spinner } from "../../components/loading/Spinner";
import { useModal } from "../../components/modal/useModal";
import BosonButton from "../../components/ui/BosonButton";
import Grid from "../../components/ui/Grid";
import GridContainer from "../../components/ui/GridContainer";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { getIpfsGatewayUrl } from "../../lib/utils/ipfs";
import { preAppendHttps } from "../../lib/validation/regex/url";
import AdditionalFooterLinks from "./AdditionalFooterLinks";
import ContactInfoLinks from "./ContactInfoLinks";
import SocialMediaLinks from "./SocialMediaLinks";
import {
  formModel,
  initialValues,
  storeFields,
  uploadMaxMB
} from "./store-fields";
import { InternalOnlyStoreFields, StoreFormFields } from "./store-fields-types";
import {
  FieldDescription,
  FieldTitle,
  gapBetweenInputs,
  Section,
  subFieldsMarginLeft
} from "./styles";
import { SelectType } from "./types";

interface Props {
  hasSubmitError: boolean;
}

const ignoreStoreFields: ReadonlyArray<keyof InternalOnlyStoreFields> = [
  storeFields.bannerSwitch,
  storeFields.bannerUrlText,
  storeFields.bannerUpload,
  storeFields.logoUrlText,
  storeFields.logoUpload,
  storeFields.customStoreUrl
] as const;

export const formValuesWithOneLogoUrl = (
  values: Omit<StoreFormFields, "footerBgColor" | "supportFunctionality">
) => {
  const entries = Object.entries(values)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter(([key]) => !ignoreStoreFields.includes(key as any))
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
                url: preAppendHttps(
                  `${val.prefix ?? ""}${(val.url as string)?.trim() ?? ""}`
                ),
                label: val.label.trim()
              };
            }
            if ("label" in val && "value" in val && "text" in val) {
              // contactInfoLinks
              if (!val.value || !val.text) {
                return null;
              }
              return {
                value: val.value.trim(),
                text: (val.text as string)?.trim()
              };
            }
            if (
              "label" in val &&
              "value" in val &&
              Object.values(val).every((v) => !!v)
            ) {
              return {
                label: val.label,
                value: preAppendHttps((val.value as string) || "")
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
      if (typeof value === "boolean") {
        return [[key, value ? "1" : ""]];
      }
      return [[key, value?.value?.trim() || ""]];
    })
    .filter((v) => !!v && !!v[0] && !!v[0][0] && !!v[0][1])
    .flat();
  return entries;
};

export default function CustomStoreFormContent({ hasSubmitError }: Props) {
  const dappOrigin = getViewModeUrl(ViewMode.DAPP, BosonRoutes.Root);
  const { showModal } = useModal();
  const { setFieldValue, values, isValid, setValues, isSubmitting, ...rest } =
    useFormikContext<StoreFormFields>();
  console.log({
    setFieldValue,
    values,
    isValid,
    setValues,
    isSubmitting,
    ...rest
  });
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
        getIpfsGatewayUrl(ipfsWithoutPrefix),
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.logoUpload]);
  const lastBannerUpdated = useRef<"bannerUrlText" | "bannerUpload" | null>(
    null
  );
  useEffect(() => {
    const bannerUploadWasUpdated = lastBannerUpdated.current === "bannerUpload";
    if (bannerUploadWasUpdated) {
      lastBannerUpdated.current = null;
      return;
    }
    lastBannerUpdated.current = "bannerUrlText";
    setFieldValue(storeFields.bannerUrl, "", true);
    if (values.bannerUrlText) {
      if (Array.isArray(values.bannerUpload) && !values.bannerUpload.length) {
        lastBannerUpdated.current = null;
      } else {
        setFieldValue(storeFields.bannerUpload, [], true);
      }
      setFieldValue(storeFields.bannerUrl, values.bannerUrlText, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.bannerUrlText]);

  useEffect(() => {
    const bannerUrlTextWasUpdated =
      lastBannerUpdated.current === "bannerUrlText";
    if (bannerUrlTextWasUpdated) {
      lastBannerUpdated.current = null;
      return;
    }
    lastBannerUpdated.current = "bannerUpload";
    setFieldValue(storeFields.bannerUrl, "", true);
    if (values.bannerUpload?.length) {
      if (values.bannerUrlText === "") {
        lastBannerUpdated.current = null;
      } else {
        setFieldValue(storeFields.bannerUrlText, "", true);
      }
      const ipfsWithoutPrefix = values.bannerUpload[0].src.replace(
        "ipfs://",
        ""
      );
      setFieldValue(
        storeFields.bannerUrl,
        getIpfsGatewayUrl(ipfsWithoutPrefix),
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.bannerUpload]);

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

  useEffect(() => {
    if (!renderCommitProxyField) {
      setFieldValue(storeFields.commitProxyAddress, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderCommitProxyField]);

  useEffect(() => {
    // load data from an existing storefront
    (async () => {
      if (!values.customStoreUrl) {
        return;
      }
      try {
        let iframeSrc = values.customStoreUrl.replace("/#/", "/");
        let url = new URL(iframeSrc);
        if (!url.searchParams.has(storeFields.isCustomStoreFront)) {
          try {
            const response = await fetch(iframeSrc);
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
            Sentry.captureException(error);
          }
        }
        url = new URL(iframeSrc.replace("/#/", "/"));
        const entries = Array.from(url.searchParams.entries());

        const allKeys = Object.keys(storeFields);
        const cleanedEntries = entries
          .filter(([key]) => {
            return (
              key !== storeFields.isCustomStoreFront &&
              allKeys.includes(key) &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              !ignoreStoreFields.includes(key as any)
            );
          })
          .map(([keyWithMaybeAmp, value]) => {
            const key = keyWithMaybeAmp.replace("amp;", "");
            try {
              switch (key) {
                case storeFields.fontFamily:
                case storeFields.navigationBarPosition:
                case storeFields.showFooter:
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
                        const urlWithoutPrefix =
                          socialMediaObject.url.startsWith(option.prefix)
                            ? socialMediaObject.url.replace(option.prefix, "")
                            : socialMediaObject.url;
                        return {
                          ...option,
                          url: urlWithoutPrefix
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
                case storeFields.contactInfoLinks: {
                  const contactInfoLinksList = JSON.parse(
                    value
                  ) as unknown as SelectDataProps<string>[];
                  const listWithLabels = contactInfoLinksList.map((cil) => {
                    let label = cil.label;
                    if (!cil.label) {
                      const matchedOption =
                        formModel.formFields.contactInfoLinks.options.find(
                          (option) => option.value === cil.value
                        );
                      if (matchedOption) {
                        label = matchedOption.label;
                      }
                    }
                    return {
                      ...cil,
                      label
                    };
                  });
                  return [key, listWithLabels];
                }

                case storeFields.additionalFooterLinks:
                  return [key, JSON.parse(value)];
                case storeFields.logoUrl:
                  return [storeFields.logoUrlText, value];
              }
            } catch (error) {
              console.error(error);
              Sentry.captureException(error);
              return null;
            }

            return [key, value];
          })
          .filter(isTruthy);
        setValues({ ...values, ...Object.fromEntries(cleanedEntries) }, true);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.customStoreUrl]);

  const AdvancedTrigger = useMemo(() => {
    return <Section>Advanced</Section>;
  }, []);

  const StyleTrigger = useMemo(() => {
    return <Section>Style</Section>;
  }, []);
  const [switchField] = useField(storeFields.bannerSwitch);
  const [, , bannerImgPositionHelpers] = useField(
    storeFields.bannerImgPosition
  );
  useEffect(() => {
    bannerImgPositionHelpers.setValue(switchField.value ? "under" : "over");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchField.value]);
  return (
    <GridContainer
      columnGap="2.875rem"
      rowGap="2.875rem"
      itemsPerRow={{ xs: 1, s: 2, m: 2, l: 2, xl: 2 }}
    >
      <Grid
        flexDirection="column"
        alignItems="flex-start"
        flex="1 1 50%"
        gap="2rem"
      >
        <Grid flexDirection="column" alignItems="flex-start">
          <FieldTitle>Load data from an existing storefront</FieldTitle>
          <FieldDescription>
            Paste the URL of an existing custom storefront here
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
              <Grid>
                <FieldTitle style={{ whiteSpace: "pre" }}>
                  Banner URL
                </FieldTitle>

                <SwitchForm
                  gridProps={{
                    justifyContent: "flex-end",
                    style: {
                      display: values.title || values.description ? "" : "none"
                    }
                  }}
                  name={storeFields.bannerSwitch}
                  label={({ toggleFormValue, checked }) => (
                    <Typography
                      color={colors.secondary}
                      $fontSize="0.8rem"
                      onClick={() => toggleFormValue?.()}
                      cursor="pointer"
                    >
                      {checked ? "Position: under" : "Position: over"}
                    </Typography>
                  )}
                />
              </Grid>
              <FieldDescription>
                Paste the link of your banner here
              </FieldDescription>
              <Input
                name={storeFields.bannerUrlText}
                placeholder={formModel.formFields.bannerUrlText.placeholder}
              />
              <FieldDescription margin="0.5rem 0 0 0">
                or upload the image here (max. size {uploadMaxMB}MB)
              </FieldDescription>
              <Upload
                name={storeFields.bannerUpload}
                placeholder={formModel.formFields.bannerUpload.placeholder}
                withUpload
                withEditor
                width={1531}
                height={190}
                imgPreviewStyle={{ objectFit: "contain" }}
                wrapperProps={{ style: { width: "100%" } }}
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
                withEditor
                width={947}
                height={218}
                imgPreviewStyle={{ objectFit: "contain" }}
                wrapperProps={{ style: { width: "100%" } }}
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
                <Grid gap={gapBetweenInputs}>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>Upper card background</FieldDescription>
                    <InputColor
                      name={storeFields.upperCardBgColor}
                      placeholder={
                        formModel.formFields.upperCardBgColor.placeholder
                      }
                    />
                  </Grid>
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldDescription>Lower card background</FieldDescription>
                    <InputColor
                      name={storeFields.lowerCardBgColor}
                      placeholder={
                        formModel.formFields.lowerCardBgColor.placeholder
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
                  <SocialMediaLinks
                    links={values.socialMediaLinks}
                    setLinks={(links) =>
                      setFieldValue(storeFields.socialMediaLinks, links)
                    }
                  />
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldTitle>Contact info links</FieldTitle>
                    <FieldDescription>
                      Add your phone number, email and address here.
                    </FieldDescription>
                    <Select
                      options={
                        formModel.formFields.contactInfoLinks
                          .options as unknown as SelectDataProps<string>[]
                      }
                      name={storeFields.contactInfoLinks}
                      placeholder={
                        formModel.formFields.contactInfoLinks.placeholder
                      }
                      isMulti
                      isClearable
                      isSearchable
                    />
                  </Grid>
                  <ContactInfoLinks
                    links={values.contactInfoLinks}
                    setLinks={(links) =>
                      setFieldValue(storeFields.contactInfoLinks, links)
                    }
                  />
                  <Grid flexDirection="column" alignItems="flex-start">
                    <FieldTitle>Additional footer links</FieldTitle>
                    <FieldDescription>
                      Further links to add to your footer (e.g. "Terms &
                      Conditions")
                    </FieldDescription>
                    <Select
                      options={
                        formModel.formFields.additionalFooterLinks
                          .options as unknown as SelectDataProps<string>[]
                      }
                      name={storeFields.additionalFooterLinks}
                      placeholder={
                        formModel.formFields.additionalFooterLinks.placeholder
                      }
                      isClearable
                      isMulti
                    />
                  </Grid>
                  <AdditionalFooterLinks
                    links={values.additionalFooterLinks}
                    setLinks={(...args) =>
                      setFieldValue(storeFields.additionalFooterLinks, ...args)
                    }
                  />
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
        <BosonButton
          type="submit"
          variant="primaryFill"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Sign & Create"}
          {isSubmitting && <Spinner />}
        </BosonButton>
      </Grid>
      <div>
        <Grid
          justifyContent="flex-end"
          gap="0.5rem"
          alignItems="center"
          margin="0 0 0.5rem 0"
        >
          <Typography
            cursor="pointer"
            onClick={() => {
              showModal(
                "IFRAME_MODAL",
                {
                  title: "Preview",
                  src: `${dappOrigin}?${queryParams}`
                },
                "fullscreen"
              );
            }}
          >
            Preview in full screen
          </Typography>
          <ArrowsOut
            size={20}
            cursor="pointer"
            onClick={() => {
              showModal(
                "IFRAME_MODAL",
                {
                  title: "Preview",
                  src: `${dappOrigin}?${queryParams}`
                },
                "fullscreen"
              );
            }}
          />
        </Grid>
        <iframe
          src={`${dappOrigin}?${queryParams}`}
          style={{
            width: "100%",
            minHeight: "50rem",
            height: "100%"
          }}
        ></iframe>
      </div>
    </GridContainer>
  );
}
