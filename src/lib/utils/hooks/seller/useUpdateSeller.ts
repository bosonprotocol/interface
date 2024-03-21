import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { accounts, CoreSDK, hooks } from "@bosonprotocol/react-kit";
import { ethers } from "ethers";
import { useMutation } from "react-query";

import { authTokenTypes } from "../../../../components/modal/components/Profile/Lens/const";
import { useCoreSDK } from "../../useCoreSdk";

type Props = Parameters<typeof updateSellerAccount>[2];

export default function useUpdateSeller() {
  const coreSDK = useCoreSDK();
  const { isMetaTx } = hooks.useMetaTx(coreSDK);

  return useMutation(async (props: Props) => {
    return await updateSellerAccount(coreSDK, isMetaTx, props);
  });
}

async function updateSellerAccount(
  coreSDK: CoreSDK,
  isMetaTx: boolean,
  {
    sellerId,
    admin,
    assistant,
    treasury,
    authTokenId,
    authTokenType,
    metadataUri
  }: {
    sellerId: string;
    admin: string;
    assistant: string;
    treasury: string;
    authTokenId: string | null;
    authTokenType: typeof authTokenTypes[keyof typeof authTokenTypes];
    metadataUri: string;
  }
) {
  const newSeller: accounts.UpdateSellerArgs = {
    id: sellerId,
    admin:
      authTokenType === authTokenTypes.LENS
        ? ethers.constants.AddressZero
        : admin,
    authTokenId:
      authTokenType === authTokenTypes.LENS
        ? (authTokenId || "0").toString() // in hex with a leading 0x if different from 0
        : "0",
    authTokenType,
    assistant,
    treasury,
    metadataUri
  };
  const seller = await coreSDK.getSellerById(sellerId);
  const thereAreChanges = Object.entries(newSeller).some(([key, value]) => {
    const oldSellerValue = seller[key as keyof SellerFieldsFragment];
    if (typeof value === "string" && typeof oldSellerValue === "string") {
      return value.toLowerCase() !== oldSellerValue.toLowerCase();
    }
    return value !== oldSellerValue;
  });
  if (thereAreChanges) {
    if (isMetaTx) {
      await coreSDK.signMetaTxUpdateSellerAndOptIn(newSeller);
    } else {
      await coreSDK.updateSellerAndOptIn(newSeller);
    }
  }
}
