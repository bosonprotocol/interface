import { Plus } from "phosphor-react";
import { useMemo, useState } from "react";
import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import { colors } from "../../lib/styles/colors";
import { FormField, Input, Select } from "../form";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import { OPTIONS_COUNTRIES, OPTIONS_LENGTH, OPTIONS_WEIGHT } from "./utils";
import { useThisForm } from "./utils/useThisForm";

const FieldContainerJurisdictions = styled.div`
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 3fr;
  grid-gap: 1rem;
  margin-bottom: 1rem;
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

const AddSupportedJurisdictions = () => {
  const [count, setCount] = useState<number>(1);
  const jurisdictions = useMemo(() => Array.from(Array(count).keys()), [count]);

  const addNewJurisdiction = () => {
    setCount(count + 1);
  };

  return (
    <FormField
      title="Supported Jurisdictions"
      subTitle="Select the jurisdictions you will ship to."
      tooltip="TODO: add"
    >
      {jurisdictions.map((e: number, key: number) => (
        <FieldContainerJurisdictions
          key={`field_container_jurisdictions_${key}`}
        >
          <div>
            <Input
              placeholder="Region"
              name={`shippingInfo.region${key === 0 ? "" : `${key + 1}`}`}
            />
          </div>
          <div>
            <Input
              placeholder="Time"
              name={`shippingInfo.time${key === 0 ? "" : `${key + 1}`}`}
            />
          </div>
        </FieldContainerJurisdictions>
      ))}
      <Button
        onClick={addNewJurisdiction}
        theme="blankSecondary"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        Add new <Plus size={18} />
      </Button>
    </FormField>
  );
};

export default function ShippingInfo() {
  const { values } = useThisForm();

  const unit = useMemo(
    () => (values?.shippingInfo?.measurementUnit?.value || "").toUpperCase(),
    [values?.shippingInfo?.measurementUnit?.value]
  );

  const lwh = useMemo(
    () =>
      `${values?.shippingInfo?.height || 0}x${
        values?.shippingInfo?.width || 0
      }x${values?.shippingInfo?.length || 0}`,
    [
      values?.shippingInfo?.height,
      values?.shippingInfo?.width,
      values?.shippingInfo?.length
    ]
  );

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Shipping Info</SectionTitle>
      <RequiredContainer>
        <FormField
          title="Country of Origin"
          subTitle="The country you're dispatching from."
        >
          <Select
            placeholder="Country"
            name="shippingInfo.country"
            options={OPTIONS_COUNTRIES}
          />
        </FormField>
        <AddSupportedJurisdictions />
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
            title={`Dimensions in ${unit}`}
            subTitle="Specify the dimension and weight of your package"
          >
            <Input
              placeholder={`L x W x H in ${unit}`}
              name="shippingInfo.dimensions"
              value={lwh}
              disabled
            />
          </FormField>
          <FormField title="Weight">
            <FieldContainerWidth>
              <Input placeholder="Weight" name="shippingInfo.weight" />
              <Select name="shippingInfo.weightUnit" options={OPTIONS_WEIGHT} />
            </FieldContainerWidth>
          </FormField>
          <FormField
            title="Unit of Measurement"
            subTitle="Which unit do you want to use for the following measurements?"
          >
            <Select
              name="shippingInfo.measurementUnit"
              options={OPTIONS_LENGTH}
            />
          </FormField>
          <FormField title="Height">
            <Input
              placeholder={`Height in ${unit}`}
              name="shippingInfo.height"
            />
          </FormField>
          <FormField title="Width">
            <Input placeholder={`Width in ${unit}`} name="shippingInfo.width" />
          </FormField>
          <FormField title="Length">
            <Input
              placeholder={`Length in ${unit}`}
              name="shippingInfo.length"
            />
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
