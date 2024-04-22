import { digitalTypeMapping } from "@bosonprotocol/react-kit";
import SimpleError from "components/error/SimpleError";
import { FormField } from "components/form";
import { Select } from "components/form";
import BosonButton from "components/ui/BosonButton";
import Button from "components/ui/Button";
import { FieldArray } from "formik";
import { colors } from "lib/styles/colors";
import { useForm } from "lib/utils/hooks/useForm";
import { Plus } from "phosphor-react";
import React, { useEffect } from "react";

import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "../Product.styles";
import {
  BUYER_TRANSFER_INFO_OPTIONS,
  BuyerTransferInfo,
  DIGITAL_NFT_TYPE,
  DIGITAL_TYPE,
  DigitalFileBundleItemsType,
  ExperientialBundleItemsType,
  isNftMintedAlreadyOptions,
  MintedNftBundleItemsType,
  NewNftBundleItemsType,
  type ProductDigital as ProductDigitalType
} from "../utils";
import { DigitalFileBundleItems } from "./DigitalFileBundleItems";
import { ExperientialBundleItems } from "./ExperientialBundleItems";
import {
  DigitalFile,
  ExistingNFT,
  Experiential,
  getIsBundleItem,
  NewNFT
} from "./getIsBundleItem";
import { MintedNftBundleItems } from "./MintedNftBundleItems";
import { NewNftBundleItems } from "./NewNftBundleItems";

const checkLastElementIsPristine = (
  elements: ProductDigitalType["productDigital"]["bundleItems"]
): boolean => {
  const element = elements[elements.length - 1];
  if (getIsBundleItem<ExistingNFT>(element, "mintedNftContractAddress")) {
    return (
      !element?.mintedNftContractAddress?.length ||
      element?.mintedNftTokenIdRangeMin === undefined ||
      element?.mintedNftTokenIdRangeMax === undefined
    );
  }
  if (getIsBundleItem<NewNFT>(element, "newNftName")) {
    return !element?.newNftName?.length || !element?.newNftDescription?.length;
  }
  if (getIsBundleItem<DigitalFile>(element, "digitalFileName")) {
    return (
      !element?.digitalFileName?.length ||
      !element?.digitalFileDescription?.length ||
      !element?.digitalFileFormat?.length
    );
  }
  return (
    !element?.experientialName?.length ||
    !element?.experientialDescription?.length
  );
};
const prefix = "productDigital.";
const getNewExistingBundleItem = () => {
  const bundleItem: Record<
    keyof MintedNftBundleItemsType[number],
    string | null | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
  > = {
    mintedNftTokenType: null,
    mintedNftContractAddress: "",
    mintedNftTokenIdRangeMin: "",
    mintedNftTokenIdRangeMax: "",
    mintedNftExternalUrl: "",
    mintedNftShippingInDays: "",
    mintedNftWhenWillItBeSentToTheBuyer: "",
    mintedNftBuyerTransferInfo:
      BUYER_TRANSFER_INFO_OPTIONS.find(
        (option) => option.value === BuyerTransferInfo.walletAddress
      ) || null
  };
  return bundleItem;
};
const getNewNewBundleItem = () => {
  const bundleItem: Record<
    keyof NewNftBundleItemsType[number],
    string | null | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
  > = {
    newNftName: "",
    newNftDescription: "",
    newNftHowWillItBeSentToTheBuyer: "",
    newNftWhenWillItBeSentToTheBuyer: "",
    newNftShippingInDays: "",
    newNftBuyerTransferInfo:
      BUYER_TRANSFER_INFO_OPTIONS.find(
        (option) => option.value === BuyerTransferInfo.walletAddress
      ) || null
  };
  return bundleItem;
};
const getNewDigitalFileBundleItem = () => {
  const bundleItem: Record<
    keyof DigitalFileBundleItemsType[number],
    string | null | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
  > = {
    digitalFileName: "",
    digitalFileDescription: "",
    digitalFileFormat: "",
    digitalFileHowWillItBeSentToTheBuyer: "",
    digitalFileWhenWillItBeSentToTheBuyer: "",
    digitalFileShippingInDays: "",
    digitalFileBuyerTransferInfo:
      BUYER_TRANSFER_INFO_OPTIONS.find(
        (option) => option.value === BuyerTransferInfo.email
      ) || null
  };
  return bundleItem;
};
const getNewExperientialBundleItem = () => {
  const bundleItem: Record<
    keyof ExperientialBundleItemsType[number],
    string | null | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
  > = {
    experientialName: "",
    experientialDescription: "",
    experientialHowWillTheBuyerReceiveIt: "",
    experientialWhenWillItBeSentToTheBuyer: "",
    experientialShippingInDays: "",
    experientialBuyerTransferInfo: null // both options are fine so nothing preselected
  };
  return bundleItem;
};
export const ProductDigital: React.FC = () => {
  const { nextIsDisabled, values, setFieldValue, errors } = useForm();
  const { bundleItems } = values.productDigital || {};
  const type = (values.productDigital?.type || {}).value;
  const isNftMintedAlreadyValue = (
    values.productDigital.isNftMintedAlready || {}
  ).value;
  const isNftMintedAlready = isNftMintedAlreadyValue === "true";
  const isBundleItemMintedAlready =
    !!bundleItems?.[0] &&
    getIsBundleItem<ExistingNFT>(bundleItems[0], "mintedNftContractAddress");
  const isBundleItemNotMintedAlready =
    !!bundleItems?.[0] && getIsBundleItem<NewNFT>(bundleItems[0], "newNftName");
  const isBundleItemADigitalFileAlready =
    !!bundleItems?.[0] &&
    getIsBundleItem<DigitalFile>(bundleItems[0], "digitalFileName");
  const isBundleItemAExperientialAlready =
    !!bundleItems?.[0] &&
    getIsBundleItem<Experiential>(bundleItems[0], "experientialName");
  useEffect(() => {
    if (type === digitalTypeMapping["digital-nft"]) {
      if (isNftMintedAlreadyValue) {
        if (isNftMintedAlreadyValue === "true" && !isBundleItemMintedAlready) {
          setFieldValue("productDigital.bundleItems", [
            getNewExistingBundleItem()
          ]);
        } else if (
          isNftMintedAlreadyValue === "false" &&
          !isBundleItemNotMintedAlready
        ) {
          setFieldValue("productDigital.bundleItems", [getNewNewBundleItem()]);
        }
      }
    } else if (type === digitalTypeMapping["digital-file"]) {
      if (!isBundleItemADigitalFileAlready) {
        setFieldValue("productDigital.bundleItems", [
          getNewDigitalFileBundleItem()
        ]);
      }
    } else if (type === digitalTypeMapping["experiential"]) {
      if (!isBundleItemAExperientialAlready) {
        setFieldValue("productDigital.bundleItems", [
          getNewExperientialBundleItem()
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, setFieldValue, isNftMintedAlreadyValue]);
  const bundleItemsError: JSX.Element | null =
    errors.productDigital?.bundleItems &&
    typeof errors.productDigital.bundleItems === "string" &&
    errors.productDigital.bundleItems ? (
      <SimpleError style={{ color: colors.red, fontWeight: 600 }}>
        {errors.productDigital.bundleItems}
      </SimpleError>
    ) : null;

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Digital & Experiential Items</SectionTitle>
      <div>
        <FormField
          title="Choose the digital or experiential items in your bundle"
          required
          subTitle="Items can be an NFT, a digital file, or an experiential offering."
        >
          <Select
            placeholder="Choose one..."
            name={`${prefix}type`}
            options={DIGITAL_TYPE}
            isClearable
            errorMessage="Please select the type that best matches your product."
          />
        </FormField>
        {type === digitalTypeMapping["digital-nft"] && (
          <>
            <FormField
              title="NFT Type"
              required
              subTitle="Provide buyers more information about your NFT's traits"
            >
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
          </>
        )}
        <FieldArray
          name={`${prefix}bundleItems`}
          render={(arrayHelpers) => {
            const render = bundleItems && bundleItems.length > 0;
            return (
              <>
                {render && (
                  <>
                    {bundleItems.map((bundleItem, index, array) => {
                      const arrayPrefix = `${prefix}bundleItems[${index}].`;
                      const showDeleteButton = array.length > 1;
                      if (!bundleItem) {
                        return null;
                      }
                      if (type === digitalTypeMapping["digital-nft"]) {
                        if (isNftMintedAlready) {
                          return (
                            <MintedNftBundleItems
                              key={`minted_nft_container_${index}`}
                              prefix={arrayPrefix}
                              showDeleteButton={showDeleteButton}
                              bundleItemsError={bundleItemsError}
                              bundleItem={bundleItem as ExistingNFT}
                              onClickDelete={() => {
                                arrayHelpers.remove(index);
                              }}
                            />
                          );
                        } else {
                          return (
                            <NewNftBundleItems
                              key={`new_nft_container_${index}`}
                              prefix={arrayPrefix}
                              showDeleteButton={showDeleteButton}
                              bundleItemsError={bundleItemsError}
                              onClickDelete={() => {
                                arrayHelpers.remove(index);
                              }}
                            />
                          );
                        }
                      } else if (type === digitalTypeMapping["digital-file"]) {
                        return (
                          <DigitalFileBundleItems
                            key={`digital_file_container_${index}`}
                            prefix={arrayPrefix}
                            showDeleteButton={showDeleteButton}
                            bundleItemsError={bundleItemsError}
                            onClickDelete={() => {
                              arrayHelpers.remove(index);
                            }}
                          />
                        );
                      } else if (type === digitalTypeMapping["experiential"]) {
                        return (
                          <ExperientialBundleItems
                            key={`experiential_container_${index}`}
                            prefix={arrayPrefix}
                            showDeleteButton={showDeleteButton}
                            bundleItemsError={bundleItemsError}
                            onClickDelete={() => {
                              arrayHelpers.remove(index);
                            }}
                          />
                        );
                      }
                      return <></>;
                    })}
                  </>
                )}
                {(!bundleItems.length ||
                  !checkLastElementIsPristine(bundleItems)) &&
                  type === digitalTypeMapping["digital-nft"] &&
                  isNftMintedAlreadyValue !== undefined &&
                  type !== digitalTypeMapping["digital-nft"] && (
                    <Button
                      onClick={() => {
                        if (type === digitalTypeMapping["digital-nft"]) {
                          if (isNftMintedAlready) {
                            arrayHelpers.push(getNewExistingBundleItem());
                          } else {
                            arrayHelpers.push(getNewNewBundleItem());
                          }
                        } else if (
                          type === digitalTypeMapping["digital-file"]
                        ) {
                          arrayHelpers.push(getNewDigitalFileBundleItem());
                        } else if (
                          type === digitalTypeMapping["experiential"]
                        ) {
                          arrayHelpers.push(getNewExperientialBundleItem());
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
