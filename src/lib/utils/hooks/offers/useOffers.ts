import { useQuery } from "react-query";

import { useConvertedPriceFunction } from "../../../../components/price/useConvertedPriceFunction";
import { CONFIG } from "../../../config";
import { useCurationLists } from "../useCurationLists";
import { useSellerWhitelist } from "../useSellerWhitelist";
import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useOffers(
  props: UseOffersProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  const sellerWhitelist = useSellerWhitelist({
    sellerWhitelistUrl: CONFIG.sellerWhitelistUrl,
    allowConnectedSeller: true
  });
  const curationLists = useCurationLists();
  const convertPrice = useConvertedPriceFunction();

  props = {
    ...props,
    ...curationLists,
    sellerCurationList: sellerWhitelist.isSuccess ? sellerWhitelist.data : []
  };
  return useQuery(
    ["offers", props],
    async () => {
      const offersList = await getOffers(props);

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
