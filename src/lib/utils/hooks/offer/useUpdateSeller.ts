import { CoreSDK } from "@bosonprotocol/react-kit";
import { ethers } from "ethers";
import { useQuery } from "react-query";

import { authTokenTypes } from "../../../../components/modal/components/CreateProfile/Lens/const";
import { getLensTokenIdDecimal } from "../../../../components/modal/components/CreateProfile/Lens/utils";
import { useCoreSDK } from "../../useCoreSdk";

type Props = Parameters<typeof updateSellerAccount>[1];

export default function useUpdateSeller(
  props: Props,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();

  return useQuery(
    ["update-seller", props],
    async () => {
      return await updateSellerAccount(coreSDK, props);
    },
    {
      ...options
    }
  );
}

async function updateSellerAccount(
  coreSDK: CoreSDK,
  {
    sellerId,
    admin,
    clerk,
    operator,
    treasury,
    authTokenId,
    authTokenType
  }: {
    sellerId: string;
    admin: string;
    clerk: string;
    operator: string;
    treasury: string;
    authTokenId: string | null;
    authTokenType: typeof authTokenTypes[keyof typeof authTokenTypes];
  }
) {
  await coreSDK.updateSeller({
    id: sellerId,
    admin:
      authTokenType === authTokenTypes.Lens
        ? ethers.constants.AddressZero
        : admin,
    authTokenId:
      authTokenType === authTokenTypes.Lens
        ? getLensTokenIdDecimal(authTokenId || "0x0")
        : "0",
    authTokenType,
    clerk,
    operator,
    treasury
  });
}
