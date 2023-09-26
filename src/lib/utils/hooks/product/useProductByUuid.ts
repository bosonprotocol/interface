import { useQuery } from "react-query";

import { useCoreSDK } from "../../useCoreSdk";

export default function useProductByUuid(
  uuid: string | null | undefined,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();

  return useQuery(
    ["get-product-by-uuid", uuid, coreSDK.uuid],
    async () => {
      if (!uuid) {
        return;
      }
      return await coreSDK?.getProductWithVariants(uuid);
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
