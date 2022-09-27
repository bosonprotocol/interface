import { BigNumber, utils } from "ethers";
import { useContext, useMemo } from "react";

import { CONFIG } from "../../lib/config";
import { Offer } from "../../lib/types/offer";
import { convertPrice } from "../../lib/utils/convertPrice";
import ConvertionRateContext from "../convertion-rate/ConvertionRateContext";

interface ExtendedOffer extends Offer {
  convertedPrice?: string;
}

interface Props {
  offers: Offer[] | undefined;
  isSortable: boolean;
  [x: string]: any;
}
export const useSortByPrice = ({ offers, ...rest }: Props) => {
  const { store } = useContext(ConvertionRateContext);

  const itemPrice = (value: string, decimals: string) => {
    try {
      return utils.formatUnits(
        BigNumber.from(value.toString()),
        Number(decimals)
      );
    } catch (e) {
      return null;
    }
  };

  const offerArray = useMemo(() => {
    const sortedArray =
      offers?.map((offer: Offer) => {
        const offerPrice = convertPrice({
          price: itemPrice(offer.price, offer.exchangeToken.decimals),
          symbol: offer.exchangeToken.symbol.toUpperCase(),
          currency: CONFIG.defaultCurrency,
          rates: store.rates,
          fixed: 8
        });
        return { ...offer, convertedPrice: offerPrice.converted };
      }) || [];

    if (rest.orderDirection === "desc") {
      return sortedArray?.sort((a, b) => {
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
      return sortedArray?.sort((a, b) => {
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
      return sortedArray as ExtendedOffer[];
    }
  }, [offers, rest]); // eslint-disable-line

  return { offerArray };
};
