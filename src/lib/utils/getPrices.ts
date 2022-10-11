import { Offer } from "../types/offer";
import { IPrice } from "./convertPrice";

export const getBuyerCancelPenalty = (
  offer: Offer,
  convertedPrice: IPrice | null
) => {
  const priceNumber = Number(convertedPrice?.converted);

  const buyerCancelationPenaltyPercentage =
    priceNumber === 0
      ? 0
      : Number(offer.buyerCancelPenalty) / Number(offer.price);
  const buyerCancelationPenalty = buyerCancelationPenaltyPercentage * 100;
  const convertedBuyerCancelationPenalty =
    priceNumber === 0
      ? 0
      : (buyerCancelationPenaltyPercentage * priceNumber).toFixed(2);
  return {
    buyerCancelationPenalty,
    convertedBuyerCancelationPenalty
  };
};
