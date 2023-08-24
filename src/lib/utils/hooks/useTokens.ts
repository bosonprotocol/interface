import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../../lib/types/offer";
import { fetchSubgraph } from "../core-components/subgraph";

export function useTokens(
  options: {
    enabled?: boolean;
  } = {}
) {
  const config = useConfigContext();
  return useQuery(
    "tokens",
    async () => {
      const result = await fetchSubgraph<{
        exchangeTokens: Pick<Offer["exchangeToken"], "address" | "symbol">[];
      }>(
        config.envConfig.subgraphUrl,
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
    },
    {
      ...options
    }
  );
}
