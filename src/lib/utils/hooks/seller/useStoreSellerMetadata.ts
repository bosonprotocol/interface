import { CoreSDK, OfferOrSellerMetadata } from "@bosonprotocol/react-kit";
import { useMutation } from "react-query";

import { ContactPreference } from "../../../../components/modal/components/Profile/const";
import { useCoreSDK } from "../../useCoreSdk";

type CreateSellerMetadata = Omit<
  Extract<OfferOrSellerMetadata, { type: "SELLER" }>,
  "__typename" | "id" | "createdAt" | "type" | "contactPreference"
> & { contactPreference: ContactPreference };
type Props = Parameters<typeof storeSellerMetadata>[1];

export default function useStoreSellerMetadata() {
  const coreSDK = useCoreSDK();

  return useMutation(async (props: Props) => {
    return await storeSellerMetadata(coreSDK, props);
  });
}

async function storeSellerMetadata(
  coreSDK: CoreSDK,
  metadata: CreateSellerMetadata
) {
  const metadataHash = await coreSDK.storeMetadata({
    type: "SELLER",
    ...metadata
  });
  return {
    metadataUri: `ipfs://${metadataHash}`
  };
}
