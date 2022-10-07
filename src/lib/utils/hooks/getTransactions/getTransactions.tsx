import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { TransctionTypes } from "../../../../components/transactions/CompleteTransactions";
import { fetchSubgraph } from "../../core-components/subgraph";

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

const buildQuery = (walletAddress: string, name: string) => {
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
      sellers(where: { admin: "${walletAddress}" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(
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
      sellers(where: { clerk: "${walletAddress}" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(
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

export const GetCompletedTxLogsByWallet = () => {
  const { address: admin } = useAccount();

  const props = { admin };

  const result = useQuery(["GetCompletedTxLogsByWallet", props], async () => {
    const result = await fetchSubgraph<CompleteTransactionLogs>(
      buildQuery(admin || "", `GetCompletedTxLogsByWallet`),
      props
    );
    return result;
  });

  return {
    ...result,
    data: result?.data
  };
};
