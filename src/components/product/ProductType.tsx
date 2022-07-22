import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import GridContainer from "../ui/GridContainer";
import Image from "../ui/Image";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import differentVariantsProduct from "./img/different-variants-product.png";
import oneItemTypeProduct from "./img/one-item-product.png";
import phygitalProduct from "./img/phygital-product.png";
import physicalProduct from "./img/physical-product.png";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";

const productTypeItemsPerRow = {
  xs: 1,
  s: 1,
  m: 1,
  l: 1,
  xl: 1
};
const Label = styled.label`
  max-width: 200px;
  align-items: center;
  border: 1px solid ${colors.lightGrey};
  width: 100%;
  text-align: center;
  margin-top: 4px;
  background: transparent;
  height: 197px;
  cursor: pointer;
`;
const RadioButton = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  img {
    cursor: pointer;
  }
  &:checked + div {
    border: 1px solid ${colors.green};
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 0px 8px rgba(0, 0, 0, 0.1),
      0px 0px 16px rgba(0, 0, 0, 0.1), 0px 0px 32px rgba(0, 0, 0, 0.1);
  }
`;

export const Box = styled.div`
  padding: 28px;
  height: 100%;
  width: 100%;
`;
export const Container = styled.div`
  max-width: 424px;
`;

export default function ProductType() {
  return (
    <ContainerProductPage>
      <Typography tag="h2">Product Type</Typography>
      <Container>
        <GridContainer itemsPerRow={productTypeItemsPerRow}>
          <InputGroup
            title="Select Product Type*"
            popper="lorem20"
            style={{
              marginBottom: 0
            }}
          >
            <Grid>
              <Label>
                <RadioButton type="radio" name="productType" value="physical" />
                <Box>
                  <Image
                    src={physicalProduct}
                    style={{
                      width: "100px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <Typography
                    tag="p"
                    style={{
                      margin: "15px 0 0 0"
                    }}
                  >
                    Physical
                  </Typography>
                </Box>
              </Label>
              <Label>
                <RadioButton type="radio" name="productType" value="phygital" />
                <Box>
                  <Image
                    src={phygitalProduct}
                    style={{
                      width: "100px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <Typography
                    tag="p"
                    style={{
                      margin: "15px 0 0 0"
                    }}
                  >
                    Phygital
                  </Typography>
                </Box>
              </Label>
            </Grid>
          </InputGroup>
          <InputGroup
            title="Product Variants*"
            popper="lorem20"
            style={{
              marginBottom: 0
            }}
          >
            <Grid>
              <Label>
                <RadioButton
                  type="radio"
                  name="productVariant"
                  value="oneItemType"
                />
                <Box>
                  <Image
                    src={oneItemTypeProduct}
                    style={{
                      width: "62px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <Typography
                    tag="p"
                    style={{
                      margin: "15px 0 0 0"
                    }}
                  >
                    Physical
                  </Typography>
                </Box>
              </Label>
              <Label>
                <RadioButton
                  type="radio"
                  name="productVariant"
                  value="differentVariants"
                />
                <Box>
                  <Image
                    src={differentVariantsProduct}
                    style={{
                      width: "54px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <Typography
                    tag="p"
                    style={{
                      margin: "15px 0 0 0"
                    }}
                  >
                    Different Variants
                  </Typography>
                </Box>
              </Label>
            </Grid>
          </InputGroup>
        </GridContainer>
        <ProductButtonGroup>
          <Button theme="secondary" type="submit">
            Next
          </Button>
        </ProductButtonGroup>
      </Container>
    </ContainerProductPage>
  );
}
