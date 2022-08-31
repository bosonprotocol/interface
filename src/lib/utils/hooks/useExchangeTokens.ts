import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  sellerId: string;
}

export function useExchangeTokens(props: Props) {
  return useQuery(["exchangeTokens", props], async () => {
    const result = await fetchSubgraph<{
      exchangeTokens: {
        name: string;
        symbol: string;
        offers: Array<Offer>;
      }[];
    }>(
      gql`
        query GetExchangesTokens($sellerId: String) {
          exchangeTokens {
            offers(where: { sellerId: $sellerId }) {
              id
              validFromDate
              validUntilDate
              voided
              price
              sellerDeposit
              quantityAvailable
            }
            name
            symbol
          }
        }
      `,
      { ...props }
    );
    return result?.exchangeTokens ?? [];
  });
}
