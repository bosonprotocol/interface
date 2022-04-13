import { Offer } from "lib/components/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useCallback, useEffect, useState } from "react";

interface UseOffers {
  offers: Offer[];
  loading: boolean;
}

export const useOffers = (): UseOffers => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOffers = useCallback(async () => {
    try {
      const { offers } = await fetchSubgraph<{ offers: Offer[] }>(
        `https://api.thegraph.com/subgraphs/name/dohaki/bosonccropsten`,
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
      setOffers(offers);
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
