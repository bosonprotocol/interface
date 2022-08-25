import { offers, subgraph } from "@bosonprotocol/react-kit";
import { useInfiniteQuery, useQuery } from "react-query";

import { CONFIG } from "../../../config";
import { Offer } from "../../../types/offer";

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
  const [sellerCurationListOffers, offerCurationListOffers] = await Promise.all(
    [
      offers.subgraph.getOffers(CONFIG.subgraphUrl, {
        offersFilter: {
          seller_in: CONFIG.enableCurationLists
            ? CONFIG.sellerCurationList
            : undefined,
          ...offersFilter
        },
        ...rest
      }),
      offers.subgraph.getOffers(CONFIG.subgraphUrl, {
        offersFilter: {
          id_in: CONFIG.enableCurationLists
            ? CONFIG.offerCurationList
            : undefined,
          ...offersFilter
        },
        ...rest
      })
    ]
  );

  return mergeAndSortCurationListOffers(
    sellerCurationListOffers,
    offerCurationListOffers
  );
}

function mergeAndSortCurationListOffers(
  sellerCurationListOffers: subgraph.OfferFieldsFragment[],
  offerCurationListOffers: subgraph.OfferFieldsFragment[]
): Offer[] {
  const mergedOffers = [
    ...sellerCurationListOffers,
    ...offerCurationListOffers
  ].map((offer) => {
    return {
      ...offer,
      metadata: {
        ...offer.metadata,
        imageUrl: `https://picsum.photos/seed/${offer.id}/700`
      }
    } as Offer;
  });
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
