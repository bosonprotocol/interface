import { Offer } from "../../../../lib/types/offer";

export interface UseOffersProps {
  name?: string; // TODO: to delete once brand is supported
  brand?: string; // TODO: not supported yet
  voided?: boolean;
  valid?: boolean;
  exchangeTokenAddress?: Offer["exchangeToken"]["address"];
  sellerId?: Offer["seller"]["id"];
  filterOutWrongMetadata?: boolean;
  first?: number;
  skip?: number;
}
export interface UseOfferProps extends UseOffersProps {
  offerId: string;
}
