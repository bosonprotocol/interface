import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../../core-components/subgraph";

export function ActiveEscalatedDisputes() {
  const { address: admin } = useAccount();
  const props = { admin };

  const result = useQuery(["getActiveEscalatedDisputes", props], async () => {
    const result = await fetchSubgraph<{
      disputes: {
        id: string;
      }[];
    }>(
      gql`
        query GetActiveEscalatedDisputes {
          disputes(
            where: {
              escalatedDate_not: null
              retractedDate: null
              exchange_: { completedDate: null }
            }
          ) {
            id
            state
            escalatedDate
            exchange {
              id
              offer {
                resolutionPeriodDuration
                price
                exchangeToken {
                  address
                  symbol
                  decimals
                }
                metadata {
                  ... on ProductV1MetadataEntity {
                    name
                    image
                  }
                }
                disputeResolver {
                  escalationResponsePeriod
                }
              }
            }
          }
        }
      `,
      props
    );
    return result;
  });

  return {
    ...result,
    data: result?.data?.disputes ?? []
  };
}
