import { ReactNode, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { Select, Upload } from "../form";
import FormField from "../form/FormField";
import Tabs from "../tabs/Tabs";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
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
  const { nextIsDisabled, values, errors, setErrors } = useCreateForm();
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
            <UploadImages prefix={`productVariantsImages[${index}].images`} />
          )
        };
      }) || []
    );
  }, [values.productVariants.variants]);
  const TabsContent = useCallback(({ children }: { children: ReactNode }) => {
    return <div>{children}</div>;
  }, []);
  useEffect(() => {
    setErrors({});
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
        subTitle="You can disable images for variants that shouldn't be shown. Use a max. size of 600Kb per image"
        style={{
          marginBottom: 0
        }}
      >
        {oneSetOfImages ? (
          <UploadImages prefix={productImagesPrefix} />
        ) : (
          <StyledTabs tabsData={tabsData} Content={TabsContent} />
        )}
      </FormField>
      <ProductButtonGroup>
        <Button theme="primary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductImage>
  );
}
