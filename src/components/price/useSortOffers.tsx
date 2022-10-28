import filter from "lodash/filter";
import { useMemo } from "react";

import {
  ExtendedOffer,
  ExtendedSeller,
  FilterOptions
} from "../../pages/explore/WithAllOffers";

type Props =
  | {
      type: "products";
      data: ExtendedOffer[];
    }
  | {
      type: "sellers";
      data: ExtendedSeller[];
    };
export const useSortOffers = ({
  type,
  data: newData,
  ...filters
}: Props & FilterOptions) => {
  const offerArray = useMemo(() => {
    let data = newData || [];
    const { name, sellerCurationList, exchangeOrderBy, orderDirection } =
      filters;

    if (name && name !== "") {
      let filteredByName;
      if (type === "products") {
        filteredByName =
          filter(data, (n: ExtendedOffer) => {
            return n?.title && n?.title.includes(name?.toLowerCase());
          }) || [];
        data = (filteredByName || []) as ExtendedOffer[] | ExtendedSeller[];
      }
    }
    if (sellerCurationList && sellerCurationList.length > 0) {
      if (type === "products") {
        data = (filter(data, (n: ExtendedOffer) => {
          return n.seller?.id && sellerCurationList.includes(n.seller.id);
        }) || []) as ExtendedOffer[] | ExtendedSeller[];
      } else if (type === "sellers") {
        data = (filter(data, (n: ExtendedSeller) => {
          return n.id && sellerCurationList.includes(n.id);
        }) || []) as ExtendedOffer[] | ExtendedSeller[];
      }
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
  }, [newData, type, filters]);

  return offerArray;
};
