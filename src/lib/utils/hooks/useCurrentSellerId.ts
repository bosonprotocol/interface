import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../core-components/subgraph";

export function useCurrentSellerId() {
  const { address: admin } = useAccount();
  const props = { admin };

  const result = useQuery(["sellers", props], async () => {
    const result = await fetchSubgraph<{
      sellers: {
        sellerId: string;
      }[];
    }>(
      gql`
        query GetSellerIdByAddress($admin: String) {
          sellers(where: { admin: $admin }) {
            sellerId
          }
        }
      `,
      props
    );
    return result;
  });

  return {
    ...result,
    sellerId: result?.data?.sellers?.[0]?.sellerId ?? null
  };
}
