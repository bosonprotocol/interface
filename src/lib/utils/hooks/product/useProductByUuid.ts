import { useQuery } from "react-query";

import { useCoreSDK } from "../../useCoreSdk";

export default function useProductByUuid(
  uuid: string,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();

  return useQuery(
    ["get-product-by-uuid", { uuid, coreSDK }],
    async () => {
      return await coreSDK?.getProductWithVariants(uuid);
    },
    {
      ...options
    }
  );
}
