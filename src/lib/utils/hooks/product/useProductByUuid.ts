import { useQuery } from "react-query";

import { useCoreSDK } from "../../useCoreSdk";

export default function useProductByUuid(
  sellerId: string | undefined | null,
  uuid: string | undefined | null,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();

  return useQuery(
    ["get-product-by-uuid", uuid, coreSDK.uuid, sellerId],
    async () => {
      if (!uuid || !sellerId) {
        return;
      }
      return await coreSDK?.getProductWithVariants(sellerId, uuid);
    },
    {
      ...options,
      enabled: options.enabled && !!coreSDK
    }
  );
}

export type ReturnUseProductByUuid = ReturnType<
  typeof useProductByUuid
>["data"];
