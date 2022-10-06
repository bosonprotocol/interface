import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../../core-components/subgraph";

const buildQuery = (walletAddress: string, name: string) => {
  return gql`
    query ${name} {
      buyers(where: { wallet: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(where: { admin: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(
        where: { operator: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }
      ) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(where: { clerk: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }) {
        logs {
          type
          timestamp
          executedBy
          hash
          id
        }
      }
      sellers(
        where: { treasury: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }
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
        where: { admin: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }
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
        where: { operator: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }
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
        where: { clerk: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }
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
        where: { treasury: "0xE16955e95D088bd30746c7fb7d76cDA436b86F63" }
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
  console.log(
    "🚀  roberto --  ~ file: getTransactions.tsx ~ line 109 ~ GetTxLogsByWal ~ admin",
    admin
  );
  const props = { admin };

  const result = useQuery(["getTransactionLogs", props], async () => {
    const result = await fetchSubgraph(
      buildQuery(admin || "", `getTxLogsByWallet`),
      props
    );
    return result;
  });
  console.log(
    "🚀  roberto --  ~ file: getTransactions.tsx ~ line 121 ~ result ~ result",
    result
  );

  return {
    ...result,
    data: result?.data
  };
};
