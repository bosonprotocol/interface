import { Grid, hooks, Typography } from "@bosonprotocol/react-kit";
import { FormField, Input, Select } from "components/form";
import Image from "components/ui/Image";
import { useForm } from "lib/utils/hooks/useForm";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import React from "react";

import {
  mintedNftInfo,
  NFT_TOKEN_TYPES,
  OPTIONS_PERIOD,
  TOKEN_TYPES
} from "../utils";
import { BundleItemsTransferInfo } from "./BundleItemsTransferInfo";
import { ExistingNFT } from "./getIsBundleItem";
import { Delete, Wrapper } from "./styles";

type MintedNftBundleItemsProps = {
  prefix: string;
  bundleItem: ExistingNFT;
  showDeleteButton: boolean;
  bundleItemsError: JSX.Element | null;
  onClickDelete: () => void;
};

const [, { value: erc721 }, { value: erc1155 }] = TOKEN_TYPES;
export const MintedNftBundleItems: React.FC<MintedNftBundleItemsProps> = ({
  prefix,
  bundleItem,
  showDeleteButton,
  bundleItemsError,
  onClickDelete
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
  const { data: erc721TokenUri } = hooks.useErc721TokenUri(
    {
      contractAddress: tokenAddress,
      tokenIds: [tokenId]
    },
    {
      enabled: !!tokenAddress && !!tokenId && isErc721,
      coreSDK
    }
  );
  const { data: erc1155Uri } = hooks.useErc1155Uri(
    {
      contractAddress: tokenAddress,
      tokenIds: [tokenId]
    },
    {
      enabled: !!tokenAddress && !!tokenId && isErc1155,
      coreSDK
    }
  );

  const { data: erc721Image } = hooks.useGetTokenUriImage(
    {
      tokenUris: erc721TokenUri,
      tokenIds: [tokenId]
    },
    { enabled: !!(erc721TokenUri && erc721TokenUri[0] && tokenId && isErc721) }
  );
  const { data: erc1155Image } = hooks.useGetTokenUriImage(
    {
      tokenUris: erc1155Uri,
      tokenIds: [tokenId]
    },
    { enabled: !!(erc1155Uri && erc1155Uri[0] && tokenId && isErc1155) }
  );
  const imageSrc = erc721Image?.[0] || erc1155Image?.[0] || "";
  return (
    <Grid flexDirection="column">
      <Wrapper>
        <FormField
          title="Token Type"
          subTitle="Choose an option"
          style={{ margin: "1rem 0 0 0" }}
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
          style={{ margin: "1rem 0 0 0", width: "100%" }}
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
          <Grid flexWrap="wrap" gap="1rem">
            <FormField
              title={mintedNftInfo["mintedNftTokenIdRangeMin"].displayKey}
              required
              style={{ minWidth: "225px", width: "auto", margin: 0 }}
            >
              <Input
                placeholder="1"
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
                placeholder="999999"
                name={`${prefix}${mintedNftInfo["mintedNftTokenIdRangeMax"].key}`}
                type="number"
              />
            </FormField>
          </Grid>
        </FormField>
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
          {tokenId && (
            <FormField
              title={`Image of token ID ${tokenId}`}
              style={{ alignItems: "stretch" }}
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  optimizationOpts={{ gateway: "https://ipfs.io/ipfs" }}
                />
              ) : (
                <Typography>Not available</Typography>
              )}
            </FormField>
          )}
          <BundleItemsTransferInfo
            selectName={`${prefix}${mintedNftInfo["mintedNftBuyerTransferInfo"].key}`}
            withBuyerAddressOption
            withBuyerEmailOption={false}
          />
        </FormField>
        {showDeleteButton && (
          <FormField title="Action">
            <Delete
              size={18}
              style={{
                gridColumn: "delete",
                gridRow: "delete"
              }}
              onClick={onClickDelete}
            />
          </FormField>
        )}
      </Wrapper>
      {bundleItemsError}
    </Grid>
  );
};
