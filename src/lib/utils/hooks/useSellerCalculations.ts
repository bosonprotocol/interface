import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  sellerId: string;
}
export function useSellerCalculations(
  props: Props,
  options: {
    enabled?: boolean;
  } = {}
) {
  const config = useConfigContext();
  return useQuery(
    ["offers", "exchanges", props],
    async () => {
      const result = await fetchSubgraph<{
        offers: {
          id: string;
        }[];
        exchanges: {
          id: string;
          buyer: {
            id: string;
          };
        }[];
      }>(
        config.envConfig.subgraphUrl,
        gql`
          query GetSellerCalculations($sellerId: String) {
            offers(where: { sellerId: $sellerId }) {
              id
            }
            exchanges(where: { seller: $sellerId }) {
              buyer {
                id
              }
            }
          }
        `,
        {
          ...props
        }
      );
      return result ?? {};
    },
    {
      ...options
    }
  );
}
