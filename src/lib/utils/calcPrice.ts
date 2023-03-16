import { BigNumber, utils } from "ethers";

import { CONFIG } from "../config";
import { Offer } from "../types/offer";

interface Options {
  fixed?: number;
}

export const displayFloat = (
  value: number | string | null | undefined,
  { fixed }: Options = {}
): string => {
  try {
    const parsedValue = value || 0;
    if (typeof parsedValue === "string" || parsedValue > 0) {
      const currencySymbolIndex = parsedValue
        .toString()
        .indexOf(CONFIG.defaultCurrency.symbol);
      const addSymbol = (value: string) => {
        return currencySymbolIndex === -1
          ? value
          : currencySymbolIndex === 0
          ? `${CONFIG.defaultCurrency.symbol} ${value}`
          : `${value} ${CONFIG.defaultCurrency.symbol}`;
      };
      const valueToDisplay =
        parsedValue
          .toString()
          .replaceAll(CONFIG.defaultCurrency.symbol, "")
          .trim()
          .match(
            new RegExp(
              `^-?\\d*\\.?0*\\d{0,${fixed === undefined ? "" : fixed}}`
            )
          )?.[0] || "0";

      const isInteger = Number(valueToDisplay) % 1 === 0;
      if (isInteger) {
        return addSymbol(Number(parsedValue).toString());
      }
      return fixed !== undefined
        ? Number(valueToDisplay).toFixed(fixed) === (0).toFixed(fixed)
          ? addSymbol(`<${10 ** -fixed}`)
          : addSymbol(Number(valueToDisplay).toFixed(fixed))
        : addSymbol(valueToDisplay + "");
    }
    return "0";
  } catch (e) {
    console.error(e);
    return "0";
  }
};

export const calcPrice = (value: string, decimals: string): string => {
  try {
    return utils.formatUnits(value, decimals);
  } catch (e) {
    console.error(e);
    return "";
  }
};

interface CalcPercentage {
  percentage: number;
  deposit: string;
  formatted: string;
}
const MUL_VALUE = 100_000_000;
export const calcPercentage = (offer: Offer, key: string): CalcPercentage => {
  try {
    const value = offer?.[key as keyof Offer] || "0";
    const formatted = BigNumber.from(value).eq(0)
      ? "0"
      : utils.formatUnits(
          BigNumber.from(value),
          BigNumber.from(offer.exchangeToken.decimals)
        );

    const percentage =
      offer.price === "0"
        ? 0
        : (BigNumber.from(value).mul(MUL_VALUE).div(offer.price).toNumber() /
            MUL_VALUE) *
          100;

    return {
      percentage: percentage || 0,
      deposit: displayFloat(percentage || 0),
      formatted
    };
  } catch (e) {
    console.error(e);
    return {
      percentage: 0,
      deposit: "0",
      formatted: "0"
    };
  }
};
