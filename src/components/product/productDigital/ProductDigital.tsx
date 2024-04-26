import { digitalTypeMapping, Grid, Typography } from "@bosonprotocol/react-kit";
import SimpleError from "components/error/SimpleError";
import { FormField } from "components/form";
import { Select } from "components/form";
import BosonButton from "components/ui/BosonButton";
import Button from "components/ui/Button";
import { FieldArray } from "formik";
import { colors } from "lib/styles/colors";
import { useForm } from "lib/utils/hooks/useForm";
import { Plus } from "phosphor-react";
import React, { Fragment } from "react";

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
const getNewExistingBundleItem = () => {
  const bundleItem: Record<
    keyof MintedNftBundleItemsType,
    | string
    | null
    | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
    | (typeof OPTIONS_PERIOD)[number]
  > = {
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
const getNewNewBundleItem = () => {
  const bundleItem: Record<
    keyof NewNftBundleItemsType,
    | string
    | null
    | (typeof BUYER_TRANSFER_INFO_OPTIONS)[number]
    | (typeof OPTIONS_PERIOD)[number]
  > = {
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
  > = {
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
  > = {
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
  const { nextIsDisabled, values, setFieldValue, errors } = useForm();
  const { bundleItems } = values.productDigital || {};
  const type = (values.productDigital?.type || {}).value;
  const isNftMintedAlreadyValue = (
    values.productDigital.isNftMintedAlready || {}
  ).value;
  const isNftMintedAlready = isNftMintedAlreadyValue === "true";
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
          style={{ margin: "0 0 1rem 0" }}
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
              style={{ margin: "0 0 1rem 0" }}
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
            <FormField
              style={{ margin: "0 0 1rem 0" }}
              title="Is the NFT minted already?"
              required
            >
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
                    {bundleItems.map((bundleItem, index) => {
                      const arrayPrefix = `${prefix}bundleItems[${index}].`;
                      if (!bundleItem) {
                        return null;
                      }
                      const CommonItemHeader = (
                        <Grid>
                          <Typography tag="h3" marginBottom="0">
                            Item {index + 1}
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
                            <MintedNftBundleItems
                              prefix={arrayPrefix}
                              bundleItemsError={bundleItemsError}
                              bundleItem={bundleItem as ExistingNFT}
                            />
                          </Fragment>
                        );
                      } else if (
                        getIsBundleItem<NewNFT>(bundleItem, "newNftName")
                      ) {
                        return (
                          <Fragment key={`new_nft_container_${index}`}>
                            {CommonItemHeader}
                            <NewNftBundleItems
                              prefix={arrayPrefix}
                              bundleItemsError={bundleItemsError}
                            />
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
                            <DigitalFileBundleItems
                              prefix={arrayPrefix}
                              bundleItemsError={bundleItemsError}
                            />
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
                            <ExperientialBundleItems
                              prefix={arrayPrefix}
                              bundleItemsError={bundleItemsError}
                            />
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
        {((type === digitalTypeMapping["digital-nft"] &&
          isNftMintedAlreadyValue !== undefined) ||
          type !== digitalTypeMapping["digital-nft"]) &&
          type && (
            <Button
              onClick={() => {
                if (type === digitalTypeMapping["digital-nft"]) {
                  if (isNftMintedAlready) {
                    setFieldValue("productDigital.bundleItems", [
                      ...bundleItems,
                      getNewExistingBundleItem()
                    ]);
                  } else {
                    setFieldValue("productDigital.bundleItems", [
                      ...bundleItems,
                      getNewNewBundleItem()
                    ]);
                  }
                } else if (type === digitalTypeMapping["digital-file"]) {
                  setFieldValue("productDigital.bundleItems", [
                    ...bundleItems,
                    getNewDigitalFileBundleItem()
                  ]);
                } else if (type === digitalTypeMapping["experiential"]) {
                  setFieldValue("productDigital.bundleItems", [
                    ...bundleItems,
                    getNewExperientialBundleItem()
                  ]);
                }
              }}
              themeVal="blankSecondary"
              style={{ borderBottom: `1px solid ${colors.border}` }}
            >
              Add new <Plus size={18} />
            </Button>
          )}
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
