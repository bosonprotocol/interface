import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import { Input, Select } from "../form";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";

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
  return (
    <ContainerProductPage>
      <Typography tag="h2">Shipping Info</Typography>
      <RequiredContainer>
        <InputGroup
          title="Country of Origin"
          subTitle="The country you're dispatching from."
        >
          <Input placeholder="Country" name="shippingInfo.country" />
        </InputGroup>
        <InputGroup
          title="Supported Jurisdictions"
          subTitle="Select the jurisdictions you will ship to."
          popper="Need to be added"
        >
          <FieldContainerJurisdictions>
            <Input placeholder="Region" name="shippingInfo.region" />
            <Input placeholder="Time" name="shippingInfo.time" />
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
            <Input placeholder="Add URL" name="shippingInfo.addUrl" />
          </InputGroup>
          <InputGroup
            title="Dimensions"
            subTitle="Specify the dimension and weight of your package"
          >
            <Input placeholder="L x W x H" name="shippingInfo.lwh" />
          </InputGroup>
          <InputGroup title="Weight">
            <FieldContainerWidth>
              <Input placeholder="Weight" name="shippingInfo.weight" />
              {/* // TODO: add weight */}
              <Select
                name="shippingInfo.kg"
                options={[{ value: "0", label: "0" }]}
              />
            </FieldContainerWidth>
          </InputGroup>
          <InputGroup
            title="Unit of Measurement"
            subTitle="Which unit do you want to use for the following measurements?"
          >
            {/* // TODO: add measurements */}
            <Select
              name="shippingInfo.measurements"
              options={[{ value: "0", label: "0" }]}
            />
          </InputGroup>
          <InputGroup title="Height">
            <Input placeholder="Height" name="shippingInfo.height" />
          </InputGroup>
          <InputGroup title="Width">
            <Input placeholder="Width" name="shippingInfo.width" />
          </InputGroup>
          <InputGroup title="Length">
            <Input placeholder="Length" name="shippingInfo.length" />
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
