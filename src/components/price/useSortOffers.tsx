import filter from "lodash/filter";
import { useMemo } from "react";

import {
  ExtendedOffer,
  ExtendedSeller,
  FilterOptions
} from "../../pages/explore/WithAllOffers";

interface Props {
  data: ExtendedOffer[] | ExtendedSeller[];
}
export const useSortOffers = ({
  data: newData,
  name = "",
  sellerCurationList = [],
  exchangeOrderBy,
  orderDirection
}: Props & FilterOptions) => {
  const offerArray = useMemo(() => {
    const data = newData || [];
    if (name !== "") {
      console.log("name", name);
      const filteredByName =
        filter(newData, (n: ExtendedOffer | ExtendedSeller) => {
          return n?.title && n?.title.includes(name?.toLowerCase());
        }) || ([] as ExtendedOffer[] | ExtendedSeller[]);
      console.log("filteredByName", filteredByName);
      // data = filteredByName;
    }
    if (sellerCurationList && sellerCurationList.length > 0) {
      // TODO: BP437 add filtering
    }

    if (exchangeOrderBy === "price") {
      if (orderDirection === "desc") {
        return data
          .sort(
            (
              a: ExtendedOffer | ExtendedSeller,
              b: ExtendedOffer | ExtendedSeller
            ) =>
              parseFloat(a?.highPrice || "0") - parseFloat(b?.highPrice || "0")
          )
          .reverse();
      } else {
        return data.sort(
          (
            a: ExtendedOffer | ExtendedSeller,
            b: ExtendedOffer | ExtendedSeller
          ) => parseFloat(a?.lowPrice || "0") - parseFloat(b?.lowPrice || "0")
        );
      }
    }
    if (exchangeOrderBy === "createdAt") {
      return data
        .sort(
          (
            a: ExtendedOffer | ExtendedSeller,
            b: ExtendedOffer | ExtendedSeller
          ) => Number(a?.createdAt) - Number(b?.createdAt)
        )
        .reverse();
    }
    if (exchangeOrderBy === "validFromDate") {
      return data
        .sort(
          (
            a: ExtendedOffer | ExtendedSeller,
            b: ExtendedOffer | ExtendedSeller
          ) => Number(a?.validFromDate) - Number(b?.validFromDate)
        )
        .reverse();
    }
    if (exchangeOrderBy === "committedDate") {
      return data
        .sort(
          (
            a: ExtendedOffer | ExtendedSeller,
            b: ExtendedOffer | ExtendedSeller
          ) => Number(a?.committedDate) - Number(b?.committedDate)
        )
        .reverse();
    }
    if (exchangeOrderBy === "redeemedDate") {
      return data
        .sort(
          (
            a: ExtendedOffer | ExtendedSeller,
            b: ExtendedOffer | ExtendedSeller
          ) => Number(a?.redeemedDate) - Number(b?.redeemedDate)
        )
        .reverse();
    }
    return data;
  }, [newData, exchangeOrderBy, orderDirection, name, sellerCurationList]);

  return offerArray;
};
