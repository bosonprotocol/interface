import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import bytesToSize from "../../lib/utils/bytesToSize";
import { Upload } from "../form";
import FormField from "../form/FormField";
import Button from "../ui/Button";
import { ProductButtonGroup, SectionTitle } from "./Product.styles";
import { useCreateForm } from "./utils/useCreateForm";

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

  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${breakpoint.xs} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  ${breakpoint.m} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const MAX_IMAGE_SIZE = 600 * 1024;
export const SUPPORTED_FILE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png"
];
export default function ProductImages() {
  const { nextIsDisabled } = useCreateForm();

  return (
    <ContainerProductImage>
      <SectionTitle tag="h2">Product Images</SectionTitle>
      <FormField
        title="Upload your product images"
        subTitle={`You can disable images for variants that shouldn't be shown. Use a max. size of ${bytesToSize(
          MAX_IMAGE_SIZE
        )} per image`}
        style={{
          marginBottom: 0
        }}
      >
        <SpaceContainer>
          <div>
            <Upload
              name="productImages.thumbnail"
              placeholder="Thumbnail"
              maxSize={MAX_IMAGE_SIZE}
              supportFormats={SUPPORTED_FILE_FORMATS}
            />
          </div>
          <div>
            <Upload
              name="productImages.secondary"
              placeholder="Secondary"
              maxSize={MAX_IMAGE_SIZE}
              supportFormats={SUPPORTED_FILE_FORMATS}
            />
          </div>
          <div>
            <Upload
              name="productImages.everyAngle"
              placeholder="Every angle"
              maxSize={MAX_IMAGE_SIZE}
              supportFormats={SUPPORTED_FILE_FORMATS}
            />
          </div>
          <div>
            <Upload
              name="productImages.details"
              placeholder="Details"
              maxSize={MAX_IMAGE_SIZE}
              supportFormats={SUPPORTED_FILE_FORMATS}
            />
          </div>
          <div>
            <Upload
              name="productImages.inUse"
              placeholder="In Use"
              maxSize={MAX_IMAGE_SIZE}
              supportFormats={SUPPORTED_FILE_FORMATS}
            />
          </div>
          <div>
            <Upload
              name="productImages.styledScene"
              placeholder="Styled Scene"
              maxSize={MAX_IMAGE_SIZE}
              supportFormats={SUPPORTED_FILE_FORMATS}
            />
          </div>
          <div>
            <Upload
              name="productImages.sizeAndScale"
              placeholder="Size and scale"
              maxSize={MAX_IMAGE_SIZE}
              supportFormats={SUPPORTED_FILE_FORMATS}
            />
          </div>
          <div>
            <Upload
              name="productImages.more"
              placeholder="More"
              maxSize={MAX_IMAGE_SIZE}
              supportFormats={SUPPORTED_FILE_FORMATS}
            />
          </div>
        </SpaceContainer>
      </FormField>
      <ProductButtonGroup>
        <Button theme="primary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductImage>
  );
}
