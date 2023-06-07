import { useFormikContext } from "formik";
import React from "react";
import styled from "styled-components";

import { FormField } from "../../../../components/form";
import Help from "../../../../components/product/Help";
import differentVariantsProduct from "../../../../components/product/img/different-variants-product.png";
import oneItemTypeProduct from "../../../../components/product/img/one-item-product.png";
import {
  Box,
  Label,
  ProductImage,
  RadioButton
} from "../../../../components/product/ProductType";
import BosonButton from "../../../../components/ui/BosonButton";
import Grid from "../../../../components/ui/Grid";
import GridContainer from "../../../../components/ui/GridContainer";
import Typography from "../../../../components/ui/Typography";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { DCLLayout } from "../../styles";
import { FormType, LocationValues } from "../../validationSchema";

const StyledDCLLayout = styled(DCLLayout)`
  padding-right: 0;

  ${breakpoint.xl} {
    padding-right: 4rem;
  }
`;

type DetailsStepProps = {
  goToNextStep: () => void;
};
export const DetailsStep: React.FC<DetailsStepProps> = ({ goToNextStep }) => {
  const { values, handleChange } = useFormikContext<FormType>();
  return (
    <StyledDCLLayout width="auto">
      <Grid
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap="3rem"
      >
        <Grid flexDirection="column" alignItems="flex-start" $width="auto">
          <Typography fontWeight="600" $fontSize="2rem">
            Where do you want to sell on DCL?
          </Typography>
          <FormField
            title="Select location"
            required
            style={{
              marginBottom: 0,
              marginTop: "3.5rem"
            }}
          >
            <GridContainer
              rowGap="1rem"
              columnGap="1rem"
              itemsPerRow={{
                xs: 2,
                s: 2,
                m: 2,
                l: 2,
                xl: 2
              }}
            >
              <Label>
                <RadioButton
                  type="radio"
                  name="step0.location"
                  value={LocationValues.OwnLand}
                  checked={values.step0.location === LocationValues.OwnLand}
                  onChange={handleChange}
                />
                <Box>
                  <ProductImage
                    src={oneItemTypeProduct}
                    style={{
                      width: "62px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <Typography tag="p">Your own Land</Typography>
                </Box>
              </Label>
              <Label>
                <RadioButton
                  type="radio"
                  name="step0.location"
                  value={LocationValues.BosonLand}
                  checked={values.step0.location === LocationValues.BosonLand}
                  onChange={handleChange}
                />
                <Box>
                  <ProductImage
                    src={differentVariantsProduct}
                    style={{
                      width: "54px",
                      height: "100px",
                      paddingTop: "0px",
                      margin: "auto"
                    }}
                  />
                  <Typography tag="p">BOSON Land</Typography>
                </Box>
              </Label>
            </GridContainer>
          </FormField>
          <BosonButton
            onClick={() => goToNextStep()}
            style={{ marginTop: "3.5rem" }}
          >
            Next
          </BosonButton>
        </Grid>

        <Help data={[{ title: "hola", description: "desc" }]} />
      </Grid>
    </StyledDCLLayout>
  );
};
