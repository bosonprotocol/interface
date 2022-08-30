import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";

export function useExchangeTokens() {
  return useQuery("exchangeTokens", async () => {
    const result = await fetchSubgraph<{
      exchangeTokens: {
        name: string;
        symbol: string;
        offers: Array<Offer>;
      }[];
    }>(
      gql`
        {
          exchangeTokens {
            offers {
              id
              validFromDate
              validUntilDate
              voided
              price
              sellerDeposit
              quantityAvailable
            }
            name
            symbol
          }
        }
      `
    );
    return result?.exchangeTokens ?? [];
  });
}
