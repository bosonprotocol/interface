import { Grid, hooks, Typography } from "@bosonprotocol/react-kit";
import { FormField, Input, Select } from "components/form";
import Image from "components/ui/Image";
import { useForm } from "lib/utils/hooks/useForm";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import React from "react";

import {
  DIGITAL_NFT_TYPE,
  mintedNftInfo,
  NFT_TOKEN_TYPES,
  OPTIONS_PERIOD,
  TOKEN_TYPES
} from "../utils";
import { BundleItemsTransferInfo } from "./BundleItemsTransferInfo";
import { ExistingNFT } from "./getIsBundleItem";
import { Wrapper } from "./styles";

type MintedNftBundleItemsProps = {
  prefix: string;
  bundleItem: ExistingNFT;
  bundleItemsError: JSX.Element | null;
};

const [, { value: erc721 }, { value: erc1155 }] = TOKEN_TYPES;
export const MintedNftBundleItems: React.FC<MintedNftBundleItemsProps> = ({
  prefix,
  bundleItem,
  bundleItemsError
}) => {
  const { handleBlur } = useForm();
  const coreSDK = useCoreSDK();
  const {
    mintedNftContractAddress: tokenAddress,
    mintedNftTokenIdRangeMin: tokenIdNumber
  } = bundleItem;
  const tokenId = tokenIdNumber?.toString();
  const isErc721 = bundleItem.mintedNftTokenType?.value === erc721;
  const isErc1155 = bundleItem.mintedNftTokenType?.value === erc1155;
  const { data: erc721TokenUri } = hooks.useErc721TokenUris(
    {
      pairsContractTokens: [
        {
          contractAddress: tokenAddress,
          tokenIds: [tokenId]
        }
      ]
    },
    {
      enabled: !!tokenAddress && !!tokenId && isErc721,
      coreSDK
    }
  );
  const { data: erc1155Uri } = hooks.useErc1155Uris(
    {
      pairsContractTokens: [
        { contractAddress: tokenAddress, tokenIds: [tokenId] }
      ]
    },
    {
      enabled: !!tokenAddress && !!tokenId && isErc1155,
      coreSDK
    }
  );

  const { data: erc721Image } = hooks.useGetTokenUriImages(
    {
      pairsTokenUrisIds: [
        {
          tokenUris: erc721TokenUri?.[0],
          tokenIds: [tokenId]
        }
      ]
    },
    { enabled: !!(erc721TokenUri && erc721TokenUri[0] && tokenId && isErc721) }
  );
  const { data: erc1155Image } = hooks.useGetTokenUriImages(
    {
      pairsTokenUrisIds: [
        {
          tokenUris: erc1155Uri?.[0],
          tokenIds: [tokenId]
        }
      ]
    },
    { enabled: !!(erc1155Uri && erc1155Uri[0] && tokenId && isErc1155) }
  );
  const imageSrc =
    (isErc721
      ? erc721Image?.[0]?.[0]
      : isErc1155
        ? erc1155Image?.[0]?.[0]
        : "") || "";
  return (
    <Grid flexDirection="column">
      <Wrapper>
        <FormField
          style={{ margin: "1rem 0 1rem 0" }}
          title={mintedNftInfo["mintedNftType"].displayKey}
          required
          subTitle="Provide buyers more information about your NFT's traits"
        >
          <Select
            placeholder="Choose one..."
            name={`${prefix}${mintedNftInfo["mintedNftType"].key}`}
            options={DIGITAL_NFT_TYPE}
            isClearable
            errorMessage="Please select the NFT type that best matches your product."
          />
        </FormField>
        <FormField
          title="Token Type"
          subTitle="Choose an option"
          style={{ margin: "0 0 1rem 0" }}
          required
        >
          <Select
            name={`${prefix}${mintedNftInfo["mintedNftTokenType"].key}`}
            options={NFT_TOKEN_TYPES}
          />
        </FormField>

        <FormField
          title={mintedNftInfo["mintedNftContractAddress"].displayKey}
          subTitle={
            bundleItem.mintedNftTokenType
              ? `Enter the ${bundleItem.mintedNftTokenType?.label}'s contract address`
              : "Enter the contract address"
          }
          style={{ margin: "0 0 1rem 0", width: "100%" }}
          required
        >
          <Input
            name={`${prefix}${mintedNftInfo["mintedNftContractAddress"].key}`}
            type="string"
            onBlur={async (e) => {
              handleBlur(e);
            }}
            isClearable
          />
        </FormField>
        <FormField
          style={{ margin: "0 0 1rem 0" }}
          title="Token ID Range"
          subTitle="Enter the Token ID Range"
          required
        >
          <Grid flexWrap="wrap" gap="1rem" alignItems="flex-start">
            <FormField
              title={mintedNftInfo["mintedNftTokenIdRangeMin"].displayKey}
              required
              style={{ minWidth: "225px", width: "auto", margin: 0 }}
            >
              <Input
                placeholder=""
                name={`${prefix}${mintedNftInfo["mintedNftTokenIdRangeMin"].key}`}
                type="number"
              />
            </FormField>
            <FormField
              title={mintedNftInfo["mintedNftTokenIdRangeMax"].displayKey}
              required
              style={{ minWidth: "225px", width: "auto", margin: 0 }}
            >
              <Input
                placeholder=""
                name={`${prefix}${mintedNftInfo["mintedNftTokenIdRangeMax"].key}`}
                type="number"
              />
            </FormField>
          </Grid>
        </FormField>
        {tokenId && (
          <FormField
            title={`Image of token ID ${tokenId}`}
            style={{ alignItems: "stretch", margin: "0 0 1rem 0" }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                optimizationOpts={{ gateway: "https://ipfs.io/ipfs" }}
                alt={`token ID ${tokenId}`}
              />
            ) : (
              <Typography>Not available</Typography>
            )}
          </FormField>
        )}
        <FormField
          style={{ margin: "0 0 1rem 0" }}
          title={mintedNftInfo["mintedNftExternalUrl"].displayKey}
          subTitle="Provide buyers a link to the NFT"
        >
          <Input
            placeholder="https://example.com"
            name={`${prefix}${mintedNftInfo["mintedNftExternalUrl"].key}`}
          />
        </FormField>
        <FormField title="NFT Delivery Info" style={{ margin: "0 0 1rem 0" }}>
          <FormField
            style={{ margin: "0 0 1rem 0" }}
            title={mintedNftInfo["mintedNftTransferCriteria"].displayKey}
            subTitle={mintedNftInfo["mintedNftTransferCriteria"].subtitle}
            marginTop="1rem"
            required
          >
            <Input
              placeholder=""
              name={`${prefix}${mintedNftInfo["mintedNftTransferCriteria"].key}`}
            />
          </FormField>
          <FormField
            style={{ margin: "0 0 1rem 0" }}
            title={mintedNftInfo["mintedNftTransferTime"].displayKey}
            subTitle={mintedNftInfo["mintedNftTransferTime"].subtitle}
            required
          >
            <Grid gap="1rem" alignItems="flex-start">
              <Grid flexDirection="column" alignItems="flex-start">
                <Input
                  placeholder=""
                  name={`${prefix}${mintedNftInfo["mintedNftTransferTime"].key}`}
                  type="number"
                  step="1"
                />
              </Grid>
              <Select
                placeholder="Choose..."
                name={`${prefix}${mintedNftInfo["mintedNftTransferTimeUnit"].key}`}
                options={OPTIONS_PERIOD}
              />
            </Grid>
          </FormField>

          <BundleItemsTransferInfo
            selectName={`${prefix}${mintedNftInfo["mintedNftBuyerTransferInfo"].key}`}
            withBuyerAddressOption
            withBuyerEmailOption={false}
          />
        </FormField>
      </Wrapper>
      {bundleItemsError}
    </Grid>
  );
};
