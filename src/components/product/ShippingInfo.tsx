import { useFormikContext } from "formik";
import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import Field, { FieldType } from "../form/Field";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";
import type { CreateProductForm } from "./validation/createProductValidationSchema";

const FieldContainerJurisdictions = styled.div`
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 3fr;
  grid-gap: 1rem;
`;

const FieldContainerWidth = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(140px, 1fr);
  grid-gap: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563rem;
`;

const RequiredContainer = styled.div`
  .inputGroup:first-of-type {
    margin-bottom: 3.5rem;
  }
`;

const AdditionalContainer = styled.div`
  margin-top: 3.5rem;
  h3 {
    margin-top: 0;
    margin-bottom: 2rem;
  }
`;

export default function ShippingInfo() {
  const { handleChange, values, errors } =
    useFormikContext<CreateProductForm>();
  return (
    <ContainerProductPage>
      <Typography tag="h2">Shipping Info</Typography>
      <RequiredContainer>
        <InputGroup
          title="Country of Origin"
          subTitle="The country you're dispatching from."
        >
          <Field
            fieldType={FieldType.Input}
            placeholder="Click to select"
            name=""
            value=""
            onChange={handleChange}
            error=""
          />
        </InputGroup>
        <InputGroup
          title="Supported Jurisdictions"
          subTitle="Select the jurisdictions you will ship to."
          popper="Need to be added"
        >
          <FieldContainerJurisdictions>
            <Field
              fieldType={FieldType.Input}
              placeholder="10"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
            <Field
              fieldType={FieldType.Input}
              placeholder="Percent"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </FieldContainerJurisdictions>
        </InputGroup>
      </RequiredContainer>
      <AdditionalContainer>
        <Collapse
          title={<Typography tag="h3">Additional information</Typography>}
        >
          <InputGroup
            title="Redemption point"
            subTitle="The website from which buyers can redeem the rNFT.
              By default the redemption point will be the Boson dApp."
            popper="Need to be added"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="Add URL"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
          <InputGroup
            title="Dimensions"
            subTitle="Specify the dimension and weight of your package"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="L x W x H"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
          <InputGroup title="Weight">
            <FieldContainerWidth>
              <Field
                fieldType={FieldType.Input}
                placeholder="Weight"
                name=""
                value=""
                onChange={handleChange}
                error=""
              />
              <Field
                fieldType={FieldType.Input}
                placeholder="KG"
                name=""
                value=""
                onChange={handleChange}
                error=""
              />
            </FieldContainerWidth>
          </InputGroup>
          <InputGroup
            title="Unit of Measurement"
            subTitle="Which unit do you want to use for the following measurements?"
          >
            <Field
              fieldType={FieldType.Input}
              placeholder="Centimeter"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
          <InputGroup title="Height">
            <Field
              fieldType={FieldType.Input}
              placeholder="Height in CM"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
          <InputGroup title="Width">
            <Field
              fieldType={FieldType.Input}
              placeholder="Width in CM"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
          <InputGroup title="Length">
            <Field
              fieldType={FieldType.Input}
              placeholder="Length in CM"
              name=""
              value=""
              onChange={handleChange}
              error=""
            />
          </InputGroup>
        </Collapse>
      </AdditionalContainer>
      <ProductInformationButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
