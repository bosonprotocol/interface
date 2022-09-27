import { subgraph } from "@bosonprotocol/react-kit";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";
import { offerGraphQl } from "./offers/graphql";

export type Exchange = subgraph.ExchangeFieldsFragment & {
  offer: Offer;
};

export type Disputes = subgraph.DisputeFieldsFragment & {
  exchange: { offer: Offer };
};

interface Props {
  disputed: boolean | null;
  sellerId?: string;
  buyerId?: string;
  state?: subgraph.ExchangeState;
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
    state,
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
            ${state ? `state: "${state}"` : ""}
            ${id_in ? `id_in: [${id_in.join(",")}]` : ""}
            ${sellerId !== undefined ? "seller: $sellerId" : ""}
            ${buyerId !== undefined ? "buyer: $buyerId" : ""}
            ${
              [true, false].includes(disputed as boolean)
                ? "disputed: $disputed"
                : ""
            }
            }) {
            dispute {
              id
              state
              escalatedDate
            }
            cancelledDate
            committedDate
            disputedDate
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
              operator
              admin
              clerk
              treasury
              authTokenId
              authTokenType
              voucherCloneAddress
              active
            }
            buyer {
              id
              wallet
              active
            }
            offer ${offerGraphQl}
          }
        }
      `,
        {
          disputed,
          sellerId: sellerId?.length ? sellerId : null,
          buyerId: buyerId?.length ? buyerId : null,
          orderBy,
          orderDirection
        }
      );
      return (
        result?.exchanges.map((exchange) => {
          return {
            ...exchange,
            offer: {
              ...exchange.offer,
              metadata: {
                ...exchange.offer.metadata,
                imageUrl: exchange.offer.metadata.image
              },
              isValid: true
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
