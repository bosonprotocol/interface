import { Grid, hooks, Typography } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import Image from "components/ui/Image";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import React from "react";
import { styled } from "styled-components";

import { mintedNftInfo } from "../utils";
import { ExistingNFT } from "./getIsBundleItem";
import { Delete } from "./styles";
const ExistingNftContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 1rem;

  > * {
    flex: 1 1 30%;
    margin: initial;
  }
`;
type MintedNftBundleItemsProps = {
  prefix: string;
  bundleItem: ExistingNFT;
  showDeleteButton: boolean;
  bundleItemsError: JSX.Element | null;
  onClickDelete: () => void;
};

export const MintedNftBundleItems: React.FC<MintedNftBundleItemsProps> = ({
  prefix,
  bundleItem,
  showDeleteButton,
  bundleItemsError,
  onClickDelete
}) => {
  const coreSDK = useCoreSDK();
  const {
    mintedNftContractAddress: tokenAddress,
    mintedNftTokenIdRangeMin: tokenIdNumber
  } = bundleItem;
  const tokenId = tokenIdNumber?.toString();
  const { data: erc721TokenUri } = hooks.useErc721TokenUri(
    {
      contractAddress: tokenAddress,
      tokenIds: [tokenId]
    },
    {
      enabled: !!tokenAddress && !!tokenId,
      coreSDK
    }
  );
  const { data: erc1155Uri } = hooks.useErc1155Uri(
    {
      contractAddress: tokenAddress,
      tokenIds: [tokenId]
    },
    {
      enabled: !!tokenAddress && !!tokenId,
      coreSDK
    }
  );

  const { data: erc721Image } = hooks.useGetTokenUriImage(
    {
      tokenUris: erc721TokenUri,
      tokenIds: [tokenId]
    },
    { enabled: !!(erc721TokenUri && erc721TokenUri[0] && tokenId) }
  );
  const { data: erc1155Image } = hooks.useGetTokenUriImage(
    {
      tokenUris: erc1155Uri,
      tokenIds: [tokenId]
    },
    { enabled: !!(erc1155Uri && erc1155Uri[0] && tokenId) }
  );
  const imageSrc = erc721Image?.[0] || erc1155Image?.[0] || "";
  return (
    <Grid flexDirection="column" marginBottom="4rem">
      <ExistingNftContainer>
        <FormField
          title={mintedNftInfo["mintedNftContractAddress"].displayKey}
          required
        >
          <Input
            placeholder="0x123...32f3"
            name={`${prefix}${mintedNftInfo["mintedNftContractAddress"].key}`}
          />
        </FormField>
        <FormField
          title={mintedNftInfo["mintedNftTokenIdRangeMin"].displayKey}
          required
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
        >
          <Input
            placeholder="999999"
            name={`${prefix}${mintedNftInfo["mintedNftTokenIdRangeMax"].key}`}
            type="number"
          />
        </FormField>
        <FormField title={mintedNftInfo["mintedNftExternalUrl"].displayKey}>
          <Input
            placeholder="https://example.com"
            name={`${prefix}${mintedNftInfo["mintedNftExternalUrl"].key}`}
          />
        </FormField>
        <FormField
          title={
            mintedNftInfo["mintedNftWhenWillItBeSentToTheBuyer"].displayKey
          }
        >
          <Input
            placeholder=""
            name={`${prefix}${mintedNftInfo["mintedNftWhenWillItBeSentToTheBuyer"].key}`}
          />
        </FormField>
        <FormField title={mintedNftInfo["mintedNftShippingInDays"].displayKey}>
          <Input
            placeholder=""
            name={`${prefix}${mintedNftInfo["mintedNftShippingInDays"].key}`}
            type="number"
          />
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
      </ExistingNftContainer>
      {bundleItemsError}
    </Grid>
  );
};
