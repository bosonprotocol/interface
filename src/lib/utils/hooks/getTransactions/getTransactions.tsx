import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { TransctionTypes } from "../../../../components/transactions/CompleteTransactions";
import { fetchSubgraph } from "../../core-components/subgraph";
import { useCoreSDK } from "../../useCoreSdk";

interface Logs {
  type: TransctionTypes;
  timestamp: string;
  executedBy: string;
  hash: string;
  id: string;
}
export interface CompleteTransactionLogs {
  buyers: [{ logs: Logs[] }];
  disputeResolvers: [{ logs: Logs[] }];
  sellers: [{ logs: Logs[] }];
}

interface SellerAddresses {
  authTokenId: string;
  sellerAdmin: string;
  clerk: string;
  operator: string;
  treasury: string;
}

const buildQuery = (
  walletAddress: string,
  sellerAddresses: SellerAddresses,
  name: string
) => {
  return gql`
    query ${name} {
      buyers(where: { wallet: "${walletAddress}" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(where: { authTokenId: "${sellerAddresses.authTokenId}" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(where: { admin: "${sellerAddresses.sellerAdmin}" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(
        where: { operator: "${sellerAddresses.operator}" }
      ) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(where: { clerk: "${sellerAddresses.clerk}" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(
        where: { treasury: "${sellerAddresses.treasury}" }
      ) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      disputeResolvers(
        where: { admin: "${walletAddress}" }
      ) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      disputeResolvers(
        where: { operator: "${walletAddress}" }
      ) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      disputeResolvers(
        where: { clerk: "${walletAddress}" }
      ) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      disputeResolvers(
        where: { treasury: "${walletAddress}" }
      ) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
    }
  `;
};

export const useGetCompletedTxLogsByWallet = () => {
  const { address: admin } = useAccount();
  const coreSDK = useCoreSDK();

  const { data: seller } = useQuery(
    ["GetSellerPropsForCompletedTxLogs", { admin }],
    async () => {
      const sellers = await coreSDK.getSellersByAddress(admin || "");
      const [seller] = sellers;
      return seller;
    }
  );

  return useQuery(
    ["GetCompletedTxLogsByWallet", { admin, seller }],
    async () => {
      const result = await fetchSubgraph<CompleteTransactionLogs>(
        buildQuery(
          admin || "",
          {
            authTokenId: seller?.authTokenId || "",
            sellerAdmin: seller?.admin || "",
            clerk: seller?.clerk || "",
            operator: seller?.operator || "",
            treasury: seller?.treasury || ""
          },
          `GetCompletedTxLogsByWallet`
        ),
        { admin, seller }
      );
      return result;
    },
    {
      enabled: !!admin && !!seller,
      refetchOnMount: true
    }
  );
};
