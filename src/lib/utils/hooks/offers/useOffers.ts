import { useConfigContext } from "components/config/ConfigContext";
import { useQuery } from "react-query";

import { useConvertedPriceFunction } from "../../../../components/price/useConvertedPriceFunction";
import { useCurationLists } from "../useCurationLists";
import { getOffers } from "./getOffers";
import { UseOfferOptionsProps, UseOffersProps } from "./types";

export function useOffers(
  props: UseOffersProps,
  options: UseOfferOptionsProps = {}
) {
  const { config } = useConfigContext();
  const { subgraphUrl, defaultDisputeResolverId } = config.envConfig;

  const curationLists = useCurationLists();
  const convertPrice = useConvertedPriceFunction();
  const offerlistFromCuration = curationLists.offerCurationList;
  const newProps = {
    ...props,
    ...curationLists,
    ...options.overrides,
    // if there is a offer list defined at .env level, then use that or the intersection with the overrides
    // otherwise, use the overrides offer list
    offerCurationList: offerlistFromCuration
      ? options.overrides?.offerCurationList
        ? options.overrides.offerCurationList.filter((o) =>
            offerlistFromCuration.includes(o)
          )
        : offerlistFromCuration
      : options.overrides?.offerCurationList
  } satisfies UseOffersProps;

  return useQuery(
    ["offers", newProps, subgraphUrl, defaultDisputeResolverId],
    async () => {
      const offersList =
        !curationLists.sellerCurationList ||
        curationLists.sellerCurationList.length > 0
          ? await getOffers(subgraphUrl, defaultDisputeResolverId, newProps)
          : [];

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
    {
      enabled: options.enabled
    }
  );
}
