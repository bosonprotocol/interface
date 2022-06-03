import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";
import { offerGraphQl } from "./useOffers/graphql";

interface Props {
  disputed: boolean | null;
  sellerId?: string;
  buyerId?: string;
}

export function useExchanges(props: Props) {
  const { disputed, sellerId, buyerId } = props;
  return useQuery(["exchanges", props], async () => {
    const result = await fetchSubgraph<{
      exchanges: Record<string, any>[]; // TODO: improve type
    }>(
      gql`
        query GetExchanges($disputed: Boolean, $sellerId: String, $buyerId: String) {
          exchanges(where: { 
            seller: $sellerId
            buyer: $buyerId
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
            seller {
              id
            }
            buyer {
              id
            }
            offer ${offerGraphQl}
          }
        }
      `,
      {
        disputed,
        sellerId,
        buyerId
      }
    );
    return result?.exchanges ?? [];
  });
}
