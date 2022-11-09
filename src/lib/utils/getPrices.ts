import { BigNumber } from "ethers";

import { Offer } from "../types/offer";
import { IPrice } from "./convertPrice";

export const getBuyerCancelPenalty = (
  offer: Offer,
  convertedPrice: IPrice | null
) => {
  try {
    const priceNumber = Number(convertedPrice?.converted) || 0;
    const buyerCancelationPenaltyPercentage =
      Number(
        Number(offer?.buyerCancelPenalty || 0) / Number(offer?.price || 0)
      ) || 0;
    const buyerCancelationPenalty = BigNumber.from(
      buyerCancelationPenaltyPercentage
    ).mul(100);
    const convertedBuyerCancelationPenalty =
      priceNumber === 0
        ? BigNumber.from(0)
        : BigNumber.from(buyerCancelationPenaltyPercentage).mul(priceNumber);

    return {
      buyerCancelationPenalty: buyerCancelationPenalty.toNumber(),
      convertedBuyerCancelationPenalty:
        convertedBuyerCancelationPenalty.toNumber()
    };
  } catch (e) {
    console.error(e);
    return {
      buyerCancelationPenalty: 0,
      convertedBuyerCancelationPenalty: 0
    };
  }
};
