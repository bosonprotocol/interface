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
        {
          sellers(orderBy: "id", orderDirection: asc) {
            id
            operator
            admin
            clerk
            treasury
            active
          }
        }
      `
    );
    return result?.sellers ?? [];
  });
}
