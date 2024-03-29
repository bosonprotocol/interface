import { useContext, useEffect, useMemo, useState } from "react";

import { CONFIG } from "../../lib/config";
import { calcPrice } from "../../lib/utils/calcPrice";
import {
  convertPrice,
  IPrice,
  IPricePassedAsAProp
} from "../../lib/utils/convertPrice";
import ConvertionRateContext from "../convertion-rate/ConvertionRateContext";

interface Props {
  value: string;
  decimals: string;
  symbol: string;
}
export const useConvertedPrice = ({
  value,
  decimals,
  symbol
}: Props): IPrice => {
  const { store } = useContext(ConvertionRateContext);
  const [convertedPrice, setConvertedPrice] =
    useState<IPricePassedAsAProp | null>(null);

  const price = useMemo(() => calcPrice(value, decimals), [value, decimals]);

  useEffect(() => {
    const newPrice = convertPrice({
      price,
      symbol: symbol.toUpperCase(),
      currency: CONFIG.defaultCurrency,
      rates: store.rates,
      fixed: store.fixed
    });
    setConvertedPrice(newPrice);
  }, [price, symbol, store]);

  return {
    price,
    ...convertedPrice
  };
};
