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

  let validFromDate_lte: string | null = null;
  const validFromDate_gte: string | null = null;
  const validUntilDate_lte: string | null = null;
  let validUntilDate_gte: string | null = null;

  if (props.valid) {
    validFromDate_lte = now + "";
    validUntilDate_gte = now + "";
  }

  const variables = {
    validFromDate_lte: validFromDate_lte,
    validFromDate_gte: validFromDate_gte,
    validUntilDate_lte: validUntilDate_lte,
    validUntilDate_gte: validUntilDate_gte,
    name_contains_nocase: props.name || "",
    exchangeToken: props.exchangeTokenAddress,
    seller: props.sellerId,
    orderBy: props.orderBy || "name",
    orderDirection: props.orderDirection || "asc",
    quantityAvailable_lte: props.quantityAvailable_lte,
    quantityAvailable_gte: props.quantityAvailable_gte,
    type: props.type,
    sellerCurationList: props?.sellerCurationList || [],
    offerCurationList: props.offerCurationList || [],
    first: props.first,
    skip: props.skip,
    voided: props.voided
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
    quantityAvailable_gte: ![null, undefined].includes(
      props.quantityAvailable_gte as null
    ),
    offer: false,
    voided: props.voided === true || props.voided === false
  };

  console.log(
    "🚀  roberto --  ~ file: getOffers.ts ~ line 65 ~ getOffers ~ variables",
    variables
  );
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

  console.log(
    "🚀  roberto --  ~ file: getOffers.ts ~ line 113 ~ variables",
    variables
  );
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

  console.log(
    "🚀  roberto --  ~ file: getOffers.ts ~ line 120 ~ sellerCurationList",
    sellerCurationList
  );
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
    offerCurationListResult,
    props?.disableMemo || false
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
