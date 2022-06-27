import { Offer } from "../types/offer";

export function isAccountSeller(offer: Offer, account: string): boolean {
  if (offer.seller.clerk.toLowerCase() === account.toLowerCase()) return true;
  return offer.seller.operator.toLowerCase() === account.toLowerCase();
}
