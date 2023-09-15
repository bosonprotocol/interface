import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  disputeResolvers: {
    admin: string;
    escalationResponsePeriod: string;
    fees: {
      feeAmount: string;
      id: string;
      tokenAddress: string;
      tokenName: string;
    }[];
  }[];
}

export function useDisputeResolvers() {
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;

  return useQuery(["disputeResolvers", subgraphUrl], async () => {
    const result = await fetchSubgraph<Props>(
      subgraphUrl,
      gql`
        query GetDisputeResolvers {
          disputeResolvers {
            admin
            escalationResponsePeriod
            fees {
              feeAmount
              id
              tokenAddress
              tokenName
            }
            assistant
            treasury
            sellerAllowList
          }
        }
      `
    );
    return result ?? {};
  });
}
