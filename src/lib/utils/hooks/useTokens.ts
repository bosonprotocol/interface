import { Offer } from "@lib/types/offer";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

export const useTokens = () => {
  return useQuery("tokens", async () => {
    const result = await fetchSubgraph<{
      exchangeTokens: Pick<Offer["exchangeToken"], "address" | "symbol">[];
    }>(
      gql`
        {
          exchangeTokens(orderBy: "symbol", orderDirection: asc) {
            address
            symbol
          }
        }
      `
    );
    return result?.exchangeTokens ?? [];
  });
};
