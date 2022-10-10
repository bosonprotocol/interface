/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button as ReactKitButton } from "@bosonprotocol/react-kit";
import { FieldArray } from "formik";
import { Plus } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
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
import {
  OPTIONS_COUNTRIES,
  OPTIONS_LENGTH,
  OPTIONS_PERIOD,
  OPTIONS_WEIGHT
} from "./utils";
import { useCreateForm } from "./utils/useCreateForm";

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

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr minmax(8.75rem, 1fr);
  grid-gap: 1rem;
`;

const AdditionalContainer = styled.div`
  margin-top: 3.5rem;
  h3 {
    margin-top: 0;
    margin-bottom: 2rem;
  }
`;

const checkLastElementIsPristine = (elements: any): boolean => {
  const element = elements[elements.length - 1];
  return element?.region.length === 0 || element?.time.length === 0;
};

const AddSupportedJurisdictions = () => {
  const { values } = useCreateForm();

  const elements = useMemo(
    () => values?.shippingInfo?.jurisdiction,
    [values?.shippingInfo?.jurisdiction]
  );

  return (
    <FormField
      title="Supported Jurisdictions"
      subTitle="Select the jurisdictions you will ship to."
    >
      <FieldArray
        name="shippingInfo.jurisdiction"
        render={(arrayHelpers) => {
          const render = elements && elements.length > 0;

          return (
            <>
              {render && (
                <>
                  {elements.map((el: unknown, key: number) => (
                    <FieldContainerJurisdictions
                      key={`field_container_jurisdictions_${key}`}
                    >
                      <div>
                        <Input
                          placeholder="Region"
                          name={`shippingInfo.jurisdiction[${key}].region`}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Time"
                          name={`shippingInfo.jurisdiction[${key}].time`}
                        />
                      </div>
                    </FieldContainerJurisdictions>
                  ))}
                </>
              )}
              {!checkLastElementIsPristine(elements) && (
                <Button
                  onClick={() => arrayHelpers.push({ region: "", time: "" })}
                  theme="blankSecondary"
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  Add new <Plus size={18} />
                </Button>
              )}
            </>
          );
        }}
      />
    </FormField>
  );
};

const validJurisdiction = (
  jurisdictionElements: Array<{
    region: string;
    time: string;
  }>
): boolean => {
  const validation = jurisdictionElements.some(({ time, region }) => {
    return (
      (region.length === 0 && time.length > 0) ||
      (time.length === 0 && region.length > 0)
    );
  });
  return !validation;
};

export default function ShippingInfo() {
  const { values, nextIsDisabled } = useCreateForm();
  const [isValidJurisdiction, setIsValidJurisdiction] = useState<boolean>(true);

  const unit = useMemo(
    () => (values?.shippingInfo?.measurementUnit?.value || "").toUpperCase(),
    [values?.shippingInfo?.measurementUnit?.value]
  );

  const jurisdictionElements = useMemo(
    () => values?.shippingInfo?.jurisdiction,
    [values?.shippingInfo?.jurisdiction]
  );

  useEffect(() => {
    const isValid = validJurisdiction(jurisdictionElements);
    setIsValidJurisdiction(isValid);
  }, [jurisdictionElements]);

  const lwh = useMemo(
    () =>
      `${values?.shippingInfo?.length || 0}${
        values?.shippingInfo?.measurementUnit?.value
      } x ${values?.shippingInfo?.width || 0}${
        values?.shippingInfo?.measurementUnit?.value
      } x ${values?.shippingInfo?.height || 0}${
        values?.shippingInfo?.measurementUnit?.value
      }`,
    [values?.shippingInfo]
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
        <FormField
          title="Return Period"
          subTitle="The period the Buyer must contact the Seller for a return after being delivered."
        >
          <FieldContainer>
            <div>
              <Input
                placeholder="Return Period"
                name="shippingInfo.returnPeriod"
                type="number"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Select
                placeholder="Choose Return Period Unit..."
                name="shippingInfo.returnPeriodUnit"
                options={OPTIONS_PERIOD}
              />
            </div>
          </FieldContainer>
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
          >
            <Input placeholder="Add URL" name="shippingInfo.addUrl" />
          </FormField>
          <FormField
            title={`Dimensions L x W x H in ${unit}`}
            subTitle="Specify the dimension and weight of your package"
          >
            <Input
              placeholder={`L${unit} x W${unit} x H${unit}`}
              name="shippingInfo.dimensions"
              value={lwh}
              disabled
            />
          </FormField>
          <FormField title="Weight">
            <FieldContainerWidth>
              <Input
                placeholder="Weight"
                name="shippingInfo.weight"
                type="number"
                min="0"
                step="0.001"
              />
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
              type="number"
              min="0"
              defaultValue={0}
              step="0.001"
            />
          </FormField>
          <FormField title="Width">
            <Input
              placeholder={`Width in ${unit}`}
              name="shippingInfo.width"
              type="number"
              min="0"
              defaultValue={0}
              step="0.001"
            />
          </FormField>
          <FormField title="Length">
            <Input
              placeholder={`Length in ${unit}`}
              name="shippingInfo.length"
              type="number"
              min="0"
              defaultValue={0}
              step="0.001"
            />
          </FormField>
        </Collapse>
      </AdditionalContainer>
      <ProductInformationButtonGroup>
        <ReactKitButton
          variant="primaryFill"
          type="submit"
          disabled={nextIsDisabled || !isValidJurisdiction}
        >
          Next
        </ReactKitButton>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
