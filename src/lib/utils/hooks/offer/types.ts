import { Offer } from "../../../types/offer";

export type CurationListGetOffersResult = {
  productV1MetadataEntities?: { offer: Offer }[];
};

interface CommonProps {
  name?: string; // TODO: to delete once brand is supported
  brand?: string; // TODO: not supported yet
  voided?: boolean;
  valid?: boolean;
  exchangeTokenAddress?: Offer["exchangeToken"]["address"];
  sellerId?: Offer["seller"]["id"];
  first?: number;
  skip?: number;
  sellerCurationList?: string[];
  offerCurationList?: string[];
  enableCurationLists?: boolean;
  orderBy?: string;
  orderDirection?: "asc" | "desc" | undefined | null;
}

export interface UseOffersProps extends CommonProps {
  type?: "gone" | "hot" | "soon" | undefined;
  validUntilDate_lte?: number;
  quantityAvailable_lte?: number | null | undefined;
  quantityAvailable_gte?: number | null | undefined;
}
export interface UseOfferProps extends CommonProps {
  offerId: string;
}
