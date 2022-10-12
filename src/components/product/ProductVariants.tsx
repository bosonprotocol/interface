/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldArray } from "formik";
import { Plus } from "phosphor-react";
import { useEffect, useMemo } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { FormField, Input } from "../form";
import Error from "../form/Error";
import TagsInput from "../form/TagsInput";
import Button from "../ui/Button";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import { useCreateForm } from "./utils/useCreateForm";

const AddProductContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(11.25rem, 1fr) 3fr;
  grid-gap: 1rem;
  margin-bottom: 1rem;
`;

const AdditionalContainer = styled.div`
  margin-top: 1rem;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563rem;
`;

const checkLastElementIsPristine = (elements: ElementType[]): boolean => {
  const element = elements[elements.length - 1];
  return element?.name.length === 0 || element?.value.length === 0;
};

const checkIfElementIsDuplicated = (elements: ElementType[]): boolean => {
  const listElements = elements.map((element) => {
    return `${element.name}_${element.value}`.toLowerCase();
  });
  return new Set(listElements).size !== listElements.length;
};

interface ElementType {
  name: string;
  value: string;
}

const AddAttributesContainer = ({
  setHasDuplicated,
  hasDuplicated
}: {
  setHasDuplicated: (hadDuplicated: boolean) => void;
  hasDuplicated: boolean;
}) => {
  const { values } = useCreateForm();

  const elements: ElementType[] = useMemo(
    () => values?.productInformation?.attributes,
    [values?.productInformation?.attributes]
  );

  useEffect(() => {
    setHasDuplicated(checkIfElementIsDuplicated(elements));
  }, [elements, setHasDuplicated]);

  return (
    <FormField
      title="Add product attribute"
      tooltip='Provide additional data about your product (e.g. materials; "Cotton": "60%")'
    >
      <FieldArray
        name="productInformation.attributes"
        render={(arrayHelpers) => {
          const render = elements && elements.length > 0;
          return (
            <>
              {render && (
                <>
                  {elements.map((_el: ElementType, key: number) => (
                    <AddProductContainer key={`add_product_container_${key}`}>
                      <div>
                        <Input
                          placeholder="Attribute"
                          name={`productInformation.attributes[${key}].name`}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Attribute Value"
                          name={`productInformation.attributes[${key}].value`}
                        />
                      </div>
                    </AddProductContainer>
                  ))}
                </>
              )}

              <Error
                display={hasDuplicated}
                message={"You can’t have duplicate attributes!"}
              />
              {!checkLastElementIsPristine(elements) && (
                <Button
                  onClick={() => arrayHelpers.push({ name: "", value: "" })}
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

export default function ProductVariants() {
  const { nextIsDisabled } = useCreateForm();

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Product Variants</SectionTitle>
      <FormField title="Create new variants" required subTitle="Lorem ipsum">
        <>
          <TagsInput
            placeholder={"Add color variants"}
            name="productVariants.colors"
          />
          <TagsInput
            placeholder={"Add size variants"}
            name="productVariants.size"
          />
        </>
      </FormField>
      <SectionTitle tag="h2">Define Variants</SectionTitle>
      <SectionTitle tag="p">
        The table below shows each possible variant combination given the inputs
        above. You can remove a combination by selecting the rightmost button on
        the relevant row.
      </SectionTitle>
      <ProductInformationButtonGroup>
        <Button theme="primary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
