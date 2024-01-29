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
import {
  IMAGE_SPECIFIC_OR_ALL_OPTIONS,
  ImageSpecificOrAll,
  MAX_VIDEO_FILE_SIZE,
  ProductTypeTypeValues,
  ProductTypeVariantsValues
} from "./utils";

const ContainerProductImage = styled.div`
  max-width: 43.5rem;
  width: 100%;
`;

const StyledSelect = styled(Select)`
  flex: 0 0 11.25rem;
`;

const StyledTabs = styled(Tabs)`
  [data-tab-title] {
    padding-right: 2rem;
    font-size: 0.8063rem;
  }
`;

interface Props {
  onChangeOneSetOfImages: (oneSetOfImages: boolean) => void;
}
const productImagesPrefix = "productImages";
export default function ProductImages({ onChangeOneSetOfImages }: Props) {
  const { nextIsDisabled, values } = useForm();
  const [isVideoLoading, setVideoLoading] = useState<boolean>();
  const hasVariants =
    values.productType.productVariant ===
    ProductTypeVariantsValues.differentVariants;
  const oneSetOfImages =
    !hasVariants ||
    values.imagesSpecificOrAll?.value === ImageSpecificOrAll.all;
  const withTokenGatedImages =
    values.productType.productType === ProductTypeTypeValues.phygital &&
    values.productDigital.isNftMintedAlready.value === "false";
  const tabsData = useMemo(() => {
    return [
      ...(oneSetOfImages
        ? [
            {
              id: "physical-item",
              title: "Physical item",
              content: <PhysicalUploadImages prefix={productImagesPrefix} />
            }
          ]
        : values.productVariants?.variants?.map((variant, index) => {
            return {
              id: variant.name || index + "",
              title: variant.name || `Variant ${index}`,
              content: (
                <PhysicalUploadImages
                  prefix={`productVariantsImages[${index}].productImages`}
                />
              )
            };
          }) || []),
      ...(withTokenGatedImages
        ? values.productDigital?.bundleItems
            ?.map((bi, index) => {
              if ("name" in bi) {
                return {
                  id: `${bi.name}-${bi.description}-${index}`,
                  title: bi.name,
                  content: (
                    <DigitalUploadImages
                      prefix={`bundleItemsMedia[${index}]`}
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
    values.productDigital?.bundleItems,
    values.productVariants?.variants,
    withTokenGatedImages,
    oneSetOfImages
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
        {oneSetOfImages && !withTokenGatedImages ? (
          <PhysicalUploadImages prefix={productImagesPrefix} />
        ) : (
          <StyledTabs tabsData={tabsData} Content={TabsContent} />
        )}
      </FormField>
      <FormField
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
