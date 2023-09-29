import { useQuery } from "react-query";

import { useCoreSDK } from "../../useCoreSdk";

export default function useProductByUuid(
  sellerId: string,
  uuid: string,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();

  return useQuery(
    ["get-product-by-uuid", uuid, coreSDK.uuid, sellerId],
    async () => {
      return await coreSDK?.getProductWithVariants(sellerId, uuid);
    },
    {
      ...options,
      enabled: options.enabled && !!coreSDK
    }
  );
}
