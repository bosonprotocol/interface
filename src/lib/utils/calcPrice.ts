import { BigNumber, utils } from "ethers";

import { Offer } from "../types/offer";

export const displayFloat = (value: number | string | null | undefined) => {
  try {
    const parsedValue = value || 0;
    if (parsedValue > 0) {
      const valueToDisplay =
        parsedValue.toString().match(/^-?\d*\.?0*\d{0,2}/)?.[0] || 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((valueToDisplay as any) % 1 === 0) {
        return Number(parsedValue);
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
    return utils.formatUnits(BigNumber.from(value), BigNumber.from(decimals));
  } catch (e) {
    console.error(e);
    return "";
  }
};

export const calcPercentage = (offer: Offer, key: string) => {
  try {
    const value = offer?.[key as keyof Offer] || 0;
    const percentage = Number(Number(value) / Number(offer?.price || 0)) || 0;
    const deposit = percentage * 100;
    const formatted =
      Number(value) === 0
        ? 0
        : utils.formatUnits(
            BigNumber.from(value),
            BigNumber.from(offer.exchangeToken.decimals)
          );

    return {
      deposit: displayFloat(deposit),
      percentage,
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
