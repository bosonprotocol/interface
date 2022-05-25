import { Offer } from "@lib/types/offer";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

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
        orderBy: "id",
        orderDirection: "asc"
      }
    );
    return result?.sellers?.sort((a, b) => Number(a) - Number(b)) ?? [];
  });
}
