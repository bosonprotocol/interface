import { useFormikContext } from "formik";
import styled from "styled-components";

import placeholderImage from "../../assets/placeholder/placeholder-thumbnail.png";
import { colors } from "../../lib/styles/colors";
import Button from "../ui/Button";
import GridContainer from "../ui/GridContainer";
import Image from "../ui/Image";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ProductButtonGroup } from "./Product.styles";
import type { CreateProductForm } from "./validation/createProductValidationSchema";
const productTypeItemsPerRow = {
  xs: 2,
  s: 2,
  m: 2,
  l: 4,
  xl: 4
};

export const Box = styled.div`
  padding: 26px 0;
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
  margin-top: 32px;
`;

const StyledTitle = styled(Typography)`
  display: block;
  width: 100%;
  margin: 25px 0 0 0;
`;

const StyledImage = styled(Image)`
  width: 40px;
  height: 40px;
  padding-top: 0;
  margin: auto;
`;

export default function ProductImages() {
  const { handleChange, values } = useFormikContext<CreateProductForm>();
  return (
    <ContainerProductImage>
      <Typography tag="h2">Product Images</Typography>
      <InputGroup
        title="Upload your product images"
        subTitle="You can disable images for variants that shouldn't be shown.
              Use a max. width and height of 1200px and a max. size of 600kb per image."
        popper="Need to be added"
        style={{
          marginBottom: 0
        }}
      >
        <SpaceContainer>
          <GridContainer itemsPerRow={productTypeItemsPerRow}>
            {/* TODO: ADD CORRECT WHEN WILL BE AVAILABLE FOR NOW JUST PLACeHOLDER JSX */}
            <Box>
              <StyledImage src={placeholderImage} />
              <StyledTitle tag="p">Thumbnail</StyledTitle>
            </Box>
            <Box>
              <StyledImage src={placeholderImage} />
              <StyledTitle tag="p">Secondary</StyledTitle>
            </Box>
            <Box>
              <StyledImage src={placeholderImage} />
              <StyledTitle tag="p">Every angle</StyledTitle>
            </Box>
            <Box>
              <StyledImage src={placeholderImage} />
              <StyledTitle tag="p">Details</StyledTitle>
            </Box>
            <Box>
              <StyledImage src={placeholderImage} />
              <StyledTitle tag="p">In Use</StyledTitle>
            </Box>
            <Box>
              <StyledImage src={placeholderImage} />
              <StyledTitle tag="p">Styled Scene</StyledTitle>
            </Box>
            <Box>
              <StyledImage src={placeholderImage} />
              <StyledTitle tag="p">Size and Scale</StyledTitle>
            </Box>
            <Box>
              <StyledImage src={placeholderImage} />
              <StyledTitle tag="p">More</StyledTitle>
            </Box>
          </GridContainer>
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
