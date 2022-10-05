import { CoreSDK } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { authTokenType } from "../../../../components/modal/components/CreateProfile/Lens/const";
import { getLensTokenId } from "../../../../components/modal/components/CreateProfile/Lens/utils";
import { LensProfileType } from "../../../../components/modal/components/CreateProfile/Lens/validationSchema";
import { useCoreSDK } from "../../useCoreSdk";

interface Props {
  sellerId: string;
  address: string;
  lensValues: LensProfileType;
  lensProfileId: string | null;
}

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
    address,
    lensValues,
    lensProfileId
  }: {
    sellerId: string;
    address: string;
    lensValues: LensProfileType;
    lensProfileId: string | null;
  }
) {
  await coreSDK.updateSeller({
    id: sellerId,
    admin: lensValues.handle,
    authTokenId: getLensTokenId(lensProfileId || "0x0"),
    authTokenType: authTokenType.Lens,
    clerk: address,
    operator: address,
    treasury: address
  });
}
