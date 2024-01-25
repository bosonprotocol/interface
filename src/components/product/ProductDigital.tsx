import { FormField, Input } from "components/form";
import { Select } from "components/form";
import BosonButton from "components/ui/BosonButton";
import Button from "components/ui/Button";
import { FieldArray } from "formik";
import { colors } from "lib/styles/colors";
import { useForm } from "lib/utils/hooks/useForm";
import { Plus, Trash } from "phosphor-react";
import React from "react";
import { styled } from "styled-components";

import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import {
  type ProductDigital as ProductDigitalType,
  DIGITAL_NFT_TYPE,
  DIGITAL_TYPE,
  isNftMintedAlreadyOptions
} from "./utils";

const NftsContainer = styled.div`
  display: grid;
  grid-template-areas:
    "contract minId maxId delete"
    "url when shipping delete";
  align-items: start;
  grid-gap: 1rem;
  margin-bottom: 1rem;
`;

const Delete = styled(Trash)`
  cursor: pointer;
  align-self: center;
  grid-column: delete;
  grid-row: delete;
  border: 3px solid ${colors.border};
  padding: 0.5rem;
  border-radius: 50%;
  box-sizing: content-box;
  &:hover {
    background-color: ${colors.lightGrey};
  }
`;
const checkLastElementIsPristine = (
  elements: ProductDigitalType["productDigital"]["bundleItems"]
): boolean => {
  const element = elements[elements.length - 1];
  return (
    // TODO: check if these are the required fields
    !element?.contractAddress?.length ||
    element?.tokenIdRangeMin === undefined ||
    element?.tokenIdRangeMax === undefined ||
    !element?.externalUrl?.length ||
    element?.shippingInDays === undefined
  );
};
const prefix = "productDigital.";
export const ProductDigital: React.FC = () => {
  const { nextIsDisabled, values } = useForm();
  const { bundleItems } = values.productDigital;
  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Digital & Experiential Items</SectionTitle>
      <div>
        <FormField
          title="Choose the digital or experiential type in your bundle"
          required
          subTitle="Items can be a digital NFT, a digital file, or an experiential offering."
        >
          <Select
            placeholder="Choose one..."
            name={`${prefix}type`}
            options={DIGITAL_TYPE}
            isClearable
            errorMessage="Please select the type that best matches your product."
          />
        </FormField>
        <FormField title="NFT Type" required subTitle="Describe the type.">
          <Select
            placeholder="Choose one..."
            name={`${prefix}nftType`}
            options={DIGITAL_NFT_TYPE}
            isClearable
            errorMessage="Please select the NFT type that best matches your product."
          />
        </FormField>
        <FormField title="Is the NFT minted already?" required>
          <Select
            placeholder="Choose one..."
            name={`${prefix}isNftMintedAlready`}
            options={isNftMintedAlreadyOptions}
            isClearable
            errorMessage="Please select an option."
          />
        </FormField>
        <FieldArray
          name={`${prefix}bundleItems`}
          render={(arrayHelpers) => {
            const render = bundleItems && bundleItems.length > 0;
            return (
              <>
                {render && (
                  <>
                    {bundleItems.map((_el, index, array) => {
                      const arrayPrefix = `${prefix}bundleItems[${index}].`;

                      return (
                        <NftsContainer key={`nft_container_${index}`}>
                          <FormField
                            title="Contract address"
                            required
                            style={{
                              gridColumn: "contract"
                            }}
                          >
                            <Input
                              placeholder="0x123...32f3"
                              name={`${arrayPrefix}contractAddress`}
                            />
                          </FormField>
                          <FormField
                            title="Min token ID"
                            style={{
                              gridColumn: "minId"
                            }}
                          >
                            <Input
                              placeholder="1"
                              name={`${arrayPrefix}tokenIdRangeMin`}
                              type="number"
                            />
                          </FormField>
                          <FormField
                            title="Max token ID"
                            style={{
                              gridColumn: "maxId"
                            }}
                          >
                            <Input
                              placeholder="999999"
                              name={`${arrayPrefix}tokenIdRangeMax`}
                              type="number"
                            />
                          </FormField>
                          <FormField
                            title="External URL"
                            style={{
                              gridColumn: "url"
                            }}
                          >
                            <Input
                              placeholder="https://example.com"
                              name={`${arrayPrefix}externalUrl`}
                            />
                          </FormField>
                          <FormField
                            title="When will it be sent to the buyer?"
                            style={{
                              gridColumn: "when"
                            }}
                          >
                            <Input
                              placeholder=""
                              name={`${arrayPrefix}whenWillItBeSentToTheBuyer`}
                            />
                          </FormField>
                          <FormField
                            title="Shipping in days"
                            style={{
                              gridColumn: "shipping"
                            }}
                          >
                            <Input
                              placeholder=""
                              name={`${arrayPrefix}shippingInDays`}
                              type="number"
                            />
                          </FormField>
                          {array.length > 1 && (
                            <Delete
                              size={18}
                              onClick={() => {
                                arrayHelpers.remove(index);
                              }}
                            />
                          )}
                        </NftsContainer>
                      );
                    })}
                  </>
                )}

                {/* <Error
                  display={hasDuplicatedTokenIds}
                  message={"You can't have duplicate NFT IDs!"}
                /> */}
                {(!bundleItems.length ||
                  !checkLastElementIsPristine(bundleItems)) && (
                  <Button
                    onClick={() => {
                      const bundleItem: Record<
                        keyof ProductDigitalType["productDigital"]["bundleItems"][number],
                        undefined
                      > = {
                        contractAddress: undefined,
                        tokenIdRangeMin: undefined,
                        tokenIdRangeMax: undefined,
                        externalUrl: undefined,
                        shippingInDays: undefined,
                        whenWillItBeSentToTheBuyer: undefined
                      };
                      arrayHelpers.push(bundleItem);
                    }}
                    themeVal="blankSecondary"
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                  >
                    Add new <Plus size={18} />
                  </Button>
                )}
              </>
            );
          }}
        />
        <ProductButtonGroup>
          <BosonButton
            variant="primaryFill"
            type="submit"
            disabled={nextIsDisabled}
          >
            Next
          </BosonButton>
        </ProductButtonGroup>
      </div>
    </ContainerProductPage>
  );
};
