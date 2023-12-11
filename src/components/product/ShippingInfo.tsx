/* eslint-disable @typescript-eslint/no-explicit-any */
import { arrayMoveImmutable } from "array-move";
import { FieldArray } from "formik";
import { Plus, X } from "phosphor-react";
import { useMemo } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import { colors } from "../../lib/styles/colors";
import { useForm } from "../../lib/utils/hooks/useForm";
import { FormField, Input, Select } from "../form";
import BosonButton from "../ui/BosonButton";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import {
  OPTIONS_LENGTH,
  OPTIONS_PERIOD,
  OPTIONS_WEIGHT,
  ShippingInfo as ShippingInfoType
} from "./utils";

const FieldContainerJurisdictions = styled.div`
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 3fr min-content;
  align-items: start;
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

const checkLastElementIsPristine = (
  elements: ShippingInfoType["shippingInfo"]["jurisdiction"]
): boolean => {
  const element = elements[elements.length - 1];
  return element?.region?.length === 0 || element?.time?.length === 0;
};

const AddSupportedJurisdictions = () => {
  const { values, setFieldValue, setFieldTouched, handleBlur } = useForm();

  const jurisdictions = useMemo(
    () => values?.shippingInfo?.jurisdiction,
    [values?.shippingInfo?.jurisdiction]
  );
  const onSortEnd = (oldIndex: number, newIndex: number) => {
    if (!jurisdictions) {
      return;
    }
    setFieldValue(
      "shippingInfo.jurisdiction",
      arrayMoveImmutable(jurisdictions, oldIndex, newIndex)
    );
  };
  return (
    <FormField
      title="Supported jurisdictions"
      subTitle="Select the jurisdictions you will ship to."
    >
      <SortableList onSortEnd={onSortEnd} draggedItemClassName="dragged">
        <FieldArray
          name="shippingInfo.jurisdiction"
          render={(arrayHelpers) => {
            const render = jurisdictions && jurisdictions.length > 0;

            return (
              <>
                {render && (
                  <>
                    {jurisdictions.map((_, index, array) => (
                      <SortableItem
                        key={`field_container_jurisdictions_${index}`}
                      >
                        <FieldContainerJurisdictions>
                          <div>
                            <Input
                              placeholder="Region"
                              name={`shippingInfo.jurisdiction[${index}].region`}
                              onBlur={(e) => {
                                handleBlur(e);
                                setFieldTouched(
                                  `shippingInfo.jurisdiction[${index}].time`,
                                  true
                                );
                              }}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Time"
                              name={`shippingInfo.jurisdiction[${index}].time`}
                              onBlur={(e) => {
                                handleBlur(e);
                                setFieldTouched(
                                  `shippingInfo.jurisdiction[${index}].region`,
                                  true
                                );
                              }}
                            />
                          </div>
                          {array.length > 1 && (
                            <div style={{ alignSelf: "center" }}>
                              <X
                                size={14}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                }}
                              />
                            </div>
                          )}
                        </FieldContainerJurisdictions>
                      </SortableItem>
                    ))}
                  </>
                )}
                {!checkLastElementIsPristine(jurisdictions) && (
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
      </SortableList>
    </FormField>
  );
};

export default function ShippingInfo() {
  const { values, nextIsDisabled } = useForm();

  const unit = useMemo(
    () => (values?.shippingInfo?.measurementUnit?.value || "").toUpperCase(),
    [values?.shippingInfo?.measurementUnit?.value]
  );

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
  const hasAdditionalInformation =
    !!values?.shippingInfo.weight ||
    !!values?.shippingInfo.height ||
    !!values?.shippingInfo.width ||
    !!values?.shippingInfo.length;
  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Shipping Info</SectionTitle>
      <RequiredContainer>
        {/* NOTE: we might add it back in the future */}
        {/* <FormField
          title="Country of Origin"
          subTitle="The country you're dispatching from."
        >
          <Select
            placeholder="Country"
            name="shippingInfo.country"
            options={OPTIONS_COUNTRIES}
          />
        </FormField> */}
        <AddSupportedJurisdictions />
        <FormField
          title="Return period"
          subTitle="The period within which the buyer must contact the seller for a return after the item has been delivered."
        >
          <FieldContainer>
            <div>
              <Input
                placeholder="Return period"
                name="shippingInfo.returnPeriod"
                type="number"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Select
                placeholder="Choose return period Unit..."
                name="shippingInfo.returnPeriodUnit"
                options={OPTIONS_PERIOD}
              />
            </div>
          </FieldContainer>
        </FormField>
        <FormField
          title="Redemption point"
          subTitle="The default redemption point is the Boson app. You can add a specific website from which buyers can redeem the rNFT, for example, your customised Web3 storefront."
        >
          {/* <FieldContainer>
             TODO: not used for now, might come back <div>
              <Input
                placeholder="Add Redemption Point Name..."
                name="shippingInfo.redemptionPointName"
              />
            </div> 
            <div>*/}
          <Input
            placeholder="Add Redemption Point Url..."
            name="shippingInfo.redemptionPointUrl"
          />
          {/* </div> 
          </FieldContainer>*/}
        </FormField>
      </RequiredContainer>
      <AdditionalContainer>
        <Collapse
          title={<Typography tag="h3">Additional information</Typography>}
          isInitiallyOpen={hasAdditionalInformation}
        >
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
              step="0.001"
            />
          </FormField>
          <FormField title="Width">
            <Input
              placeholder={`Width in ${unit}`}
              name="shippingInfo.width"
              type="number"
              min="0"
              step="0.001"
            />
          </FormField>
          <FormField title="Length">
            <Input
              placeholder={`Length in ${unit}`}
              name="shippingInfo.length"
              type="number"
              min="0"
              step="0.001"
            />
          </FormField>
        </Collapse>
      </AdditionalContainer>
      <ProductInformationButtonGroup>
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={nextIsDisabled}
        >
          Next
        </BosonButton>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
