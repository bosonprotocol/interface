import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../core-components/subgraph";

export function useCurrentDisputeResolverId() {
  const config = useConfigContext();
  const { address: admin } = useAccount();
  const props = { admin };

  const result = useQuery(["disputeResolver", props], async () => {
    const result = await fetchSubgraph<{
      disputeResolvers: {
        id: string;
      }[];
    }>(
      config.envConfig.subgraphUrl,
      gql`
        query GetDisputeResolvers($admin: String) {
          disputeResolvers(where: { admin: $admin }) {
            id
          }
        }
      `,
      props
    );
    return result;
  });

  return {
    ...result,
    disputeResolverId: result?.data?.disputeResolvers?.[0]?.id ?? null
  };
}
