import { useConfigContext } from "components/config/ConfigContext";
import { useQuery } from "react-query";

import { useConvertedPriceFunction } from "../../../../components/price/useConvertedPriceFunction";
import { useCurationLists } from "../useCurationLists";
import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useOffers(
  props: UseOffersProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  const config = useConfigContext();
  const curationLists = useCurationLists();
  const convertPrice = useConvertedPriceFunction();

  props = {
    ...props,
    ...curationLists
  };
  return useQuery(
    ["offers", props],
    async () => {
      const offersList = await getOffers(config.envConfig.subgraphUrl, props);

      // sort the offers by price
      const orderedOffers = offersList.sort((a, b) => {
        const priceAInDolar = convertPrice(a)?.converted || "0";
        const priceBInDolar = convertPrice(b)?.converted || "0";
        return (
          parseFloat(priceBInDolar) * parseInt(b.numberOfCommits) -
          parseFloat(priceAInDolar) * parseInt(a.numberOfCommits)
        );
      });

      return orderedOffers;
    },
    options
  );
}
