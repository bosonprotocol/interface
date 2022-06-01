import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../../lib/types/offer";
import { fetchSubgraph } from "../core-components/subgraph";

export function useSellers() {
  return useQuery("sellers", async () => {
    const result = await fetchSubgraph<{
      sellers: Pick<
        Offer["seller"],
        "id" | "operator" | "admin" | "clerk" | "treasury" | "active"
      >[];
    }>(
      gql`
        query GetSellers($orderBy: String, $orderDirection: String) {
          sellers(orderBy: $orderBy, orderDirection: $orderDirection) {
            id
            operator
            admin
            clerk
            treasury
            active
          }
        }
      `,
      {
        orderBy: "sellerId",
        orderDirection: "asc"
      }
    );
    return result?.sellers ?? [];
  });
}
