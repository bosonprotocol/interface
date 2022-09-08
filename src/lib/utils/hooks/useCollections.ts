import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

export function useCollections() {
  return useQuery(["sellers"], async () => {
    const result = await fetchSubgraph<{
      sellers: {
        id: string;
        exchanges: [];
        offers: {
          id: string;
          validFromDate: string;
          validUntilDate: string;
          metadata: {
            name: string;
            image: string;
          };
          exchanges: [];
        }[];
      }[];
    }>(
      gql`
        query MyQuery {
          sellers {
            id
            exchanges {
              id
            }
            offers(
              where: {
                voided: false
                validFromDate_lte: "1662847140"
                validUntilDate_lte: "1662847140"
              }
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
              exchanges {
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
      `
    );
    return result?.sellers ?? [];
  });
}
