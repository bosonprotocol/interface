import { useQuery } from "react-query";

import { useCoreSDK } from "../useCoreSdk";
import { useAccount } from "./ethers/connection";

export function useCurrentBuyer() {
  const coreSDK = useCoreSDK();
  const { account: address } = useAccount();
  return useQuery(
    ["current-buyer", coreSDK.uuid, address],
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
