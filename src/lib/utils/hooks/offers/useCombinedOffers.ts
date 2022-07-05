import { offers, subgraph } from "@bosonprotocol/core-sdk";
import { useInfiniteQuery, useQuery } from "react-query";

import { CONFIG } from "../../../config";
import { Offer } from "../../../types/offer";
import { checkOfferMetadata } from "../../validators";

export function useCombinedOffers(
  queryOffersArgs: subgraph.GetOffersQueryQueryVariables,
  options: {
    enabled?: boolean;
  } = {}
) {
  return useQuery(
    ["offers", "combined", queryOffersArgs],
    () => {
      return getCombinedOffers(queryOffersArgs);
    },
    options
  );
}

export function useInfiniteCombinedOffers(
  queryOffersArgs: subgraph.GetOffersQueryQueryVariables,
  options: {
    enabled?: boolean;
    keepPreviousData?: boolean;
  } = {}
) {
  return useInfiniteQuery(
    ["offers", "combined", "infinite", queryOffersArgs],
    (context) => {
      return getCombinedOffers({
        ...queryOffersArgs,
        offersSkip: context.pageParam
      });
    },
    options
  );
}

async function getCombinedOffers(
  queryOffersArgs: subgraph.GetOffersQueryQueryVariables
) {
  const { offersFilter, ...rest } = queryOffersArgs;
  const [sellerWhitelistOffers, offerWhitelistOffers] = await Promise.all([
    offers.subgraph.getOffers(CONFIG.subgraphUrl, {
      offersFilter: {
        seller_in: CONFIG.enableWhitelists ? CONFIG.sellerWhitelist : undefined,
        ...offersFilter
      },
      ...rest
    }),
    offers.subgraph.getOffers(CONFIG.subgraphUrl, {
      offersFilter: {
        id_in: CONFIG.enableWhitelists ? CONFIG.offerWhitelist : undefined,
        ...offersFilter
      },
      ...rest
    })
  ]);

  return mergeAndSortWhitelistOffers(
    sellerWhitelistOffers,
    offerWhitelistOffers
  );
}

function mergeAndSortWhitelistOffers(
  sellerWhitelistOffers: subgraph.OfferFieldsFragment[],
  offerWhitelistOffers: subgraph.OfferFieldsFragment[]
): Offer[] {
  const mergedOffers = [...sellerWhitelistOffers, ...offerWhitelistOffers].map(
    (offer) => {
      const isValid = checkOfferMetadata(offer);
      return {
        ...offer,
        metadata: {
          ...offer.metadata,
          imageUrl: `https://picsum.photos/seed/${offer.id}/700`
        },
        isValid
      } as Offer;
    }
  );
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

  return sortedOffers;
}
