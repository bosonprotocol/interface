import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { useCoreSDK } from "../useCoreSdk";

export function useCurrentBuyer() {
  const coreSDK = useCoreSDK();
  const { address } = useAccount();
  return useQuery(
    ["current-buyer"],
    async () => {
      const buyers = await coreSDK.getBuyers({
        buyersFilter: {
          wallet: address?.toLowerCase()
        }
      });
      return buyers[0];
    },
    { enabled: !!address }
  );
}
