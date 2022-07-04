import dayjs from "dayjs";

import { Offer } from "../../../types/offer";
import { fetchSubgraph } from "../../core-components/subgraph";
import { checkOfferMetadata } from "../../validators";
import { buildGetOffersQuery } from "./graphql";
import { UseOfferProps, UseOffersProps } from "./types";

type WhitelistGetOffersResult = {
  baseMetadataEntities: { offer: Offer }[];
};

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
    first: props.first,
    skip: props.skip,
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
    sellerWhitelist: props.sellerWhitelist,
    offerWhitelist: props.offerWhitelist
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
    sellerWhitelist: props.sellerWhitelist,
    offerWhitelist: props.offerWhitelist
  };

  const getOffersQueryArgs = {
    exchangeToken: !!props.exchangeTokenAddress,
    sellerId: !!props.sellerId,
    validFromDate_lte: !!validFromDate_lte,
    validFromDate_gte: false,
    validUntilDate_lte: false,
    validUntilDate_gte: !!validUntilDate_gte,
    skip: !!props.skip,
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
  const sellerWhitelist = props.enableWhitelists ? props.sellerWhitelist : null;
  const offerWhitelist = props.enableWhitelists ? props.offerWhitelist : null;

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

  const offers = await mergeAndSortWhitelistResults(
    sellerWhitelistResult,
    offerWhitelistResult
  );

  // TODO: find proper way to paginate
  return offers.slice(0, props.first);
}

function mergeAndSortWhitelistResults(
  sellerWhitelistResult: WhitelistGetOffersResult,
  offerWhitelistResult: WhitelistGetOffersResult
): Offer[] {
  const sellerWhitelistOffers =
    sellerWhitelistResult?.baseMetadataEntities || [];
  const offerWhitelistOffers = offerWhitelistResult?.baseMetadataEntities || [];

  const mergedOffers = [...sellerWhitelistOffers, ...offerWhitelistOffers].map(
    (base) => {
      const isValid = checkOfferMetadata(base.offer);
      return {
        ...base.offer,
        metadata: {
          ...base.offer.metadata,
          imageUrl: `https://picsum.photos/seed/${base.offer.id}/700`
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
