import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import {
  createProductImagePrefix,
  CreateProductImageProductImages,
  useLocalStorage
} from "../../lib/utils/hooks/useLocalStorage";
import { Upload } from "../form";
import FormField from "../form/FormField";
import { UploadProps } from "../form/types";
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

export default function ProductImages() {
  const { nextIsDisabled } = useCreateForm();

  const [, setThumbnailBase64] =
    useLocalStorage<CreateProductImageProductImages | null>(
      `${createProductImagePrefix}productImages.thumbnail`,
      null
    );
  const [, setSecondaryBase64] =
    useLocalStorage<CreateProductImageProductImages | null>(
      `${createProductImagePrefix}productImages.secondary`,
      null
    );
  const [, setEveryAngleBase64] =
    useLocalStorage<CreateProductImageProductImages | null>(
      `${createProductImagePrefix}productImages.everyAngle`,
      null
    );
  const [, setDetailsBase64] =
    useLocalStorage<CreateProductImageProductImages | null>(
      `${createProductImagePrefix}productImages.details`,
      null
    );
  const [, setInUseBase64] =
    useLocalStorage<CreateProductImageProductImages | null>(
      `${createProductImagePrefix}productImages.inUse`,
      null
    );
  const [, setStyledSceneBase64] =
    useLocalStorage<CreateProductImageProductImages | null>(
      `${createProductImagePrefix}productImages.styledScene`,
      null
    );
  const [, setSizeAndScaleBase64] =
    useLocalStorage<CreateProductImageProductImages | null>(
      `${createProductImagePrefix}productImages.sizeAndScale`,
      null
    );
  const [, setMoreBase64] =
    useLocalStorage<CreateProductImageProductImages | null>(
      `${createProductImagePrefix}productImages.more`,
      null
    );
  return (
    <ContainerProductImage>
      <SectionTitle tag="h2">Product Images</SectionTitle>
      <FormField
        title="Upload your product images"
        subTitle="You can disable images for variants that shouldn't be shown. Use a max. size of 600Kb per image"
        style={{
          marginBottom: 0
        }}
      >
        <SpaceContainer>
          <div>
            <Upload
              name="productImages.thumbnail"
              placeholder="Thumbnail"
              onLoadSinglePreviewImage={
                setThumbnailBase64 as UploadProps["onLoadSinglePreviewImage"]
              }
            />
          </div>
          <div>
            <Upload
              name="productImages.secondary"
              placeholder="Secondary"
              onLoadSinglePreviewImage={
                setSecondaryBase64 as UploadProps["onLoadSinglePreviewImage"]
              }
            />
          </div>
          <div>
            <Upload
              name="productImages.everyAngle"
              placeholder="Every angle"
              onLoadSinglePreviewImage={
                setEveryAngleBase64 as UploadProps["onLoadSinglePreviewImage"]
              }
            />
          </div>
          <div>
            <Upload
              name="productImages.details"
              placeholder="Details"
              onLoadSinglePreviewImage={
                setDetailsBase64 as UploadProps["onLoadSinglePreviewImage"]
              }
            />
          </div>
          <div>
            <Upload
              name="productImages.inUse"
              placeholder="In Use"
              onLoadSinglePreviewImage={
                setInUseBase64 as UploadProps["onLoadSinglePreviewImage"]
              }
            />
          </div>
          <div>
            <Upload
              name="productImages.styledScene"
              placeholder="Styled Scene"
              onLoadSinglePreviewImage={
                setStyledSceneBase64 as UploadProps["onLoadSinglePreviewImage"]
              }
            />
          </div>
          <div>
            <Upload
              name="productImages.sizeAndScale"
              placeholder="Size and scale"
              onLoadSinglePreviewImage={
                setSizeAndScaleBase64 as UploadProps["onLoadSinglePreviewImage"]
              }
            />
          </div>
          <div>
            <Upload
              name="productImages.more"
              placeholder="More"
              onLoadSinglePreviewImage={
                setMoreBase64 as UploadProps["onLoadSinglePreviewImage"]
              }
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
