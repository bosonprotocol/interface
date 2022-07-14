import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";
import { checkOfferMetadata } from "../validators";
import getOfferImage from "./offers/getOfferImage";
import { offerGraphQl } from "./offers/graphql";

interface Props {
  disputed: boolean | null;
  sellerId?: string;
  buyerId?: string;
  id?: string;
  orderBy?: string | null | undefined;
  orderDirection?: string | null | undefined;
}

export function useExchanges(
  props: Props,
  options: {
    enabled?: boolean;
  } = {}
) {
  const {
    disputed,
    sellerId,
    buyerId,
    id,
    orderBy = "id",
    orderDirection = "desc"
  } = props;
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
        query GetExchanges($disputed: Boolean, $sellerId: String, $buyerId: String, $orderBy: String, $orderDirection: String) {
          exchanges(
            ${orderBy ? `orderBy: "${orderBy}"` : ""}
            ${orderDirection ? `orderDirection: "${orderDirection}"` : ""}
            where: {
            ${id ? `id: "${id}"` : ""}
            ${sellerId ? "seller: $sellerId" : ""}
            ${buyerId ? "buyer: $buyerId" : ""}
            ${
              [true, false].includes(disputed as boolean)
                ? "disputed: $disputed"
                : ""
            }
            }) {
            cancelledDate
            committedDate
            disputed
            expired
            finalizedDate
            finalizedDate
            id
            redeemedDate
            revokedDate
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
          buyerId,
          orderBy,
          orderDirection
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
                imageUrl: getOfferImage(
                  exchange.offer.id,
                  exchange.offer.metadata.name
                )
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
