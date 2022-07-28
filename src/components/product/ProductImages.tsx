import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Upload } from "../form";
import FormField from "../form/FormField";
import Button from "../ui/Button";
import { ProductButtonGroup, SectionTitle } from "./Product.styles";

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
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
  > div {
    margin: 0 2rem 2rem 0;
  }
`;

export default function ProductImages() {
  return (
    <ContainerProductImage>
      <SectionTitle tag="h2">Product Images</SectionTitle>
      <FormField
        title="Upload your product images"
        subTitle="You can disable images for variants that shouldn't be shown. Use a max. width and height of 1200px and a max. size of 600kb per image."
        tooltip="Need to be added"
        style={{
          marginBottom: 0
        }}
      >
        <SpaceContainer>
          <Upload name="productImages.thumbnail" placeholder="Thumbnail" />
          <Upload name="productImages.secondary" placeholder="Secondary" />
          <Upload name="productImages.everyAngle" placeholder="Every angle" />
          <Upload name="productImages.details" placeholder="Details" />
          <Upload name="productImages.inUse" placeholder="In Use" />
          <Upload name="productImages.styledScene" placeholder="Styled Scene" />
          <Upload
            name="productImages.sizeAndScale"
            placeholder="Size and scale"
          />
          <Upload name="productImages.more" placeholder="More" />
        </SpaceContainer>
      </FormField>
      <ProductButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductImage>
  );
}
