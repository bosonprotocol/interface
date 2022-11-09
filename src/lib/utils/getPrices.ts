import { BigNumber } from "ethers";

import { Offer } from "../types/offer";
import { calcPercentage } from "./calcPrice";

export const getBuyerCancelPenalty = (offer: Offer) => {
  try {
    const { deposit: buyerCancelationPenaltyPercentage, formatted } =
      calcPercentage(offer, "buyerCancelPenalty");
    const buyerCancelationPenaltyPrice =
      BigNumber.from(offer.price)
        .mul(BigNumber.from(buyerCancelationPenaltyPercentage))
        .toNumber() / 100;

    console.log({
      offer,
      buyerCancelationPenaltyPercentage,
      buyerCancelationPenaltyPrice,
      formatted
    });
    return {
      price: buyerCancelationPenaltyPrice,
      percentage: formatted
    };
  } catch (e) {
    console.error(e);
    return {
      price: 0,
      percentage: 0
    };
  }
};
