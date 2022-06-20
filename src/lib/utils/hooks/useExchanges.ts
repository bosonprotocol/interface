import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";
import { checkOfferMetadata } from "../validators";
import { offerGraphQl } from "./useOffers/graphql";

interface Props {
  disputed: boolean | null;
  sellerId?: string;
  buyerId?: string;
  id?: string;
}

export function useExchanges(
  props: Props,
  options: {
    enabled?: boolean;
  } = {}
) {
  const { disputed, sellerId, buyerId, id } = props;
  return useQuery(
    ["exchanges", props],
    async () => {
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
            wallet: string;
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
              wallet
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
      return (
        result?.exchanges.map((exchange) => {
          const isValid = checkOfferMetadata(exchange.offer);
          return {
            ...exchange,
            offer: {
              ...exchange.offer,
              metadata: {
                ...exchange.offer.metadata,
                imageUrl: `https://picsum.photos/seed/${exchange.offer.id}/700`
              },
              isValid
            } as Offer
          };
        }) ?? []
      );
    },
    {
      ...options
    }
  );
}
