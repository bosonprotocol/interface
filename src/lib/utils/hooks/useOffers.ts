import { Offer } from "lib/components/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useEffect, useState } from "react";

export const useOffers = (): [
  Offer[],
  React.Dispatch<React.SetStateAction<Offer[]>>
] => {
  const [offers, setOffers] = useState<Offer[]>([]);
  useEffect(() => {
    const fetchOffers = async () => {
      return fetchSubgraph<{ offers: Offer[] }>(
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
    };
    fetchOffers()
      .then(({ offers }) => {
        setOffers(offers);
      })
      .catch((error) => {
        setOffers([]);
        console.error(error);
      });
  }, []);
  return [offers, setOffers];
};
