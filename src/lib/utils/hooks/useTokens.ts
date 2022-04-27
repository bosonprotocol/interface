import { gql } from "graphql-request";
import { Offer } from "lib/types/offer";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

export const useTokens = () => {
  return useQuery("tokens", async () => {
    const result = await fetchSubgraph<{
      exchangeTokens: Pick<Offer["exchangeToken"], "address" | "symbol">[];
    }>(
      gql`
        {
          exchangeTokens {
            address
            symbol
          }
        }
      `
    );
    return result?.exchangeTokens ?? [];
  });
};
