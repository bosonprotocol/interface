import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Upload } from "../form";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ProductButtonGroup } from "./Product.styles";

export const Box = styled.div`
  padding: 1.625rem 0;
  height: 100%;
  width: 100%;
  min-height: 150px;
  text-align: center;
  border: 1px solid ${colors.lightGrey};
`;

export const Container = styled.div`
  width: 100%;
`;

const ContainerProductImage = styled.div`
  max-width: 696px;
  width: 100%;
`;

const SpaceContainer = styled.div`
  margin-top: 2rem;
  > div {
    margin: 0 2rem 2rem 0;
  }
`;

const FILE_MAX_SIZE = 0.6 * 1000;
export default function ProductImages() {
  return (
    <ContainerProductImage>
      <Typography tag="h2">Product Images</Typography>
      <InputGroup
        title="Upload your product images"
        subTitle="You can disable images for variants that shouldn't be shown. Use a max. width and height of 1200px and a max. size of 600kb per image."
        popper="Need to be added"
        style={{
          marginBottom: 0
        }}
      >
        <SpaceContainer>
          <Upload
            name="productImages.thumbnail"
            placeholder="Thumbnail"
            maxUploadSize={FILE_MAX_SIZE}
          />
          <Upload
            name="productImages.secondary"
            placeholder="Secondary"
            maxUploadSize={FILE_MAX_SIZE}
          />
          <Upload
            name="productImages.everyAngle"
            placeholder="Every angle"
            maxUploadSize={FILE_MAX_SIZE}
          />
          <Upload
            name="productImages.details"
            placeholder="Details"
            maxUploadSize={FILE_MAX_SIZE}
          />
          <Upload
            name="productImages.inUse"
            placeholder="In Use"
            maxUploadSize={FILE_MAX_SIZE}
          />
          <Upload
            name="productImages.styledScene"
            placeholder="Styled Scene"
            maxUploadSize={FILE_MAX_SIZE}
          />
          <Upload
            name="productImages.sizeAndScale"
            placeholder="Size and scale"
            maxUploadSize={FILE_MAX_SIZE}
          />
          <Upload
            name="productImages.more"
            placeholder="More"
            maxUploadSize={FILE_MAX_SIZE}
          />
        </SpaceContainer>
      </InputGroup>
      <ProductButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductImage>
  );
}
