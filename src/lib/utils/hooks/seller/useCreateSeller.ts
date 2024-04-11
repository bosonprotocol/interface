import { TransactionResponse } from "@bosonprotocol/common";
import {
  accounts,
  CoreSDK,
  hooks,
  IpfsMetadataStorage
} from "@bosonprotocol/react-kit";
import { ethers } from "ethers";
import { useMutation } from "react-query";

import { authTokenTypes } from "../../../../components/modal/components/Profile/Lens/const";
import { getLensTokenIdDecimal } from "../../../../components/modal/components/Profile/Lens/utils";
import { useCoreSDK } from "../../useCoreSdk";
import { useIpfsStorage } from "../useIpfsStorage";

type Props = Parameters<typeof createSellerAccount>[2];

export default function useCreateSeller() {
  const coreSDK = useCoreSDK();
  const storage = useIpfsStorage();
  const { isMetaTx } = hooks.useMetaTx(coreSDK);

  return useMutation((props: Props) => {
    return createSellerAccount(coreSDK, isMetaTx, props, storage);
  });
}

async function createSellerAccount(
  coreSDK: CoreSDK,
  isMetaTx: boolean,
  {
    address,
    addressForRoyaltyPayment,
    royaltyPercentage,
    name,
    description,
    authTokenId,
    authTokenType,
    profileLogoUrl,
    metadataUri
  }: {
    address: string;
    addressForRoyaltyPayment: string;
    royaltyPercentage: number;
    name: string;
    description: string;
    authTokenId: string | null;
    authTokenType: (typeof authTokenTypes)[keyof typeof authTokenTypes];
    profileLogoUrl: string;
    metadataUri: string;
  },
  storage: IpfsMetadataStorage
) {
  if (authTokenType === authTokenTypes.LENS && !authTokenId) {
    throw new Error(
      "[create seller] Lens profile id was going to be used but it is not provided"
    );
  }

  const royaltyPercentageTimes100 = Math.floor(royaltyPercentage * 100);

  // https://docs.opensea.io/docs/contract-level-metadata
  const cid = await storage.add(
    JSON.stringify({
      name: name,
      description: description,
      image: profileLogoUrl,
      external_link: window.origin,
      seller_fee_basis_points: royaltyPercentageTimes100,
      fee_recipient: addressForRoyaltyPayment
    })
  );

  const contractUri = `ipfs://${cid}`;
  const sellerData: accounts.CreateSellerArgs = {
    admin:
      authTokenType === authTokenTypes.LENS
        ? ethers.constants.AddressZero
        : address,
    authTokenId:
      authTokenType === authTokenTypes.LENS
        ? getLensTokenIdDecimal(authTokenId || "0x0")
        : "0",
    authTokenType,
    contractUri,
    assistant: address,
    royaltyPercentage: royaltyPercentageTimes100.toString(),
    treasury: address,
    metadataUri
  };
  let tx: TransactionResponse;
  if (isMetaTx) {
    // createSeller with meta-transaction
    const nonce = Date.now();
    const { r, s, v, functionName, functionSignature } =
      await coreSDK.signMetaTxCreateSeller({
        createSellerArgs: sellerData,
        nonce
      });
    tx = await coreSDK.relayMetaTransaction({
      functionName,
      functionSignature,
      sigR: r,
      sigS: s,
      sigV: v,
      nonce
    });
  } else {
    tx = await coreSDK.createSeller(sellerData);
  }
  const txReceipt = await tx.wait();
  const createdSellerId = coreSDK.getCreatedSellerIdFromLogs(txReceipt?.logs);
  return createdSellerId;
}
