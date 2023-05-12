import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { accounts, CoreSDK } from "@bosonprotocol/react-kit";
import { ethers } from "ethers";
import { useMutation } from "react-query";

import { authTokenTypes } from "../../../../components/modal/components/Profile/Lens/const";
import { getLensTokenIdDecimal } from "../../../../components/modal/components/Profile/Lens/utils";
import { useCoreSDK } from "../../useCoreSdk";

type Props = Parameters<typeof updateSellerAccount>[1];

export default function useUpdateSeller() {
  const coreSDK = useCoreSDK();

  return useMutation(async (props: Props) => {
    return await updateSellerAccount(coreSDK, props);
  });
}

async function updateSellerAccount(
  coreSDK: CoreSDK,
  {
    sellerId,
    admin,
    clerk,
    assistant,
    treasury,
    authTokenId,
    authTokenType,
    metadataUri
  }: {
    sellerId: string;
    admin: string;
    clerk: string;
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
        ? getLensTokenIdDecimal(authTokenId || "0x0").toString()
        : "0",
    authTokenType,
    clerk,
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
    await coreSDK.signMetaTxUpdateSellerAndOptIn(newSeller);
  }
}
