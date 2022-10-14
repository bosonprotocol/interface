import { subgraph } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { useCoreSDK } from "../../useCoreSdk";
import { useBuyerSellerAccounts } from "../useBuyerSellerAccounts";

export const useCompletedTransactions = (page = 0) => {
  const { address } = useAccount();
  const { seller: sellerQuery, buyer: buyerQuery } = useBuyerSellerAccounts(
    address || ""
  );
  const coreSDK = useCoreSDK();

  return useQuery(
    ["transactions", "completed", address, page],
    async () => {
      const logs = await coreSDK.getEventLogs({
        logsFilter: {
          executedBy: address?.toLowerCase(),
          account_in: [sellerQuery.sellerId, buyerQuery.buyerId]
        },
        logsOrderBy: subgraph.EventLog_OrderBy.Timestamp,
        logsOrderDirection: subgraph.OrderDirection.Desc
      });
      return logs.map((log) => ({
        ...log,
        accountType:
          log.account.id === sellerQuery.sellerId ? "Seller" : "Buyer"
      }));
    },
    {
      enabled: !!address
    }
  );
};
