import { BigNumber, utils } from "ethers";

import { Offer } from "../types/offer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const displayFloat = (value: any): string => {
  try {
    const parsedValue = value || 0;
    if (parsedValue > 0) {
      const valueToDisplay =
        parsedValue.toString().match(/^-?\d*\.?0*\d{0,2}/)?.[0] || 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((valueToDisplay as any) % 1 === 0) {
        return Number(parsedValue).toString();
      }
      return valueToDisplay;
    } else {
      return "0";
    }
  } catch (e) {
    console.error(e);
    return "0";
  }
};

export const calcPrice = (value: string, decimals: string) => {
  try {
    return utils.formatUnits(value, decimals);
  } catch (e) {
    console.error(e);
    return "";
  }
};

export const calcPercentage = (offer: Offer, key: string) => {
  try {
    const value = offer?.[key as keyof Offer] || "0";
    const percentage =
      (BigNumber.from(value).mul(1000000).div(offer.price).toNumber() /
        1000000) *
      100;
    const formatted = BigNumber.from(value).eq(0)
      ? "0"
      : utils.formatUnits(
          BigNumber.from(value),
          BigNumber.from(offer.exchangeToken.decimals)
        );

    console.log({
      offer,
      percentage,
      formatted,
      value
    });
    return {
      percentage: percentage || 0,
      deposit: displayFloat(percentage || 0),
      formatted: displayFloat(formatted)
    };
  } catch (e) {
    console.error(e);
    return {
      deposit: 0,
      percentage: 0,
      formatted: 0
    };
  }
};
