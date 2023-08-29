import { useWeb3React } from "@web3-react/core";
import { useQuery } from "react-query";

import { useCoreSDK } from "../useCoreSdk";

export function useCurrentBuyer() {
  const coreSDK = useCoreSDK();
  const { account: address } = useWeb3React();
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
