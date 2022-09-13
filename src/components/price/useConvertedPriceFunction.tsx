import { BigNumber, utils } from "ethers";
import { useCallback, useContext } from "react";

import { CONFIG } from "../../lib/config";
import { convertPrice } from "../../lib/utils/convertPrice";
import ConvertionRateContext from "../convertion-rate/ConvertionRateContext";

export const useConvertedPriceFunction = () => {
  const { store } = useContext(ConvertionRateContext);

  const calcPrice = (value: any, decimals: any) => {
    try {
      return utils.formatUnits(BigNumber.from(value), Number(decimals));
    } catch (e) {
      console.error(e);
      return 0;
    }
  };

  const convert = useCallback(
    (offer: any): any => {
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
