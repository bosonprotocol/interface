import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  wallet?: string;
}
export function useBuyers(props: Props) {
  return useQuery(["buyers", props], async () => {
    const result = await fetchSubgraph<{
      buyers: {
        id: string;
        wallet: string;
        active: boolean;
      }[];
    }>(
      gql`
        query GetSellers(
          $orderBy: String
          $orderDirection: String
          $wallet: String
        ) {
          buyers(
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: { wallet: $wallet }
          ) {
            id
            wallet
            active
          }
        }
      `,
      {
        orderBy: "id",
        orderDirection: "asc",
        ...(props.wallet && { wallet: props.wallet })
      }
    );
    return result?.buyers ?? [];
  });
}
