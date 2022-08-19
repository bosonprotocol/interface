import { Offer } from "../../../types/offer";
import { checkOfferMetadata } from "../../validators";
import { getOfferImage } from "./placeholders";
import { CurationListGetOffersResult } from "./types";

export function memoMergeAndSortOffers() {
  const cache: Record<string, Offer[]> = {};

  function mergeAndSortCurationListResults(
    cacheKey: string,
    sellerCurationListResult: CurationListGetOffersResult,
    offerCurationListResult: CurationListGetOffersResult
  ): Offer[] {
    const cachedOffers = cache[cacheKey] || [];
    const sellerCurationListOffers =
      sellerCurationListResult?.productV1MetadataEntities || [];
    const offerCurationListOffers =
      offerCurationListResult?.productV1MetadataEntities || [];

    const mergedCurationListOffers = [
      ...sellerCurationListOffers,
      ...offerCurationListOffers
    ].map((base) => {
      const isValid = checkOfferMetadata(base.offer);
      return {
        ...base.offer,
        metadata: {
          ...base.offer.metadata,
          imageUrl: getOfferImage(base.offer.id, base.offer.metadata.name)
        },
        isValid
      } as Offer;
    });
    const mergedOffers = [...cachedOffers, ...mergedCurationListOffers];
    const ids = mergedOffers.map((offer) => Number(offer.id));
    const uniqueOffers = mergedOffers.filter(
      (offer, index) => !ids.includes(Number(offer.id), index + 1)
    );
    const sortedOffers = uniqueOffers.sort((a, b) => {
      if (a.metadata.name && b.metadata.name) {
        return a.metadata.name.localeCompare(b.metadata.name);
      }
      return 0;
    });

    cache[cacheKey] = sortedOffers;

    console.log("sellerCurationListOffers", sellerCurationListOffers);
    console.log("offerCurationListOffers", offerCurationListOffers);
    console.log("merged", mergedOffers);
    console.log("ids", ids);
    console.log("uniqueOffers", uniqueOffers);
    console.log("cache", cache);
    console.log("sorted", sortedOffers);

    return sortedOffers;
  }

  return mergeAndSortCurationListResults;
}
