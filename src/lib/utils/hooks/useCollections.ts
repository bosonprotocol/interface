import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

export function useCollections(
  props?: {
    skip?: number;
    first?: number;
    orderDirection?: string;
    orderBy?: string;
    validFromDate?: string;
    validUntilDate?: string;
    exchangeOrderBy?: string;
    validFromDate_lte?: string;
    sellerCurationList?: string;
  },
  options: {
    enabled?: boolean;
  } = {}
) {
  const sellerCurationList = props?.sellerCurationList?.split(",");
  return useQuery(
    ["sellers", props, sellerCurationList],
    async () => {
      const result = await fetchSubgraph<{
        sellers: {
          id: string;
          exchanges: [];
          offers: {
            id: string;
            validFromDate: string;
            validUntilDate: string;
            validFromDate_lte: string;
            metadata: {
              name: string;
              image: string;
            };
            exchanges: [];
            duplicate?: boolean;
          }[];
        }[];
      }>(
        gql`
          query GetCollections(
            $skip: Int
            $orderDirection: String
            $orderBy: String
            $first: Int
            $validFromDate: String
            $validUntilDate: String
            $validFromDate_lte: String
            ${sellerCurationList ? "$sellerCurationList: [String!]" : ""}
          ) {
            sellers(skip: $skip, first: $first where: {${
              sellerCurationList ? "sellerId_in: $sellerCurationList" : ""
            }}) {
              id
              exchanges {
                id
              }
              offers(
                where: { voided: false, ${
                  props?.validFromDate_lte
                    ? "validFromDate_lte: $validFromDate_lte"
                    : ""
                } }
                orderBy: $orderBy
                orderDirection: $orderDirection
              ) {
                id
                validFromDate
                validUntilDate
                metadata {
                  ... on ProductV1MetadataEntity {
                    name
                    image
                  }
                }
                exchanges(orderBy: $exchangeOrderBy) {
                  id
                  state
                  redeemedDate
                  finalizedDate
                  offer {
                    metadata {
                      ... on ProductV1MetadataEntity {
                        image
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        {
          ...props,
          sellerCurationList: sellerCurationList
        }
      );
      return result?.sellers ?? [];
    },
    {
      ...options
    }
  );
}
