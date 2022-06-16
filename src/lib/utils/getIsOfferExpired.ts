import { Offer } from "../types/offer";

export const getIsOfferExpired = (offer: Offer) => {
  const now = Date.now() / 1000;
  const isExpired = !(
    Number(offer?.validFromDate) <= now && now <= Number(offer?.validUntilDate)
  );
  return isExpired;
};
