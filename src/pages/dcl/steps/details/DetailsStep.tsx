import { useFormikContext } from "formik";
import React from "react";

import { FormField } from "../../../../components/form";
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
import { DCLLayout } from "../../styles";
type DetailsStepProps = {
  goToNextStep: () => void;
};
export const DetailsStep: React.FC<DetailsStepProps> = ({ goToNextStep }) => {
  const { values, handleChange } = useFormikContext<any>();
  return (
    <DCLLayout width="auto">
      <Grid flexDirection="column" alignItems="flex-start">
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
                name="step1.location"
                value="own-land"
                checked={values.step1.location === "own-land"}
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
                name="step1.location"
                value="boson-land"
                checked={values.step1.location === "boson-land"}
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
    </DCLLayout>
  );
};
