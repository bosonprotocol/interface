import { useCallback, useEffect, useState } from "react";

import { CONFIG } from "../../lib/config";
import { convertPrice, IPrice } from "../../lib/utils/convertPrice";

interface Props {
  value: string;
  decimals: string;
}

export const useConvertedPrice = ({ value, decimals }: Props) => {
  const [price, setPrice] = useState<IPrice | null>(null);

  const getConvertedPrice = useCallback(async () => {
    const newPrice = await convertPrice(
      value,
      decimals,
      CONFIG.defaultCurrency.ticker
    );
    setPrice(newPrice);
  }, [value, decimals]);

  useEffect(() => {
    getConvertedPrice();
    const interval = setInterval(() => {
      getConvertedPrice();
    }, 1000 * 60); // It will update USD price every minute;
    return () => clearInterval(interval);
  }, [getConvertedPrice]);

  return price;
};
