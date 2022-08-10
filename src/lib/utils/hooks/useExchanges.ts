import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";
import { checkOfferMetadata } from "../validators";
import { offerGraphQl } from "./offers/graphql";
import { getOfferImage } from "./offers/placeholders";

export type Exchange = {
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
};

interface Props {
  disputed: boolean | null;
  sellerId?: string;
  buyerId?: string;
  id?: string;
  id_in?: string[];
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
    id_in,
    orderBy = "id",
    orderDirection = "desc"
  } = props;
  return useQuery(
    ["exchanges", props],
    async () => {
      const result = await fetchSubgraph<{
        exchanges: Exchange[];
      }>(
        gql`
        query GetExchanges($disputed: Boolean, $sellerId: String, $buyerId: String, $orderBy: String, $orderDirection: String) {
          exchanges(
            ${orderBy ? `orderBy: "${orderBy}"` : ""}
            ${orderDirection ? `orderDirection: "${orderDirection}"` : ""}
            where: {
            ${id ? `id: "${id}"` : ""}
            ${id_in ? `id_in: [${id_in.join(",")}]` : ""}
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
