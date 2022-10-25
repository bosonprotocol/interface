import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import bytesToSize from "../../lib/utils/bytesToSize";
import { Select, Upload } from "../form";
import FormField from "../form/FormField";
import { MAX_FILE_SIZE } from "../form/Upload/WithUploadToIpfs";
import Tabs from "../tabs/Tabs";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import { ProductButtonGroup, SectionTitle } from "./Product.styles";
import { useCreateForm } from "./utils/useCreateForm";

const MAX_VIDEO_FILE_SIZE = 65 * 1024 * 1024;

export const Box = styled.div`
  padding: 1.625rem 0;
  height: 100%;
  width: 100%;
  min-height: 9.375rem;
  text-align: center;
  border: 1px solid ${colors.lightGrey};
`;

export const Container = styled.div`
  width: 100%;
`;

const ContainerProductImage = styled.div`
  max-width: 43.5rem;
  width: 100%;
`;

const SpaceContainer = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  justify-content: space-between;

  grid-template-columns: repeat(1, max-content);
  ${breakpoint.xs} {
    grid-template-columns: repeat(2, max-content);
  }
  ${breakpoint.m} {
    grid-template-columns: repeat(4, max-content);
  }
`;

const StyledSelect = styled(Select)`
  flex: 0 0 11.25rem;
`;

const StyledTabs = styled(Tabs)`
  [data-tab-title] {
    padding-right: 2rem;
  }
`;

function UploadImages({ prefix }: { prefix: string }) {
  return (
    <>
      <SpaceContainer>
        <div>
          <Upload
            name={`${prefix}.thumbnail`}
            placeholder="Thumbnail"
            withUpload
          />
        </div>
        <div>
          <Upload
            name={`${prefix}.secondary`}
            placeholder="Secondary"
            withUpload
          />
        </div>
        <div>
          <Upload
            name={`${prefix}.everyAngle`}
            placeholder="Every angle"
            withUpload
          />
        </div>
        <div>
          <Upload name={`${prefix}.details`} placeholder="Details" withUpload />
        </div>
        <div>
          <Upload name={`${prefix}.inUse`} placeholder="In Use" withUpload />
        </div>
        <div>
          <Upload
            name={`${prefix}.styledScene`}
            placeholder="Styled Scene"
            withUpload
          />
        </div>
        <div>
          <Upload
            name={`${prefix}.sizeAndScale`}
            placeholder="Size and scale"
            withUpload
          />
        </div>
        <div>
          <Upload name={`${prefix}.more`} placeholder="More" withUpload />
        </div>
      </SpaceContainer>
    </>
  );
}
interface Props {
  onChangeOneSetOfImages: (oneSetOfImages: boolean) => void;
}
const productImagesPrefix = "productImages";
export default function ProductImages({ onChangeOneSetOfImages }: Props) {
  const { nextIsDisabled, values } = useCreateForm();
  const [isVideoLoading, setVideoLoading] = useState<boolean>();
  const hasVariants = values.productType.productVariant === "differentVariants";
  const oneSetOfImages =
    !hasVariants || values.imagesSpecificOrAll?.value === "all";
  const tabsData = useMemo(() => {
    return (
      values.productVariants.variants?.map((variant, index) => {
        return {
          id: variant.name || index + "",
          title: variant.name || `Variant ${index}`,
          content: (
            <UploadImages
              prefix={`productVariantsImages[${index}].productImages`}
            />
          )
        };
      }) || []
    );
  }, [values.productVariants.variants]);
  const TabsContent = useCallback(({ children }: { children: ReactNode }) => {
    return <div>{children}</div>;
  }, []);
  useEffect(() => {
    onChangeOneSetOfImages(oneSetOfImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneSetOfImages]);
  return (
    <ContainerProductImage>
      <Grid>
        <SectionTitle tag="h2">Product Images</SectionTitle>
        {hasVariants && (
          <>
            <StyledSelect
              name="imagesSpecificOrAll"
              options={[
                {
                  value: "all",
                  label: "All"
                },
                {
                  value: "specific",
                  label: "Specific"
                }
              ]}
            />
          </>
        )}
      </Grid>
      <FormField
        title="Upload your product images"
        subTitle={`You can disable images for variants that shouldn't be shown. Use a max. size of ${bytesToSize(
          MAX_FILE_SIZE
        )} per image`}
      >
        {oneSetOfImages ? (
          <UploadImages prefix={productImagesPrefix} />
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
            ? "This will apply across all variants of your product"
            : ""
        }. Only MP4 is supported. Use a max. size of ${bytesToSize(
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
        <Button
          theme="primary"
          type="submit"
          disabled={nextIsDisabled || isVideoLoading}
        >
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductImage>
  );
}
