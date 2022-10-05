import { CoreSDK } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { authTokenTypes } from "../../../../components/modal/components/CreateProfile/Lens/const";
import { getLensTokenId } from "../../../../components/modal/components/CreateProfile/Lens/utils";
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
    () => {
      return updateSellerAccount(coreSDK, props);
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
    admin,
    authTokenId:
      authTokenType === authTokenTypes.Lens
        ? getLensTokenId(authTokenId || "0x0")
        : "0",
    authTokenType,
    clerk,
    operator,
    treasury
  });
}
