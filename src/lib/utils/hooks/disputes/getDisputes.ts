import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../../core-components/subgraph";
import { Disputes } from "../useExchanges";

export const GetActiveEscalatedDisputes = () => {
  const { address: admin } = useAccount();
  const props = { admin };

  const result = useQuery(["getActiveEscalatedDisputes", props], async () => {
    const result = await fetchSubgraph<{
      disputes: Disputes[];
    }>(
      gql`
        query GetActiveEscalatedDisputes {
          disputes(
            where: {
              escalatedDate_not: null
              retractedDate: null
              exchange_: { completedDate: null }
              state: "ESCALATED"
            }
          ) {
            id
            state
            escalatedDate
            retractedDate
            exchange {
              id
              completedDate
              offer {
                resolutionPeriodDuration
                price
                exchanges {
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
      `,
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
        gql`
          query getPastEscalatedDisputesWithDecisions {
            disputes(
              where: { escalatedDate_not: null, decidedDate_not: null }
            ) {
              id
              state
              escalatedDate
              retractedDate
              exchange {
                id
                completedDate
                offer {
                  resolutionPeriodDuration
                  price
                  exchanges {
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
        `,
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
        gql`
          query getPastEscalatedDisputesWithRefusals {
            disputes(
              where: { escalatedDate_not: null, refusedDate_not: null }
            ) {
              id
              state
              escalatedDate
              retractedDate
              exchange {
                id
                completedDate
                offer {
                  resolutionPeriodDuration
                  price
                  exchangeToken {
                    address
                    symbol
                    decimals
                  }
                  exchanges {
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
    }
  );

  return {
    ...result,
    data: result?.data?.disputes ?? []
  };
};
