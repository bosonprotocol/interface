import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  sellerId: string;
}
export interface ExchangeTokensProps {
  name: string;
  symbol: string;
  offers: Array<Offer>;
}
export function useExchangeTokens(props: Props) {
  return useQuery(["exchangeTokens", props], async () => {
    const result = await fetchSubgraph<{
      exchangeTokens: ExchangeTokensProps[];
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
