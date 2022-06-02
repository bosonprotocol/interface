import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";
import { offerGraphQl } from "./useOffers/graphql";

interface Props {
  disputed: boolean | null;
  sellerId: string;
}

export function useExchanges({ disputed, sellerId }: Props) {
  return useQuery("exchanges", async () => {
    const result = await fetchSubgraph<{
      exchanges: Record<string, any>[]; // TODO: improve type
    }>(
      gql`
        query GetExchanges($disputed: Boolean, $sellerId: String) {
          exchanges(where: { 
            seller: $sellerId
            ${
              [true, false].includes(disputed as boolean)
                ? "disputed: $disputed"
                : ""
            }
             }) {
            id
            committedDate
            disputed
            expired
            finalizedDate
            redeemedDate
            state
            validUntilDate
            buyer {
              id
            }
            offer ${offerGraphQl}
          }
        }
      `,
      {
        disputed,
        sellerId
      }
    );
    return result?.exchanges ?? [];
  });
}
