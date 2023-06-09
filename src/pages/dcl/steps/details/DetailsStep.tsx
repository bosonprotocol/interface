import { useFormikContext } from "formik";
import React from "react";

import { Error, FormField } from "../../../../components/form";
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
import { StyledDCLLayout } from "../../styles";
import { FormType, LocationValues } from "../../validationSchema";

type DetailsStepProps = {
  goToNextStep: () => void;
};
export const DetailsStep: React.FC<DetailsStepProps> = ({ goToNextStep }) => {
  const { values, handleChange, isValid, touched, setFieldTouched, errors } =
    useFormikContext<FormType>();
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
                  name="location"
                  value={LocationValues.OwnLand}
                  checked={values.location === LocationValues.OwnLand}
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
                  name="location"
                  value={LocationValues.BosonLand}
                  checked={values.location === LocationValues.BosonLand}
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
            <Error display={!!errors.location} message={errors.location} />
          </FormField>
          <BosonButton
            onClick={() => {
              if (!touched.location) {
                setFieldTouched("location", true);
                return;
              }
              if (isValid) {
                goToNextStep();
              }
            }}
            style={{ marginTop: "3.5rem" }}
          >
            Next
          </BosonButton>
        </Grid>

        <Help
          data={[
            {
              title: "Which Metaverses can I set up a store in?",
              description:
                "Currently, our Metaverse Commerce Toolkit supports setting up a store in Decentraland (DCL). We are expanding into other Metaverse and will be supporting setting up stores in many more places. "
            },
            {
              title: "What is Boson Boulevard?",
              description:
                "Boson Boulevard is a dcommerce district that has been created in the Boson virtual environment in DCL. "
            },
            {
              title: "Can anyone sell on Boson Boulevard?",
              description:
                "Boson Boulevard is a curated dcommerce experience. Brands need to meet certain criteria to sell on that virtual experience."
            },
            {
              title: "Can I sell on my own virtual land in DCL?",
              description:
                "Yes. The Boson Metaverse Commerce Toolkit can be used across any virtual environment or land in DCL."
            }
          ]}
        />
      </Grid>
    </StyledDCLLayout>
  );
};
