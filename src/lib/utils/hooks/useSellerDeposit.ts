import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  sellerId?: string;
}
export function useSellerDeposit(props: Props) {
  return useQuery(["seller", props], async () => {
    const result = await fetchSubgraph<{
      seller: {
        id: string;
        exchanges: {
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
        }[];
      };
    }>(
      gql`
        query GetSeller($sellerId: String) {
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
  });
}
