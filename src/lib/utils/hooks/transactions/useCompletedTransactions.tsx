import { subgraph } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { useCoreSDK } from "../../useCoreSdk";
import { useCurrentBuyer } from "../useCurrentBuyer";
import { useCurrentSellers } from "../useCurrentSellers";

export const useCompletedTransactions = (page = 0) => {
  const { address } = useAccount();

  const { sellerIds } = useCurrentSellers();
  const { data: currentBuyer } = useCurrentBuyer();
  const coreSDK = useCoreSDK();

  const accountIds = [...sellerIds, currentBuyer?.id].filter(Boolean);

  return useQuery(
    ["transactions", "completed", address, page],
    async () => {
      const logs = await coreSDK.getEventLogs({
        logsFilter: {
          executedBy: address?.toLowerCase(),
          account_in: [...sellerIds, currentBuyer ? currentBuyer.id : ""]
        },
        logsOrderBy: subgraph.EventLog_OrderBy.Timestamp,
        logsOrderDirection: subgraph.OrderDirection.Desc
      });
      return logs.map((log) => ({
        ...log,
        accountType: sellerIds.includes(log.account.id) ? "Seller" : "Buyer"
      }));
    },
    {
      enabled: !!address && accountIds.length > 0,
      refetchInterval: 5_000
    }
  );
};
