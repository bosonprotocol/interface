import { useCoreSDK } from "lib/utils/useCoreSdk";
import { useQuery } from "react-query";

export default function useProductByOfferId(
  offerId: string | undefined | null,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();

  return useQuery(
    ["get-product-by-offerId", offerId, coreSDK.uuid],
    async () => {
      if (!offerId) {
        return;
      }
      return await coreSDK?.getProductWithVariantsFromOfferId(offerId);
    },
    {
      ...options,
      enabled: options.enabled && !!coreSDK
    }
  );
}

export type ReturnUseProductByOfferId = ReturnType<
  typeof useProductByOfferId
>["data"];
