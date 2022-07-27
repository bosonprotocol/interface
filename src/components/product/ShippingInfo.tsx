import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import { FormField, Input, Select } from "../form";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";
import { MOCK_OPTIONS } from "./utils";

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
  .FormField:first-of-type {
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
  return (
    <ContainerProductPage>
      <Typography tag="h2">Shipping Info</Typography>
      <RequiredContainer>
        <FormField
          title="Country of Origin"
          subTitle="The country you're dispatching from."
        >
          <Input placeholder="Country" name="shippingInfo.country" />
        </FormField>
        <FormField
          title="Supported Jurisdictions"
          subTitle="Select the jurisdictions you will ship to."
          tooltip="TODO: add"
        >
          <FieldContainerJurisdictions>
            <Input placeholder="Region" name="shippingInfo.region" />
            <Input placeholder="Time" name="shippingInfo.time" />
          </FieldContainerJurisdictions>
        </FormField>
      </RequiredContainer>
      <AdditionalContainer>
        <Collapse
          title={<Typography tag="h3">Additional information</Typography>}
        >
          <FormField
            title="Redemption point"
            subTitle="The website from which buyers can redeem the rNFT.
              By default the redemption point will be the Boson dApp."
            tooltip="TODO: add"
          >
            <Input placeholder="Add URL" name="shippingInfo.addUrl" />
          </FormField>
          <FormField
            title="Dimensions"
            subTitle="Specify the dimension and weight of your package"
          >
            <Input placeholder="L x W x H" name="shippingInfo.lwh" />
          </FormField>
          <FormField title="Weight">
            <FieldContainerWidth>
              <Input placeholder="Weight" name="shippingInfo.weight" />
              <Select name="shippingInfo.kg" options={MOCK_OPTIONS} />
            </FieldContainerWidth>
          </FormField>
          <FormField
            title="Unit of Measurement"
            subTitle="Which unit do you want to use for the following measurements?"
          >
            <Select name="shippingInfo.measurements" options={MOCK_OPTIONS} />
          </FormField>
          <FormField title="Height">
            <Input placeholder="Height" name="shippingInfo.height" />
          </FormField>
          <FormField title="Width">
            <Input placeholder="Width" name="shippingInfo.width" />
          </FormField>
          <FormField title="Length">
            <Input placeholder="Length" name="shippingInfo.length" />
          </FormField>
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
