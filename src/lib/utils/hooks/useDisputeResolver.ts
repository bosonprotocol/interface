import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  disputeResolver: {
    id: string;
    escalationResponsePeriod: string;
    admin: string;
    treasury: string;
    assistant: string;
    metadataUri: string;
    active: boolean;
    sellerAllowList: string[];
    fees: {
      feeAmount: string;
      tokenAddress: string;
      tokenName: string;
      token: {
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
    }[];
  };
}

export function useDisputeResolver(id: string) {
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;
  const props = { id };

  const result = useQuery(["disputeResolver", props, subgraphUrl], async () => {
    const result = await fetchSubgraph<Props>(
      subgraphUrl,
      gql`
        query GetDisputeResolver($id: String) {
          disputeResolver(id: $id) {
            id
            escalationResponsePeriod
            admin
            treasury
            assistant
            metadataUri
            active
            sellerAllowList
            fees {
              feeAmount
              tokenAddress
              tokenName
              token {
                address
                decimals
                symbol
                name
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
    ...result?.data
  };
}
