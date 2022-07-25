import { useFormikContext } from "formik";
import styled from "styled-components";

import Field, { FieldType } from "../../components/form/Field";
import { colors } from "../../lib/styles/colors";
import Button from "../ui/Button";
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
  margin-top: 2rem;
  > div {
    margin: 0 2rem 2rem 0;
  }
`;

const FILE_MAX_SIZE = 0.6 * 1024;

export default function ProductImages() {
  const { handleChange, values } = useFormikContext<CreateProductForm>();
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
          <Field
            fieldType={FieldType.FileUpload}
            fileMaxSize={FILE_MAX_SIZE}
            placeholder="Thumbnail"
          />
          <Field
            fieldType={FieldType.FileUpload}
            fileMaxSize={FILE_MAX_SIZE}
            placeholder="Secondary"
          />
          <Field
            fieldType={FieldType.FileUpload}
            fileMaxSize={FILE_MAX_SIZE}
            placeholder="Every angle"
          />
          <Field
            fieldType={FieldType.FileUpload}
            fileMaxSize={FILE_MAX_SIZE}
            placeholder="Details"
          />
          <Field
            fieldType={FieldType.FileUpload}
            fileMaxSize={FILE_MAX_SIZE}
            placeholder="In Use"
          />
          <Field
            fieldType={FieldType.FileUpload}
            fileMaxSize={FILE_MAX_SIZE}
            placeholder="Styled Scene"
          />
          <Field
            fieldType={FieldType.FileUpload}
            placeholder="Size and scale"
            fileMaxSize={FILE_MAX_SIZE}
          />
          <Field
            fieldType={FieldType.FileUpload}
            fileMaxSize={FILE_MAX_SIZE}
            placeholder="More"
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
