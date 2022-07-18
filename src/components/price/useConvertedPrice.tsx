import { BigNumber, utils } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CONFIG } from "../../lib/config";
import {
  convertPrice,
  IPrice,
  IPricePassedAsAProp
} from "../../lib/utils/convertPrice";

interface Props {
  value: string;
  decimals: string;
}
export const useConvertedPrice = ({ value, decimals }: Props): IPrice => {
  const [convertedPrice, setConvertedPrice] =
    useState<IPricePassedAsAProp | null>(null);

  const price = useMemo(() => {
    try {
      return utils.formatUnits(BigNumber.from(value), Number(decimals));
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [value, decimals]);

  const getConvertedPrice = useCallback(async () => {
    const newPrice = await convertPrice(price, CONFIG.defaultCurrency);
    setConvertedPrice(newPrice);
  }, [price]);

  useEffect(() => {
    getConvertedPrice();
    const interval = setInterval(() => {
      getConvertedPrice();
    }, 1000 * 60); // It will update USD price every minute;
    return () => clearInterval(interval);
  }, [getConvertedPrice]);

  return {
    price,
    ...convertedPrice
  };
};
