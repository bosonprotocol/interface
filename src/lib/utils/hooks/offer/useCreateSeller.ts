import { CoreSDK, IpfsMetadataStorage } from "@bosonprotocol/react-kit";
import { ethers } from "ethers";
import { useQuery } from "react-query";

import { authTokenTypes } from "../../../../components/modal/components/CreateProfile/Lens/const";
import { getLensTokenIdDecimal } from "../../../../components/modal/components/CreateProfile/Lens/utils";
import { LensProfileType } from "../../../../components/modal/components/CreateProfile/Lens/validationSchema";
import { loadAndSetImagePromise } from "../../base64";
import { useCoreSDK } from "../../useCoreSdk";
import { useIpfsStorage } from "../useIpfsStorage";

type Props = Parameters<typeof createSellerAccount>[1];

export default function useCreateSeller(
  props: Props,
  options: Parameters<typeof useQuery>[2] = {}
) {
  const coreSDK = useCoreSDK();
  const storage = useIpfsStorage();

  return useQuery(
    ["create-seller", props],
    () => {
      return createSellerAccount(coreSDK, props, storage);
    },
    options
  );
}

async function createSellerAccount(
  coreSDK: CoreSDK,
  {
    address,
    addressForRoyaltyPayment,
    royaltyPercentage,
    lensValues,
    authTokenId,
    authTokenType
  }: {
    address: string;
    addressForRoyaltyPayment: string;
    royaltyPercentage: number;
    lensValues: LensProfileType;
    authTokenId: string | null;
    authTokenType: typeof authTokenTypes[keyof typeof authTokenTypes];
  },
  storage: IpfsMetadataStorage
) {
  if (authTokenType === authTokenTypes.Lens && !authTokenId) {
    throw new Error(
      "[create seller] Lens profile id was going to be used but it is not provided"
    );
  }
  const logoUrl = lensValues?.logo?.[0]
    ? await loadAndSetImagePromise(lensValues.logo[0])
    : "";

  // https://docs.opensea.io/docs/contract-level-metadata
  const cid = await storage.add(
    JSON.stringify({
      name: lensValues.name,
      description: lensValues.description,
      image: logoUrl,
      external_link: window.origin,
      seller_fee_basis_points: royaltyPercentage,
      fee_recipient: addressForRoyaltyPayment
    })
  );

  const contractUri = `ipfs://${cid}`;
  const royaltyPercentageTimes100 = royaltyPercentage * 100;
  const tx = await coreSDK.createSeller({
    admin:
      authTokenType === authTokenTypes.Lens
        ? ethers.constants.AddressZero
        : address,
    authTokenId:
      authTokenType === authTokenTypes.Lens
        ? getLensTokenIdDecimal(authTokenId || "0x0")
        : "0",
    authTokenType,
    clerk: address,
    contractUri,
    operator: address,
    royaltyPercentage: royaltyPercentageTimes100.toString(),
    treasury: address
  });
  await tx.wait();
  return true;
}
