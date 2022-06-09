import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";
import { offerGraphQl } from "./useOffers/graphql";

interface Props {
  disputed: boolean | null;
  sellerId?: string;
  buyerId?: string;
  id?: string;
}

export function useExchanges(props: Props) {
  const { disputed, sellerId, buyerId, id } = props;
  return useQuery(["exchanges", props], async () => {
    const result = await fetchSubgraph<{
      exchanges: {
        id: string;
        committedDate: string;
        disputed: boolean;
        expired: boolean;
        finalizedDate: string;
        redeemedDate: string;
        state: string;
        validUntilDate: string;
        seller: {
          id: string;
        };
        buyer: {
          id: string;
        };
        offer: Offer;
      }[];
    }>(
      gql`
        query GetExchanges($disputed: Boolean, $sellerId: String, $buyerId: String) {
          exchanges(where: { 
            ${id ? `id: "${id}"` : ""}
            ${sellerId ? "seller: $sellerId" : ""}
            ${buyerId ? "buyer: $buyerId" : ""}
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
