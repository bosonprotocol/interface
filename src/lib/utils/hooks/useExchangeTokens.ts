import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  sellerId: string;
}

interface Options {
  enabled?: boolean;
}
export interface ExchangeTokensProps {
  name: string;
  symbol: string;
  offers: Array<Offer>;
}
export function useExchangeTokens(props: Props, { enabled }: Options = {}) {
  const config = useConfigContext();
  return useQuery(
    ["exchangeTokens", props],
    async () => {
      const result = await fetchSubgraph<{
        exchangeTokens: ExchangeTokensProps[];
      }>(
        config.envConfig.subgraphUrl,
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
    },
    {
      enabled
    }
  );
}
