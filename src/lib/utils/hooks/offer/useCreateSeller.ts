import { CoreSDK } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { authTokenType } from "../../../../components/modal/components/CreateProfile/Lens/const";
import { getLensTokenId } from "../../../../components/modal/components/CreateProfile/Lens/utils";
import { LensProfileType } from "../../../../components/modal/components/CreateProfile/Lens/validationSchema";
import { useCoreSDK } from "../../useCoreSdk";

interface Props {
  address: string;
  royaltyPercentage: number;
  lensValues: LensProfileType;
  lensProfileId: string | null;
  setAdminToLensHandle: boolean;
}

export default function useCreateSeller(
  props: Props,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();

  return useQuery(
    ["create-seller", props],
    () => {
      return createSellerAccount(coreSDK, props);
    },
    {
      ...options
    }
  );
}

async function createSellerAccount(
  coreSDK: CoreSDK,
  {
    address,
    royaltyPercentage,
    lensValues,
    lensProfileId,
    setAdminToLensHandle
  }: {
    address: string;
    royaltyPercentage: number;
    lensValues: LensProfileType;
    lensProfileId: string | null;
    setAdminToLensHandle: boolean;
  }
) {
  if (setAdminToLensHandle && !lensValues.handle) {
    throw new Error(
      "[create seller]  Lens handle was going to be used but it is not provided"
    );
  }

  if (setAdminToLensHandle && !lensProfileId) {
    throw new Error(
      "[create seller] Lens profile id was going to be used but it is not provided"
    );
  }
  // https://docs.opensea.io/docs/contract-level-metadata
  const contractUriBase64 = window.btoa(
    JSON.stringify({
      name: lensValues.name,
      description: lensValues.description,
      image: "",
      external_link: "",
      seller_fee_basis_points: 0,
      fee_recipient: ""
    })
  );
  // https://www.kevfoo.com/2022/05/opensea-contracturi/
  const contractUri = `data:application/json;base64,${contractUriBase64}`;

  const tx = await coreSDK.createSeller({
    admin: setAdminToLensHandle ? lensValues.handle : address,
    authTokenId: setAdminToLensHandle
      ? getLensTokenId(lensProfileId || "0x0")
      : "0",
    authTokenType: setAdminToLensHandle
      ? authTokenType.Lens
      : authTokenType.None,
    clerk: address,
    contractUri,
    operator: address,
    royaltyPercentage: royaltyPercentage.toString(),
    treasury: address
  });
  await tx.wait();
  return true;
}
