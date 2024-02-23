import { useQuery } from "react-query";

import { useCoreSDK } from "../../useCoreSdk";

export default function useBundleByUuid(
  sellerId: string | undefined | null,
  uuid: string | undefined | null,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDK();

  return useQuery(
    ["get-bundle-by-uuid", uuid, coreSDK.uuid, sellerId],
    async () => {
      if (!uuid || !sellerId) {
        return;
      }
      return await coreSDK?.getBundleMetadataEntities({
        metadataFilter: {
          seller: sellerId,
          bundleUuid: uuid
        }
      });
    },
    {
      ...options,
      enabled: options.enabled && !!coreSDK
    }
  );
}

export type ReturnUseBundleByUuid = ReturnType<typeof useBundleByUuid>["data"];
