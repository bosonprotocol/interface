import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  disputeResolvers: {
    admin: string;
    clerk: string;
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
  return useQuery(["disputeResolvers"], async () => {
    const result = await fetchSubgraph<Props>(
      gql`
        query GetDisputeResolvers {
          disputeResolvers {
            admin
            clerk
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
