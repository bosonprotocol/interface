import dayjs from "dayjs";

import { fetchSubgraph } from "../../core-components/subgraph";
import { buildGetOffersQuery } from "./graphql";
import { memoMergeAndSortOffers } from "./memo";
import {
  CurationListGetOffersResult,
  UseOfferProps,
  UseOffersProps
} from "./types";

const memoizedMergeAndSortOffers = memoMergeAndSortOffers();

export const getOffers = async (props: UseOffersProps) => {
  const dateNow = Date.now();
  const now = Math.floor(dateNow / 1000);
  const in10days =
    dayjs(dateNow).add(10, "day").startOf("day").toDate().getTime() / 1000;

  const validFromDate_lte =
    props.type !== "soon" && props.valid ? now + "" : null;
  const validFromDate_gte = props.type === "soon" ? now + "" : null;
  const validUntilDate_lte = props.type === "hot" ? in10days + "" : null;
  const validUntilDate_gte = validUntilDate_lte
    ? null
    : props.type !== "soon" && props.valid
    ? now + ""
    : null;

  const variables = {
    validFromDate_lte: validFromDate_lte,
    validFromDate_gte: validFromDate_gte,
    validUntilDate_lte: validUntilDate_lte,
    validUntilDate_gte: validUntilDate_gte,
    name_contains_nocase: props.name || "",
    exchangeToken: props.exchangeTokenAddress,
    seller: props.sellerId,
    orderBy: "name",
    orderDirection: "asc",
    quantityAvailable_lte: props.quantityAvailable_lte,
    type: props.type,
    sellerCurationList: props.sellerCurationList || [],
    offerCurationList: props.offerCurationList || [],
    first: props.first,
    skip: props.skip
  };

  const getOffersQueryArgs = {
    exchangeToken: !!props.exchangeTokenAddress,
    sellerId: !!props.sellerId,
    validFromDate_lte: !!validFromDate_lte,
    validFromDate_gte: !!validFromDate_gte,
    validUntilDate_lte: !!validUntilDate_lte,
    validUntilDate_gte: !!validUntilDate_gte,
    skip: !!props.skip,
    quantityAvailable_lte: ![null, undefined].includes(
      props.quantityAvailable_lte as null
    ),
    offer: false
  };

  return fetchCurationListOffers(props, getOffersQueryArgs, variables);
};

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
    offerCurationList: props.offerCurationList || []
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
    offer: true
  };

  const [offer] = await fetchCurationListOffers(
    props,
    getOffersQueryArgs,
    variables
  );
  return offer;
}

async function fetchCurationListOffers(
  props: UseOffersProps,
  getOffersQueryArgs: Omit<
    Parameters<typeof buildGetOffersQuery>[0],
    "sellerCurationList" | "offerCurationList"
  >,
  queryVars: Record<string, unknown>
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
