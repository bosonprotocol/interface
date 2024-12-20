import { isTruthy } from "lib/types/helpers";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import bytesToSize from "../../lib/utils/bytesToSize";
import { useForm } from "../../lib/utils/hooks/useForm";
import { Select, Upload } from "../form";
import FormField from "../form/FormField";
import { MAX_FILE_SIZE } from "../form/Upload/WithUploadToIpfs";
import Tabs from "../tabs/Tabs";
import BosonButton from "../ui/BosonButton";
import { Grid } from "../ui/Grid";
import { DigitalUploadImages } from "./DigitalProductImages";
import { PhysicalUploadImages } from "./PhysicalProductImages";
import { ProductButtonGroup, SectionTitle } from "./Product.styles";
import { getBundleItemId } from "./productDigital/getBundleItemId";
import { getBundleItemName } from "./productDigital/getBundleItemName";
import {
  DigitalFile,
  Experiential,
  getIsBundleItem,
  NewNFT
} from "./productDigital/getIsBundleItem";
import {
  CreateProductForm,
  IMAGE_SPECIFIC_OR_ALL_OPTIONS,
  ImageSpecificOrAll,
  MAX_VIDEO_FILE_SIZE,
  ProductTypeTypeValues,
  ProductTypeVariantsValues
} from "./utils";

const ContainerProductImage = styled.div`
  max-width: 43.5rem;
  width: 100%;
  &:has(.digital) {
    #product-animation {
      display: none;
    }
  }
`;

const StyledSelect = styled(Select)`
  flex: 0 0 11.25rem;
`;

const StyledTabs = styled(Tabs)`
  [data-tab-title] {
    padding-right: 2rem;
    font-size: 0.8063rem;
    &.digital[data-active="false"] {
      width: 16ch;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: content-box;
    }
  }
`;

interface Props {
  onChangeOneSetOfImages: (oneSetOfImages: boolean) => void;
}
const productImagesPrefix = "productImages";
const getProductImageError = (
  index: number,
  errors: ReturnType<typeof useForm<CreateProductForm>>["errors"]
) => {
  const error =
    errors.productImages && typeof errors.productImages === "string"
      ? errors.productImages
      : typeof errors.productImages === "object" &&
          Array.isArray(errors.productImages) &&
          typeof errors.productImages[index] === "object" &&
          typeof Object.values(errors.productImages[index])?.[0] === "string"
        ? (Object.values(errors.productImages[index])?.[0] as string) || ""
        : typeof errors.productImages === "object" &&
            typeof Object.values(errors.productImages)?.[0] === "string"
          ? Object.values(errors.productImages)?.[0]
          : null;
  return error? String(error) : error;
};
export default function ProductImages({ onChangeOneSetOfImages }: Props) {
  const { nextIsDisabled, values, errors } = useForm();
  const [isVideoLoading, setVideoLoading] = useState<boolean>();
  const hasVariants =
    values.productType.productVariant ===
    ProductTypeVariantsValues.differentVariants;
  const oneSetOfImages =
    !hasVariants ||
    values.imagesSpecificOrAll?.value === ImageSpecificOrAll.all;
  const isPhygital =
    values.productType.productType === ProductTypeTypeValues.phygital;
  const tabsData = useMemo(() => {
    return [
      ...(oneSetOfImages
        ? [
            {
              id: "physical-item",
              title: "Physical item",
              content: (
                <PhysicalUploadImages
                  prefix={productImagesPrefix}
                  error={getProductImageError(0, errors)}
                />
              )
            }
          ]
        : values.productVariants?.variants?.map(
            (variant: { name: string }, index: number) => {
              return {
                id: variant.name || index + "",
                title: variant.name || `Variant ${index}`,
                content: (
                  <PhysicalUploadImages
                    prefix={`productVariantsImages[${index}].productImages`}
                    error={getProductImageError(index, errors)}
                  />
                )
              };
            }
          ) || []),
      ...(isPhygital
        ? values.productDigital?.bundleItems
            ?.map((bi, index) => {
              const isNewNft = getIsBundleItem<NewNFT>(bi, "newNftName");
              const isNotNFT =
                getIsBundleItem<DigitalFile>(bi, "digitalFileName") ||
                getIsBundleItem<Experiential>(bi, "experientialName");
              if (isNewNft || isNotNFT) {
                const error =
                  errors.bundleItemsMedia &&
                  typeof errors.bundleItemsMedia === "string"
                    ? errors.bundleItemsMedia
                    : typeof errors.bundleItemsMedia === "object" &&
                        Array.isArray(errors.bundleItemsMedia) &&
                        typeof errors.bundleItemsMedia[index] === "object" &&
                        typeof Object.values(
                          errors.bundleItemsMedia[index]
                        )?.[0] === "string"
                      ? (Object.values(
                          errors.bundleItemsMedia[index]
                        )?.[0] as string) || ""
                      : null;
                const name = getBundleItemName(bi);
                return {
                  id: `${getBundleItemId(bi)}-${index}`,
                  title: `Digital Item - ${name}`,
                  className: "digital",
                  content: (
                    <DigitalUploadImages
                      className="digital"
                      prefix={`bundleItemsMedia[${index}]`}
                      error={error}
                    />
                  )
                };
              }
              return null;
            })
            .filter(isTruthy) ?? []
        : [])
    ];
  }, [
    errors,
    oneSetOfImages,
    values.productDigital?.bundleItems,
    values.productVariants?.variants,
    isPhygital
  ]);
  const TabsContent = useCallback(({ children }: { children: ReactNode }) => {
    return <div>{children}</div>;
  }, []);
  useEffect(() => {
    onChangeOneSetOfImages(oneSetOfImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneSetOfImages]);
  useEffect(() => {
    if (
      !oneSetOfImages &&
      values.productVariants &&
      values.productVariantsImages &&
      values.productVariants.variants.length <
        values.productVariantsImages.length
    ) {
      const difference =
        values.productVariantsImages.length -
        values.productVariants.variants.length;
      values.productVariantsImages.splice(
        values.productVariants.variants.length,
        difference
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.productVariants?.variants, oneSetOfImages]);

  const areSpecificImagesCorrect = oneSetOfImages
    ? true
    : values.productVariants.variants.length ===
      values.productVariantsImages?.length;

  return (
    <ContainerProductImage>
      <Grid>
        <SectionTitle tag="h2">Product Images</SectionTitle>
        {hasVariants && (
          <>
            <StyledSelect
              name="imagesSpecificOrAll"
              options={IMAGE_SPECIFIC_OR_ALL_OPTIONS}
            />
          </>
        )}
      </Grid>
      <FormField
        title="Upload your product images"
        subTitle={`Use a max. size of ${bytesToSize(MAX_FILE_SIZE)} per image`}
      >
        {oneSetOfImages && !isPhygital ? (
          <PhysicalUploadImages
            prefix={productImagesPrefix}
            error={getProductImageError(0, errors)}
          />
        ) : (
          <StyledTabs tabsData={tabsData} Content={TabsContent} />
        )}
      </FormField>
      <FormField
        id="product-animation"
        title="Upload your product animation video"
        // subTitle={`${
        //   hasVariants
        //     ? "This will apply across all variants of your product."
        //     : ""
        // } . GLTF, GLB, WEBM, MP4, M4V, OGV, and OGG are supported. Use a max. size of ${bytesToSize(
        //   MAX_VIDEO_FILE_SIZE
        // )} for the video`}
        subTitle={`${
          hasVariants
            ? "This will apply across all variants of your product. "
            : ""
        }Only MP4 is supported. Use a max. size of ${bytesToSize(
          MAX_VIDEO_FILE_SIZE
        )} for the video`}
        style={{
          marginBottom: 0
        }}
      >
        <Upload
          name="productAnimation"
          placeholder="Video"
          // accept="video/webm, video/mp4, video/m4v, video/ogv, video/ogg"
          accept="video/mp4"
          maxSize={MAX_VIDEO_FILE_SIZE}
          withUpload
          onLoading={(loading) => setVideoLoading(loading)}
        />
      </FormField>
      <ProductButtonGroup>
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={
            nextIsDisabled || isVideoLoading || !areSpecificImagesCorrect
          }
        >
          Next
        </BosonButton>
      </ProductButtonGroup>
    </ContainerProductImage>
  );
}
