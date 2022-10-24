import { ReactNode, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import bytesToSize from "../../lib/utils/bytesToSize";
import { Select, Upload } from "../form";
import FormField from "../form/FormField";
import { MAX_FILE_SIZE } from "../form/Upload/WithUploadToIpfs";
import Tabs from "../tabs/Tabs";
import BosonButton from "../ui/BosonButton";
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
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={nextIsDisabled}
        >
          Next
        </BosonButton>
      </ProductButtonGroup>
    </ContainerProductImage>
  );
}
