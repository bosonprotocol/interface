import { fetchSubgraph } from "../../core-components/subgraph";
import { getBuildGetOffersQuery } from "./graphql";
import { memoMergeAndSortOffers } from "./memo";
import { CurationListGetOffersResult, UseOffersProps } from "./types";

const memoizedMergeAndSortOffers = memoMergeAndSortOffers();

export const getOffers = async (
  subgraphUrl: string,
  disputeResolverId: string,
  props: UseOffersProps
) => {
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

  return fetchCurationListOffers(
    subgraphUrl,
    disputeResolverId,
    props,
    getOffersQueryArgs,
    variables
  );
};

async function fetchCurationListOffers(
  subgraphUrl: string,
  disputeResolverId: string,
  props: UseOffersProps,
  getOffersQueryArgs: Omit<
    Parameters<typeof buildGetOffersQuery>[0],
    "sellerCurationList" | "offerCurationList"
  >,
  queryVars: Record<string, unknown>,
  offerId?: string
) {
  const buildGetOffersQuery = getBuildGetOffersQuery(disputeResolverId);
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
      !sellerCurationList || sellerCurationList.length > 0
        ? fetchSubgraph<CurationListGetOffersResult>(
            subgraphUrl,
            getSellerCurationListOffersQuery,
            queryVars
          )
        : { productV1MetadataEntities: [] },
      !offerCurationList || offerCurationList.length > 0
        ? fetchSubgraph<CurationListGetOffersResult>(
            subgraphUrl,
            getOfferCurationListOffersQuery,
            queryVars
          )
        : { productV1MetadataEntities: [] }
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
