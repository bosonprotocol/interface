import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../../core-components/subgraph";
import { useAccount } from "../ethers/connection";
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
        buyerPercent
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
            sellerDeposit
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
                productV1Seller {
                  contactLinks {
                    id
                    url
                    tag
                  }
                }
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
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;
  const { account: admin } = useAccount();

  const props = { admin };

  const result = useQuery(
    ["getActiveEscalatedDisputes", props, subgraphUrl],
    async () => {
      const result = await fetchSubgraph<{
        disputes: Disputes[];
      }>(
        subgraphUrl,
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
    }
  );

  return {
    ...result,
    data: result?.data?.disputes ?? []
  };
};

export const GetPastEscalatedDisputesWithDecisions = () => {
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;
  const { account: admin } = useAccount();

  const props = { admin };

  const result = useQuery(
    ["getPastEscalatedDisputesWithDecisions", props, subgraphUrl],
    async () => {
      const result = await fetchSubgraph<{
        disputes: Disputes[];
      }>(
        subgraphUrl,
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
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;
  const { account: admin } = useAccount();

  const props = { admin };

  const result = useQuery(
    ["getPastEscalatedDisputesWithRefusals", props, subgraphUrl],
    async () => {
      const result = await fetchSubgraph<{
        disputes: Disputes[];
      }>(
        subgraphUrl,
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
