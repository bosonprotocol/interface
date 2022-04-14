import { Offer } from "lib/components/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useCallback, useEffect, useState } from "react";

interface UseOffers {
  offers: Offer[];
  loading: boolean;
}

const offersGraphqlEndpoint = process.env
  .REACT_APP_SUBGRAPH_OFFERS_GRAPHQL_ENDPOINT as string;

export const useOffers = (): UseOffers => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOffers = useCallback(async () => {
    try {
      const { offers } = await fetchSubgraph<{ offers: Offer[] }>(
        offersGraphqlEndpoint,
        `{
          offers {
            id
            price
            seller {
              id
              address
            }
            exchangeToken {
              symbol
            }
            metadata {
              title
              description
              additionalProperties
            }
          }
        }`
      );
      const offers1 = offers.slice(0, 10);
      setOffers(offers1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  return { offers, loading };
};
