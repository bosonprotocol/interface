import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  disputed: boolean | null;
}

export function useExchanges({ disputed }: Props) {
  return useQuery("exchanges", async () => {
    const result = await fetchSubgraph<{
      exchanges: Record<string, any>[]; // TODO: improve type
    }>(
      gql`
        query GetExchanges($disputed: Boolean) {
          exchanges(where: { 
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
            offer {
              id
            }
          }
        }
      `,
      {
        disputed
      }
    );
    return result?.exchanges ?? [];
  });
}
