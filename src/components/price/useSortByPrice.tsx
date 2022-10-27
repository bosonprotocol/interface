import { useMemo } from "react";

import { Offer } from "../../lib/types/offer";
import { FilterOptions } from "../../pages/explore/WithAllOffers";

interface ExtendedOffer extends Offer {
  uuid: string;
  title: string;
  brandName: string;
  lowPrice: string;
  highPrice: string;
  committedDate: string;
  redeemedDate: string;
  convertedPrice?: string;
}

interface Props {
  data: ExtendedOffer[];
}
export const useSortByPrice = ({
  data,
  exchangeOrderBy,
  orderDirection
}: Props & FilterOptions) => {
  const offerArray = useMemo(() => {
    if (exchangeOrderBy === "price") {
      if (orderDirection === "desc") {
        return data
          .sort(
            (a: ExtendedOffer, b: ExtendedOffer) =>
              parseFloat(a.highPrice) - parseFloat(b.highPrice)
          )
          .reverse();
      } else {
        return data.sort(
          (a: ExtendedOffer, b: ExtendedOffer) =>
            parseFloat(a.lowPrice) - parseFloat(b.lowPrice)
        );
      }
    }
    if (exchangeOrderBy === "createdAt") {
      return data
        .sort(
          (a: ExtendedOffer, b: ExtendedOffer) =>
            Number(a.createdAt) - Number(b.createdAt)
        )
        .reverse();
    }
    if (exchangeOrderBy === "validFromDate") {
      return data
        .sort(
          (a: ExtendedOffer, b: ExtendedOffer) =>
            Number(a.validFromDate) - Number(b.validFromDate)
        )
        .reverse();
    }
    if (exchangeOrderBy === "committedDate") {
      return data
        .sort(
          (a: ExtendedOffer, b: ExtendedOffer) =>
            Number(a.committedDate) - Number(b.committedDate)
        )
        .reverse();
    }
    if (exchangeOrderBy === "redeemedDate") {
      return data
        .sort(
          (a: ExtendedOffer, b: ExtendedOffer) =>
            Number(a.redeemedDate) - Number(b.redeemedDate)
        )
        .reverse();
    }
    return data as ExtendedOffer[];
  }, [data, exchangeOrderBy, orderDirection]);

  return offerArray;
};
