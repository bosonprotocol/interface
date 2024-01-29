import { FormField, Input } from "components/form";
import { Select } from "components/form";
import BosonButton from "components/ui/BosonButton";
import Button from "components/ui/Button";
import { FieldArray } from "formik";
import { colors } from "lib/styles/colors";
import { useForm } from "lib/utils/hooks/useForm";
import { Plus, Trash } from "phosphor-react";
import React, { useEffect } from "react";
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
  ExistingBundleItems,
  isNftMintedAlreadyOptions,
  NewBundleItems
} from "./utils";

const ExistingNftContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 1rem;
  margin-bottom: 4rem;
  > * {
    flex: 1 1 30%;
    margin: initial;
  }
`;

const NewNftContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-items: start;
  grid-gap: 1rem;
  margin-bottom: 4rem;
  > * {
    margin: initial;
  }
`;

const Delete = styled(Trash)`
  cursor: pointer;
  align-self: center;
  justify-self: center;
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
  if ("contractAddress" in element) {
    return (
      !element?.contractAddress?.length ||
      element?.tokenIdRangeMin === undefined ||
      element?.tokenIdRangeMax === undefined
    );
  }
  return !element?.name?.length || !element?.description?.length;
};
const prefix = "productDigital.";
const getNewExistingBundleItem = () => {
  const bundleItem: Record<keyof ExistingBundleItems[number], undefined> = {
    contractAddress: undefined,
    tokenIdRangeMin: undefined,
    tokenIdRangeMax: undefined,
    externalUrl: undefined,
    shippingInDays: undefined,
    whenWillItBeSentToTheBuyer: undefined
  };
  return bundleItem;
};
const getNewNewBundleItem = () => {
  const bundleItem: Record<keyof NewBundleItems[number], undefined> = {
    name: undefined,
    description: undefined,
    howWillItBeSentToTheBuyer: undefined,
    whenWillItBeSentToTheBuyer: undefined,
    shippingInDays: undefined
  };
  return bundleItem;
};
export const ProductDigital: React.FC = () => {
  const { nextIsDisabled, values, setFieldValue } = useForm();
  const {
    bundleItems,
    isNftMintedAlready: { value: isNftMintedAlreadyValue } = {}
  } = values.productDigital;
  const isNftMintedAlready = isNftMintedAlreadyValue === "true";
  useEffect(() => {
    if (isNftMintedAlreadyValue) {
      if (isNftMintedAlreadyValue === "true") {
        setFieldValue("productDigital.bundleItems", [
          getNewExistingBundleItem()
        ]);
      } else if (isNftMintedAlreadyValue === "false") {
        setFieldValue("productDigital.bundleItems", [getNewNewBundleItem()]);
      }
    }
  }, [isNftMintedAlreadyValue, setFieldValue]);
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
                    {isNftMintedAlready
                      ? bundleItems.map((_el, index, array) => {
                          const arrayPrefix = `${prefix}bundleItems[${index}].`;
                          return (
                            <ExistingNftContainer
                              key={`nft_container_${index}`}
                            >
                              <FormField title="Contract address" required>
                                <Input
                                  placeholder="0x123...32f3"
                                  name={`${arrayPrefix}contractAddress`}
                                />
                              </FormField>
                              <FormField title="Min token ID" required>
                                <Input
                                  placeholder="1"
                                  name={`${arrayPrefix}tokenIdRangeMin`}
                                  type="number"
                                />
                              </FormField>
                              <FormField title="Max token ID" required>
                                <Input
                                  placeholder="999999"
                                  name={`${arrayPrefix}tokenIdRangeMax`}
                                  type="number"
                                />
                              </FormField>
                              <FormField title="External URL">
                                <Input
                                  placeholder="https://example.com"
                                  name={`${arrayPrefix}externalUrl`}
                                />
                              </FormField>
                              <FormField title="When will it be sent to the buyer?">
                                <Input
                                  placeholder=""
                                  name={`${arrayPrefix}whenWillItBeSentToTheBuyer`}
                                />
                              </FormField>
                              <FormField title="Shipping in days">
                                <Input
                                  placeholder=""
                                  name={`${arrayPrefix}shippingInDays`}
                                  type="number"
                                />
                              </FormField>
                              {array.length > 1 && (
                                <FormField title="Action">
                                  <Delete
                                    size={18}
                                    style={{
                                      gridColumn: "delete",
                                      gridRow: "delete"
                                    }}
                                    onClick={() => {
                                      arrayHelpers.remove(index);
                                    }}
                                  />
                                </FormField>
                              )}
                            </ExistingNftContainer>
                          );
                        })
                      : bundleItems.map((_el, index, array) => {
                          const arrayPrefix = `${prefix}bundleItems[${index}].`;
                          return (
                            <NewNftContainer key={`nft_container_${index}`}>
                              <FormField title="Name" required>
                                <Input
                                  placeholder=""
                                  name={`${arrayPrefix}name`}
                                />
                              </FormField>
                              <FormField title="Description" required>
                                <Input
                                  placeholder=""
                                  name={`${arrayPrefix}description`}
                                />
                              </FormField>
                              <FormField title="How will it be sent to the buyer?">
                                <Input
                                  placeholder=""
                                  name={`${arrayPrefix}whenWillItBeSentToTheBuyer`}
                                />
                              </FormField>
                              <FormField title="When will it be sent to the buyer?">
                                <Input
                                  placeholder=""
                                  name={`${arrayPrefix}whenWillItBeSentToTheBuyer`}
                                />
                              </FormField>
                              <FormField title="Shipping in days">
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
                            </NewNftContainer>
                          );
                        })}
                  </>
                )}

                {/* <Error
                  display={hasDuplicatedTokenIds}
                  message={"You can't have duplicate NFT IDs!"}
                /> */}
                {(!bundleItems.length ||
                  !checkLastElementIsPristine(bundleItems)) &&
                  isNftMintedAlreadyValue && (
                    <Button
                      onClick={() => {
                        if (isNftMintedAlready) {
                          arrayHelpers.push(getNewExistingBundleItem());
                        } else {
                          arrayHelpers.push(getNewNewBundleItem());
                        }
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
