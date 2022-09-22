import { BigNumber, utils } from "ethers";
import { useContext, useEffect, useState } from "react";

import { CONFIG } from "../../lib/config";
import { Offer } from "../../lib/types/offer";
import { convertPrice } from "../../lib/utils/convertPrice";
import { usePrevious } from "../../lib/utils/hooks/usePrevious";
import ConvertionRateContext from "../convertion-rate/ConvertionRateContext";

interface ExtendedOffer extends Offer {
  convertedPrice?: string;
}

interface Props {
  offers: Offer[] | undefined;
  order: "desc" | "asc";
  isSortable: boolean;
}
export const useSortByPrice = ({
  offers,
  order,
  isSortable = false
}: Props) => {
  const { store } = useContext(ConvertionRateContext);
  const [offerArray, setOfferArray] = useState<ExtendedOffer[]>([]);

  const prevOffers = usePrevious(offers);

  const itemPrice = (value: string, decimals: string) => {
    console.log("value", value);
    try {
      return utils.formatUnits(
        BigNumber.from(value.toString()),
        Number(decimals)
      );
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (offers && isSortable) {
      const sortedArray = offers.map((offer: Offer) => {
        const offerPrice = convertPrice({
          price: itemPrice(offer.price, offer.exchangeToken.decimals),
          symbol: offer.exchangeToken.symbol.toUpperCase(),
          currency: CONFIG.defaultCurrency,
          rates: store.rates,
          fixed: 8
        });

        return { ...offer, convertedPrice: offerPrice.converted };
      });

      if (order === "desc") {
        setOfferArray(
          sortedArray.sort((a, b) => {
            if (a.convertedPrice && b.convertedPrice) {
              return a.convertedPrice > b.convertedPrice
                ? 1
                : b.convertedPrice > a.convertedPrice
                ? -1
                : 0;
            }
            return 0;
          }) as ExtendedOffer[]
        );
      }

      if (order === "asc") {
        setOfferArray(
          sortedArray.sort((a, b) => {
            if (a.convertedPrice && b.convertedPrice) {
              return a.convertedPrice < b.convertedPrice
                ? 1
                : b.convertedPrice < a.convertedPrice
                ? -1
                : 0;
            }
            return 0;
          }) as ExtendedOffer[]
        );
      }
    } else if (offers) {
      setOfferArray(offers);
    }
  }, [isSortable, order, offers, prevOffers, store.rates]);
  return { offerArray };
};
