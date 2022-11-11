import { useCallback, useContext } from "react";

import { CONFIG } from "../../lib/config";
import { Offer } from "../../lib/types/offer";
import { calcPrice } from "../../lib/utils/calcPrice";
import {
  convertPrice,
  IPricePassedAsAProp
} from "../../lib/utils/convertPrice";
import ConvertionRateContext from "../convertion-rate/ConvertionRateContext";

export const useConvertedPriceFunction = () => {
  const { store } = useContext(ConvertionRateContext);

  const convert = useCallback(
    (offer: Offer): IPricePassedAsAProp | null => {
      const price = calcPrice(offer?.price, offer?.exchangeToken?.decimals);

      return convertPrice({
        price: price.toString(),
        symbol: offer?.exchangeToken?.symbol?.toUpperCase(),
        currency: CONFIG.defaultCurrency,
        rates: store.rates,
        fixed: store.fixed
      });
    },
    [store]
  );

  return convert;
};
