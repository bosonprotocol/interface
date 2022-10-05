import { CoreSDK } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { authTokenTypes } from "../../../../components/modal/components/CreateProfile/Lens/const";
import { getLensTokenId } from "../../../../components/modal/components/CreateProfile/Lens/utils";
import { LensProfileType } from "../../../../components/modal/components/CreateProfile/Lens/validationSchema";
import { useCoreSDK } from "../../useCoreSdk";

type Props = Parameters<typeof createSellerAccount>[1];

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
    authTokenId,
    authTokenType
  }: {
    address: string;
    royaltyPercentage: number;
    lensValues: LensProfileType;
    authTokenId: string | null;
    authTokenType: typeof authTokenTypes[keyof typeof authTokenTypes];
  }
) {
  if (authTokenType === authTokenTypes.Lens && !authTokenId) {
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
    admin: address,
    authTokenId:
      authTokenType === authTokenTypes.Lens
        ? getLensTokenId(authTokenId || "0x0")
        : "0",
    authTokenType,
    clerk: address,
    contractUri,
    operator: address,
    royaltyPercentage: royaltyPercentage.toString(),
    treasury: address
  });
  await tx.wait();
  return true;
}
