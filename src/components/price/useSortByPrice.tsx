import orderBy from "lodash/orderBy";
import { useMemo } from "react";

import { Offer } from "../../lib/types/offer";
import { FilterOptions } from "../../pages/explore/WithAllOffers";

interface ExtendedOffer extends Offer {
  convertedPrice?: string;
}

interface Props {
  data: any; // ExtendedOffer[] | undefined;
}
export const useSortByPrice = ({
  data,
  exchangeOrderBy,
  orderDirection
}: Props & FilterOptions) => {
  const offerArray = useMemo(() => {
    if (exchangeOrderBy === "price") {
      if (orderDirection === "desc") {
        return orderBy(
          data,
          "additional.sortBy.lowPrice",
          "desc"
        ) as ExtendedOffer[];
      } else {
        return orderBy(
          data,
          "additional.sortBy.highPrice",
          "asc"
        ) as ExtendedOffer[];
      }
    }
    if (exchangeOrderBy === "createdAt") {
      return orderBy(
        data,
        "additional.sortBy.createdAt",
        "desc"
      ) as ExtendedOffer[];
    }
    if (exchangeOrderBy === "validFromDate") {
      return orderBy(
        data,
        "additional.sortBy.validFromDate",
        "desc"
      ) as ExtendedOffer[];
    }
    if (exchangeOrderBy === "committedDate") {
      return orderBy(
        data,
        "additional.sortBy.committedDate",
        "asc"
      ) as ExtendedOffer[];
    }
    if (exchangeOrderBy === "redeemedDate") {
      return orderBy(
        data,
        "additional.sortBy.redeemedDate",
        "asc"
      ) as ExtendedOffer[];
    }
    return data;
  }, [data, exchangeOrderBy, orderDirection]);

  return offerArray;
};
