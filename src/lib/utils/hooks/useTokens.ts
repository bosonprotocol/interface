import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../../lib/types/offer";
import { fetchSubgraph } from "../core-components/subgraph";

export function useTokens() {
  return useQuery("tokens", async () => {
    const result = await fetchSubgraph<{
      exchangeTokens: Pick<Offer["exchangeToken"], "address" | "symbol">[];
    }>(
      gql`
        {
          exchangeTokens(orderBy: "symbol", orderDirection: asc) {
            address
            name
            symbol
            decimals
          }
        }
      `
    );
    return result?.exchangeTokens ?? [];
  });
}
