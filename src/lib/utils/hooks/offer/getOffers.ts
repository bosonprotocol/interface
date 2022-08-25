import { fetchSubgraph } from "../../core-components/subgraph";
import { buildGetOffersQuery } from "./graphql";
import { memoMergeAndSortOffers } from "./memo";
import {
  CurationListGetOffersResult,
  UseOfferProps,
  UseOffersProps
} from "./types";
const memoizedMergeAndSortOffers = memoMergeAndSortOffers();

export async function getOfferById(
  id: string,
  props: Omit<UseOfferProps, "offerId">
) {
  const now = Math.floor(Date.now() / 1000);
  const validFromDate_lte = props.valid ? now + "" : null;
  const validUntilDate_gte = props.valid ? now + "" : null;

  const variables = {
    offer: id,
    validFromDate_lte: validFromDate_lte,
    validUntilDate_gte: validUntilDate_gte,
    name_contains_nocase: props.name || "",
    exchangeToken: props.exchangeTokenAddress,
    sellerId: props.sellerId,
    sellerCurationList: props.sellerCurationList || [],
    offerCurationList: props.offerCurationList || [],
    voided: props.voided
  };

  const getOffersQueryArgs = {
    exchangeToken: !!props.exchangeTokenAddress,
    sellerId: !!props.sellerId,
    validFromDate_lte: !!validFromDate_lte,
    validFromDate_gte: false,
    validUntilDate_lte: false,
    validUntilDate_gte: !!validUntilDate_gte,
    skip: false,
    quantityAvailable_lte: false,
    quantityAvailable_gte: false,
    offer: true,
    voided: props.voided === true || props.voided === false
  };

  const [offer] = await fetchCurationListOffers(
    props,
    getOffersQueryArgs,
    variables,
    id
  );

  return offer;
}

async function fetchCurationListOffers(
  props: UseOffersProps,
  getOffersQueryArgs: Omit<
    Parameters<typeof buildGetOffersQuery>[0],
    "sellerCurationList" | "offerCurationList"
  >,
  queryVars: Record<string, unknown>,
  offerId?: string
) {
  const sellerCurationList = props.enableCurationLists
    ? props.sellerCurationList || []
    : null;

  const offerCurationList = props.enableCurationLists
    ? props.offerCurationList || []
    : null;

  const getSellerCurationListOffersQuery = buildGetOffersQuery({
    ...getOffersQueryArgs,
    sellerCurationList: !!sellerCurationList,
    offerCurationList: false
  });
  const getOfferCurationListOffersQuery = buildGetOffersQuery({
    ...getOffersQueryArgs,
    sellerCurationList: false,
    offerCurationList: !!offerCurationList
  });
  const [sellerCurationListResult, offerCurationListResult] = await Promise.all(
    [
      fetchSubgraph<CurationListGetOffersResult>(
        getSellerCurationListOffersQuery,
        queryVars
      ),
      fetchSubgraph<CurationListGetOffersResult>(
        getOfferCurationListOffersQuery,
        queryVars
      )
    ]
  );

  const offers = memoizedMergeAndSortOffers(
    getMergedAndSortedCacheKey(props),
    sellerCurationListResult,
    offerCurationListResult
  );

  if (offerId) {
    const newOffer = offers.find((offer) => offer.id === offerId);
    return newOffer ? [newOffer] : [];
  }

  return offers.slice(props.skip, getOffersSliceEnd(props.skip, props.first));
}

function getOffersSliceEnd(skip?: number, first?: number) {
  if (skip && first) {
    return skip + first;
  }

  if (!skip && first) {
    return first;
  }

  return undefined;
}

function getMergedAndSortedCacheKey(props: UseOffersProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { first, skip, ...rest } = props;
  return JSON.stringify(rest);
}
