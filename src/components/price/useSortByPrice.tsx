import { useMemo } from "react";

import { Offer } from "../../lib/types/offer";

interface ExtendedOffer extends Offer {
  convertedPrice?: string;
}

interface Props {
  offers: ExtendedOffer[] | undefined;
  isSortable: boolean;
  [x: string]: any;
}
export const useSortByPrice = ({ offers, ...rest }: Props) => {
  const offerArray = useMemo(() => {
    if (rest.orderDirection === "desc") {
      return offers?.sort((a, b) => {
        if (a.convertedPrice && b.convertedPrice) {
          return a.convertedPrice > b.convertedPrice
            ? 1
            : b.convertedPrice > a.convertedPrice
            ? -1
            : 0;
        }
        return 0;
      }) as ExtendedOffer[];
    } else if (rest.orderDirection === "asc") {
      return offers?.sort((a, b) => {
        if (a.convertedPrice && b.convertedPrice) {
          return a.convertedPrice < b.convertedPrice
            ? 1
            : b.convertedPrice < a.convertedPrice
            ? -1
            : 0;
        }
        return 0;
      }) as ExtendedOffer[];
    } else {
      return offers;
    }
  }, [offers, rest]); // eslint-disable-line

  return offerArray;
};
