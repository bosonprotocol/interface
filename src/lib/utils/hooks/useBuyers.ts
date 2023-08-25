import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  wallet?: string;
  id?: string;
}
export function useBuyers(
  props: Props,
  options: {
    enabled: boolean;
  }
) {
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;
  return useQuery(
    ["buyers", props, subgraphUrl],
    async () => {
      const result = await fetchSubgraph<{
        buyers: {
          id: string;
          wallet: string;
          active: boolean;
        }[];
      }>(
        subgraphUrl,
        gql`
          query GetBuyers(
            $orderBy: String
            $orderDirection: String
            $wallet: String
            $id: String
          ) {
            buyers(
              orderBy: $orderBy
              orderDirection: $orderDirection
              where: {
                ${props.id ? `id: "${props.id}"` : ""}
                ${props.wallet ? `wallet: "${props.wallet}"` : ""}
              }
            ) {
              id
              wallet
              active
            }
          }
        `,
        {
          orderBy: "id",
          orderDirection: "asc",
          ...(props.wallet && { wallet: props.wallet }),
          ...(props.id && { id: props.id })
        }
      );
      return result?.buyers ?? [];
    },
    {
      ...options
    }
  );
}
