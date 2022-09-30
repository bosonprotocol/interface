import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../../core-components/subgraph";
import { Disputes } from "../useExchanges";

const buildQuery = (queryString: string, name: string) => {
  return gql`
    query ${name} {
      disputes(
        where: {
          ${queryString}
        }
      ) {
        id
        state
        escalatedDate
        retractedDate
        decidedDate
        refusedDate
        exchange {
          id
          completedDate
          committedDate
          redeemedDate
          cancelledDate
          revokedDate
          offer {
            resolutionPeriodDuration
            price
            exchanges {
              id
              disputed
              cancelledDate
              committedDate
              completedDate
              disputedDate
              expired
              finalizedDate
              redeemedDate
              revokedDate
              validUntilDate
              state
              buyer {
                id
              }
            }
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
  `;
};

export const GetActiveEscalatedDisputes = () => {
  const { address: admin } = useAccount();
  const props = { admin };

  const result = useQuery(["getActiveEscalatedDisputes", props], async () => {
    const result = await fetchSubgraph<{
      disputes: Disputes[];
    }>(
      buildQuery(
        `escalatedDate_not: null
         retractedDate: null
         exchange_: { completedDate: null }
         state: "ESCALATED"`,
        `getActiveEscalatedDisputes`
      ),
      props
    );
    return result;
  });

  return {
    ...result,
    data: result?.data?.disputes ?? []
  };
};

export const GetPastEscalatedDisputesWithDecisions = () => {
  const { address: admin } = useAccount();
  const props = { admin };

  const result = useQuery(
    ["getPastEscalatedDisputesWithDecisions", props],
    async () => {
      const result = await fetchSubgraph<{
        disputes: Disputes[];
      }>(
        buildQuery(
          `escalatedDate_not: null, decidedDate_not: null`,
          `getPastEscalatedDisputesWithDecisions`
        ),
        props
      );
      return result;
    }
  );

  return {
    ...result,
    data: result?.data?.disputes ?? []
  };
};

export const GetPastEscalatedDisputesWithRefusals = () => {
  const { address: admin } = useAccount();
  const props = { admin };

  const result = useQuery(
    ["getPastEscalatedDisputesWithRefusals", props],
    async () => {
      const result = await fetchSubgraph<{
        disputes: Disputes[];
      }>(
        buildQuery(
          `escalatedDate_not: null, refusedDate_not: null`,
          `getPastEscalatedDisputesWithDecisions`
        ),
        props
      );
      return result;
    }
  );

  return {
    ...result,
    data: result?.data?.disputes ?? []
  };
};
