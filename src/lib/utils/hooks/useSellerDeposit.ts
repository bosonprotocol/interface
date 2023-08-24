import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  sellerId?: string;
}
export interface SellerExchangeProps {
  id: string;
  finalizedDate: string;
  offer: {
    sellerDeposit: string;
    price: string;
    exchangeToken: {
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  };
}
export interface SellerProps {
  id: string;
  exchanges: SellerExchangeProps[];
}
export function useSellerDeposit(
  props: Props,
  options: {
    enabled?: boolean;
  } = {}
) {
  const config = useConfigContext();
  return useQuery(
    ["sellerDeposit", props],
    async () => {
      const result = await fetchSubgraph<{
        seller: SellerProps;
      }>(
        config.envConfig.subgraphUrl,
        gql`
          query GetSellerDeposit($sellerId: String) {
            seller(id: $sellerId) {
              id
              exchanges {
                finalizedDate
                id
                offer {
                  sellerDeposit
                  price
                  exchangeToken {
                    id
                    address
                    decimals
                    name
                    symbol
                  }
                }
              }
            }
          }
        `,
        {
          ...(props.sellerId && { sellerId: props.sellerId })
        }
      );
      return result?.seller ?? {};
    },
    {
      ...options
    }
  );
}
