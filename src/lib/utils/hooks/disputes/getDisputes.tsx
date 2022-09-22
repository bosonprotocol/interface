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
              offer {
                price
                exchangeToken {
                  address
                  symbol
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
  console.log(
    "🚀  roberto --  ~ file: getDisputes.tsx ~ line 54 ~ result ~ result",
    result
  );

  return {
    ...result,
    // disputes: result?.data ?? null
    data: result?.data?.disputes ?? []
  };
}
