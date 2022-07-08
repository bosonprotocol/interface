import dayjs from "dayjs";

import { fetchSubgraph } from "../../core-components/subgraph";
import { buildGetOffersQuery } from "./graphql";
import { memoMergeAndSortOffers } from "./memo";
import {
  UseOfferProps,
  UseOffersProps,
  WhitelistGetOffersResult
} from "./types";

const memoizedMergeAndSortOffers = memoMergeAndSortOffers();

export const getOffers = async (props: UseOffersProps) => {
  const dateNow = Date.now();
  const now = Math.floor(dateNow / 1000);
  const in10days =
    dayjs(dateNow).add(10, "day").startOf("day").toDate().getTime() / 1000;

  let validFromDate_lte: string | null = null;
  let validFromDate_gte: string | null = null;
  let validUntilDate_lte: string | null = null;
  let validUntilDate_gte: string | null = null;

  if (props.type) {
    if (props.type === "hot") {
      validFromDate_gte = now + "";
      validUntilDate_lte = in10days + "";
    } else if (props.type === "gone") {
      validFromDate_lte = now + "";
      validUntilDate_gte = now + "";
    } else if (props.type === "soon") {
      validFromDate_gte = now + "";
    } else {
      throw new Error(`type not supported=${props.type}`);
    }
  } else {
    if (props.valid) {
      validFromDate_lte = now + "";
      validUntilDate_gte = now + "";
    } else {
      // TODO: is there a use case for this?
    }
  }

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
    sellerWhitelist: props.sellerWhitelist || [],
    offerWhitelist: props.offerWhitelist || [],
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

  return fetchWhitelistOffers(props, getOffersQueryArgs, variables);
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
    sellerWhitelist: props.sellerWhitelist || [],
    offerWhitelist: props.offerWhitelist || []
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

  const [offer] = await fetchWhitelistOffers(
    props,
    getOffersQueryArgs,
    variables
  );
  return offer;
}

async function fetchWhitelistOffers(
  props: UseOffersProps,
  getOffersQueryArgs: Omit<
    Parameters<typeof buildGetOffersQuery>[0],
    "sellerWhitelist" | "offerWhitelist"
  >,
  queryVars: Record<string, unknown>
) {
  const sellerWhitelist = props.enableWhitelists
    ? props.sellerWhitelist || []
    : null;
  const offerWhitelist = props.enableWhitelists
    ? props.offerWhitelist || []
    : null;

  const getSellerWhitelistOffersQuery = buildGetOffersQuery({
    ...getOffersQueryArgs,
    sellerWhitelist: !!sellerWhitelist,
    offerWhitelist: false
  });
  const getOfferWhitelistOffersQuery = buildGetOffersQuery({
    ...getOffersQueryArgs,
    sellerWhitelist: false,
    offerWhitelist: !!offerWhitelist
  });

  const [sellerWhitelistResult, offerWhitelistResult] = await Promise.all([
    fetchSubgraph<WhitelistGetOffersResult>(
      getSellerWhitelistOffersQuery,
      queryVars
    ),
    fetchSubgraph<WhitelistGetOffersResult>(
      getOfferWhitelistOffersQuery,
      queryVars
    )
  ]);

  const offers = memoizedMergeAndSortOffers(
    getMergedAndSortedCacheKey(props),
    sellerWhitelistResult,
    offerWhitelistResult
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
