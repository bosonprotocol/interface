import orderBy from "lodash/orderBy";
import { useMemo } from "react";

import { Offer } from "../../lib/types/offer";
import { FilterOptions } from "../../pages/explore/WithAllOffers";

interface ExtendedOffer extends Offer {
  convertedPrice?: string;
}

interface Props {
  offers: ExtendedOffer[] | undefined;
}
export const useSortByPrice = ({
  offers,
  isSortable,
  exchangeOrderBy,
  orderDirection
}: Props & FilterOptions) => {
  const offerArray = useMemo(() => {
    if (isSortable) {
      if (exchangeOrderBy === "price") {
        if (orderDirection === "desc") {
          return orderBy(offers, "convertedPrice", "desc") as ExtendedOffer[];
        } else {
          return orderBy(offers, "convertedPrice", "asc") as ExtendedOffer[];
        }
      }
      if (exchangeOrderBy === "committedDate") {
        return orderBy(offers, "committedDate", "desc") as ExtendedOffer[];
      }
      if (exchangeOrderBy === "redeemedDate") {
        return orderBy(offers, "redeemedDate", "desc") as ExtendedOffer[];
      }
    }
    return offers;
  }, [offers, isSortable, exchangeOrderBy, orderDirection]);

  return offerArray;
};
