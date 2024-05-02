/* eslint-disable @typescript-eslint/ban-ts-comment */
import { digitalTypeMapping, Grid, Typography } from "@bosonprotocol/react-kit";
import SimpleError from "components/error/SimpleError";
import { FormField, Select } from "components/form";
import BosonButton from "components/ui/BosonButton";
import Button from "components/ui/Button";
import { FieldArray } from "formik";
import { colors } from "lib/styles/colors";
import { isTruthy } from "lib/types/helpers";
import { useForm } from "lib/utils/hooks/useForm";
import { Plus } from "phosphor-react";
import React, { Fragment, useEffect, useMemo, useRef } from "react";

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
  getDigitalTypeOption,
  getIsMintedAlreadyOption,
  isNftMintedAlreadyOptions,
  MintedNftBundleItemsType,
  NewNftBundleItemsType,
  OPTIONS_PERIOD
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

const prefix = "productDigital.";
const getNewEmptyRow = () => {
  const bundleItem: Record<
    keyof MintedNftBundleItemsType,
    | string
    | null
    | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
    | (typeof OPTIONS_PERIOD)[number]
    | (typeof DIGITAL_NFT_TYPE)[number]
    | (typeof isNftMintedAlreadyOptions)[number]
    | (typeof DIGITAL_TYPE)[number]
  > = {
    type: null,
    isNftMintedAlready: null,
    mintedNftType: null,
    mintedNftTokenType: null,
    mintedNftContractAddress: "",
    mintedNftTokenIdRangeMin: "",
    mintedNftTokenIdRangeMax: "",
    mintedNftExternalUrl: "",
    mintedNftTransferTime: "",
    mintedNftTransferTimeUnit: OPTIONS_PERIOD[0],
    mintedNftTransferCriteria: "",
    mintedNftBuyerTransferInfo:
      BUYER_TRANSFER_INFO_OPTIONS.find(
        (option) => option.value === BuyerTransferInfo.walletAddress
      ) || null
  };
  return bundleItem;
};
const getNewExistingNftBundleItem = (
  nftType: (typeof DIGITAL_NFT_TYPE)[number] | null
) => {
  const bundleItem: Record<
    keyof MintedNftBundleItemsType,
    | string
    | null
    | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
    | (typeof OPTIONS_PERIOD)[number]
    | (typeof DIGITAL_NFT_TYPE)[number]
    | (typeof isNftMintedAlreadyOptions)[number]
    | (typeof DIGITAL_TYPE)[number]
  > = {
    type: getDigitalTypeOption("digital-nft") || null,
    isNftMintedAlready: getIsMintedAlreadyOption("true") || null,
    mintedNftType: nftType,
    mintedNftTokenType: null,
    mintedNftContractAddress: "",
    mintedNftTokenIdRangeMin: "",
    mintedNftTokenIdRangeMax: "",
    mintedNftExternalUrl: "",
    mintedNftTransferTime: "",
    mintedNftTransferTimeUnit: OPTIONS_PERIOD[0],
    mintedNftTransferCriteria: "",
    mintedNftBuyerTransferInfo:
      BUYER_TRANSFER_INFO_OPTIONS.find(
        (option) => option.value === BuyerTransferInfo.walletAddress
      ) || null
  };
  return bundleItem;
};
const getNewNewNftBundleItem = (
  nftType: (typeof DIGITAL_NFT_TYPE)[number] | null
) => {
  const bundleItem: Record<
    keyof NewNftBundleItemsType,
    | string
    | null
    | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
    | (typeof OPTIONS_PERIOD)[number]
    | (typeof DIGITAL_NFT_TYPE)[number]
    | (typeof isNftMintedAlreadyOptions)[number]
    | (typeof DIGITAL_TYPE)[number]
  > = {
    type: getDigitalTypeOption("digital-nft") || null,
    isNftMintedAlready: getIsMintedAlreadyOption("false") || null,
    newNftType: nftType,
    newNftName: "",
    newNftDescription: "",
    newNftTransferCriteria: "",
    newNftTransferTime: "",
    newNftTransferTimeUnit: OPTIONS_PERIOD[0],
    newNftBuyerTransferInfo:
      BUYER_TRANSFER_INFO_OPTIONS.find(
        (option) => option.value === BuyerTransferInfo.walletAddress
      ) || null
  };
  return bundleItem;
};
const getNewDigitalFileBundleItem = () => {
  const bundleItem: Record<
    keyof DigitalFileBundleItemsType,
    | string
    | null
    | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
    | (typeof OPTIONS_PERIOD)[number]
    | (typeof isNftMintedAlreadyOptions)[number]
    | (typeof DIGITAL_TYPE)[number]
  > = {
    type: getDigitalTypeOption("digital-file") || null,
    isNftMintedAlready: null,
    digitalFileName: "",
    digitalFileDescription: "",
    digitalFileFormat: "",
    digitalFileTransferCriteria: "",
    digitalFileTransferTime: "",
    digitalFileTransferTimeUnit: OPTIONS_PERIOD[0],
    digitalFileBuyerTransferInfo:
      BUYER_TRANSFER_INFO_OPTIONS.find(
        (option) => option.value === BuyerTransferInfo.email
      ) || null
  };
  return bundleItem;
};
const getNewExperientialBundleItem = () => {
  const bundleItem: Record<
    keyof ExperientialBundleItemsType,
    | string
    | null
    | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
    | (typeof OPTIONS_PERIOD)[number]
    | (typeof isNftMintedAlreadyOptions)[number]
    | (typeof DIGITAL_TYPE)[number]
  > = {
    type: getDigitalTypeOption("experiential") || null,
    isNftMintedAlready: null,
    experientialName: "",
    experientialDescription: "",
    experientialTransferCriteria: "",
    experientialTransferTime: "",
    experientialTransferTimeUnit: OPTIONS_PERIOD[0],
    experientialBuyerTransferInfo: null // both options are fine so nothing preselected
  };
  return bundleItem;
};
export const ProductDigital: React.FC = () => {
  const { values, setFieldValue, errors } = useForm();
  const { bundleItems } = values.productDigital;
  const bundleItemsError: JSX.Element | null =
    errors.productDigital?.bundleItems &&
    typeof errors.productDigital.bundleItems === "string" &&
    errors.productDigital.bundleItems ? (
      <SimpleError style={{ color: colors.red, fontWeight: 600 }}>
        {errors.productDigital.bundleItems}
      </SimpleError>
    ) : null;
  const hasBundleItems = useMemo(() => !!bundleItems?.length, [bundleItems]);
  const bundleItemsJson = useMemo(
    () => JSON.stringify(bundleItems),
    [bundleItems]
  ); // TODO: investigate why this is necessary
  useEffect(() => {
    if (!bundleItems?.length) {
      setFieldValue("productDigital.bundleItems", [getNewEmptyRow()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBundleItems]);
  const previousBundleItems = useRef<typeof bundleItems | null>(null);
  useEffect(() => {
    if (previousBundleItems.current?.length) {
      const didAnyTypeOrMintedChange = bundleItems
        ?.map((bundleItem, index) => {
          const previousBundleItem = previousBundleItems.current?.[index];
          const diffType =
            previousBundleItem?.type?.value !== bundleItem?.type?.value;
          const diffIsMinted =
            previousBundleItem?.isNftMintedAlready?.value !==
            bundleItem?.isNftMintedAlready?.value;
          return diffType || diffIsMinted;
        })
        .some(isTruthy);
      if (didAnyTypeOrMintedChange) {
        const newBundleItems = bundleItems?.map((bundleItem, index) => {
          const previousBundleItem = previousBundleItems.current?.[index];
          const diffType =
            previousBundleItem?.type?.value !== bundleItem?.type?.value;
          const diffIsMinted =
            previousBundleItem?.isNftMintedAlready?.value !==
            bundleItem?.isNftMintedAlready?.value;
          const currentType = bundleItem?.type?.value;
          const currentIsMinted = bundleItem?.isNftMintedAlready?.value;
          if (diffType) {
            if (currentType === digitalTypeMapping["digital-nft"]) {
              return currentIsMinted
                ? getNewExistingNftBundleItem(null)
                : getNewNewNftBundleItem(null);
            } else if (currentType === digitalTypeMapping["digital-file"]) {
              return getNewDigitalFileBundleItem();
            } else if (currentType === digitalTypeMapping["experiential"]) {
              return getNewExperientialBundleItem();
            }
          } else if (diffIsMinted) {
            if (currentIsMinted === "true") {
              return getNewExistingNftBundleItem(null);
            } else if (currentIsMinted === "false") {
              return getNewNewNftBundleItem(null);
            }
          }
          return bundleItem;
        });
        setFieldValue("productDigital.bundleItems", newBundleItems);
      }
    }
    previousBundleItems.current = bundleItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleItemsJson]);
  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Digital & Experiential Items</SectionTitle>
      <div>
        <FieldArray
          name={`${prefix}bundleItems`}
          render={(arrayHelpers) => {
            const render = bundleItems && bundleItems.length > 0;
            return (
              <>
                {render && (
                  <>
                    {bundleItems.map((bundleItem, index) => {
                      const arrayPrefix = `${prefix}bundleItems[${index}].`;
                      if (!bundleItem) {
                        return null;
                      }
                      const CommonItemHeader = (
                        <>
                          <Grid marginBottom="0">
                            <Typography tag="h3">
                              Digital Item {index + 1}
                            </Typography>
                            <BosonButton
                              variant="secondaryInverted"
                              size="small"
                              onClick={() => {
                                arrayHelpers.remove(index);
                              }}
                            >
                              Remove
                            </BosonButton>
                          </Grid>
                          <FormField
                            style={{ margin: "0 0 1rem 0" }}
                            title="Choose the digital or experiential items in your bundle"
                            required
                            subTitle="Items can be an NFT, a digital file, or an experiential offering."
                          >
                            <Select
                              placeholder="Choose one..."
                              name={`${arrayPrefix}type`}
                              options={DIGITAL_TYPE}
                              isClearable
                              errorMessage="Please select the type that best matches your product."
                            />
                          </FormField>
                          {bundleItem.type?.value ===
                            digitalTypeMapping["digital-nft"] && (
                            <>
                              <FormField
                                style={{ margin: "0 0 1rem 0" }}
                                title="Is the NFT minted already?"
                                required
                              >
                                <Select
                                  placeholder="Choose one..."
                                  name={`${arrayPrefix}isNftMintedAlready`}
                                  options={isNftMintedAlreadyOptions}
                                  isClearable
                                  errorMessage="Please select an option."
                                />
                              </FormField>
                            </>
                          )}
                        </>
                      );
                      if (
                        getIsBundleItem<ExistingNFT>(
                          bundleItem,
                          "mintedNftContractAddress"
                        )
                      ) {
                        return (
                          <Fragment key={`minted_nft_container_${index}`}>
                            {CommonItemHeader}
                            {bundleItem.type && (
                              <MintedNftBundleItems
                                prefix={arrayPrefix}
                                bundleItemsError={bundleItemsError}
                                bundleItem={bundleItem}
                              />
                            )}
                          </Fragment>
                        );
                      } else if (
                        getIsBundleItem<NewNFT>(bundleItem, "newNftName")
                      ) {
                        return (
                          <Fragment key={`new_nft_container_${index}`}>
                            {CommonItemHeader}
                            {bundleItem.type && (
                              <NewNftBundleItems
                                prefix={arrayPrefix}
                                bundleItemsError={bundleItemsError}
                              />
                            )}
                          </Fragment>
                        );
                      } else if (
                        getIsBundleItem<DigitalFile>(
                          bundleItem,
                          "digitalFileName"
                        )
                      ) {
                        return (
                          <Fragment key={`digital_file_container_${index}`}>
                            {CommonItemHeader}
                            {bundleItem.type && (
                              <DigitalFileBundleItems
                                prefix={arrayPrefix}
                                bundleItemsError={bundleItemsError}
                              />
                            )}
                          </Fragment>
                        );
                      } else if (
                        getIsBundleItem<Experiential>(
                          bundleItem,
                          "experientialName"
                        )
                      ) {
                        return (
                          <Fragment key={`experiential_container_${index}`}>
                            {CommonItemHeader}
                            {bundleItem.type && (
                              <ExperientialBundleItems
                                prefix={arrayPrefix}
                                bundleItemsError={bundleItemsError}
                              />
                            )}
                          </Fragment>
                        );
                      }
                      return <></>;
                    })}
                  </>
                )}
              </>
            );
          }}
        />

        <Button
          onClick={() => {
            setFieldValue("productDigital.bundleItems", [
              ...bundleItems,
              getNewEmptyRow()
            ]);
          }}
          themeVal="blankSecondary"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          Add new <Plus size={18} />
        </Button>
        <ProductButtonGroup>
          <BosonButton variant="primaryFill" type="submit">
            Next
          </BosonButton>
        </ProductButtonGroup>
      </div>
    </ContainerProductPage>
  );
};
