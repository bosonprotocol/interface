import { Offer } from "../../../types/offer";

interface CommonProps {
  name?: string; // TODO: to delete once brand is supported
  brand?: string; // TODO: not supported yet
  voided?: boolean;
  valid?: boolean;
  exchangeTokenAddress?: Offer["exchangeToken"]["address"];
  sellerId?: Offer["seller"]["id"];
  first?: number;
  skip?: number;
  quantityAvailable_lte?: number | null | undefined;
}

export interface UseOffersProps extends CommonProps {
  type?: "featured" | "hot" | "soon" | undefined;
}
export interface UseOfferProps extends CommonProps {
  offerId: string;
}
