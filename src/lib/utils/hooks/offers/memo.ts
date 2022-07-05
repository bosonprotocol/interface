import { Offer } from "../../../types/offer";
import { checkOfferMetadata } from "../../validators";
import { WhitelistGetOffersResult } from "./types";

export function memoMergeAndSortOffers() {
  const cache: Record<string, Offer[]> = {};

  function mergeAndSortWhitelistResults(
    cacheKey: string,
    sellerWhitelistResult: WhitelistGetOffersResult,
    offerWhitelistResult: WhitelistGetOffersResult
  ): Offer[] {
    const cachedOffers = cache[cacheKey] || [];
    const sellerWhitelistOffers =
      sellerWhitelistResult?.baseMetadataEntities || [];
    const offerWhitelistOffers =
      offerWhitelistResult?.baseMetadataEntities || [];

    const mergedOffers = [
      ...sellerWhitelistOffers,
      ...offerWhitelistOffers
    ].map((base) => {
      const isValid = checkOfferMetadata(base.offer);
      return {
        ...base.offer,
        metadata: {
          ...base.offer.metadata,
          imageUrl: `https://picsum.photos/seed/${base.offer.id}/700`
        },
        isValid
      } as Offer;
    });
    const ids = [...cachedOffers, ...mergedOffers].map((offer) =>
      Number(offer.id)
    );
    const uniqueOffers = mergedOffers.filter(
      (offer, index) => !ids.includes(Number(offer.id), index + 1)
    );
    const sortedOffers = [...cachedOffers, ...uniqueOffers].sort((a, b) => {
      if (a.metadata.name && b.metadata.name) {
        return a.metadata.name.localeCompare(b.metadata.name);
      }
      return 0;
    });

    cache[cacheKey] = sortedOffers;

    return sortedOffers;
  }

  return mergeAndSortWhitelistResults;
}
