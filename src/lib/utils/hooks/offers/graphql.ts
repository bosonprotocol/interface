import { gql } from "graphql-request";

export const offerGraphQl = gql`
  {
    id
    createdAt
    price
    metadataHash
    sellerDeposit
    fulfillmentPeriodDuration
    metadataUri
    buyerCancelPenalty
    quantityAvailable
    quantityInitial
    validFromDate
    validUntilDate
    voidedAt
    voucherValidDuration
    seller {
      id
      admin
      clerk
      treasury
      operator
      active
    }
    exchangeToken {
      address
      decimals
      name
      symbol
    }
    metadata {
      name
      description
      externalUrl
      schemaUrl
      type
    }
  }
`;

export function buildGetOffersQuery({
  exchangeToken,
  sellerId,
  validFromDate_lte,
  validFromDate_gte,
  validUntilDate_lte,
  validUntilDate_gte,
  skip,
  offer,
  quantityAvailable_lte,
  quantityAvailable_gte,
  sellerCurationList,
  offerCurationList
}: {
  exchangeToken: boolean;
  sellerId: boolean;
  validFromDate_lte: boolean;
  validFromDate_gte: boolean;
  validUntilDate_lte: boolean;
  validUntilDate_gte: boolean;
  skip: boolean;
  offer: boolean;
  quantityAvailable_lte: boolean;
  quantityAvailable_gte: boolean;
  sellerCurationList: boolean;
  offerCurationList: boolean;
}) {
  return gql`
  query GetOffers(
    $first: Int
    ${skip ? "$skip: Int" : ""}
    ${validFromDate_lte ? "$validFromDate_lte: String" : ""}
    ${validFromDate_gte ? "$validFromDate_gte: String" : ""}
    ${validUntilDate_lte ? "$validUntilDate_lte: String" : ""}
    ${validUntilDate_gte ? "$validUntilDate_gte: String" : ""}
    $name_contains_nocase: String
    ${exchangeToken ? "$exchangeToken: String" : ""}
    ${sellerId ? "$seller: String" : ""}
    $orderBy: String
    $orderDirection: String
    ${offer ? "$offer: String" : ""}
    ${quantityAvailable_lte ? "$quantityAvailable_lte: Int" : ""}
    ${quantityAvailable_gte ? "$quantityAvailable_gte: Int" : ""}
    ${sellerCurationList ? "$sellerCurationList: [String!]" : ""}
    ${offerCurationList ? "$offerCurationList: [String!]" : ""}
  ) {
    baseMetadataEntities(
      first: $first
      ${skip ? "skip : $skip" : ""}
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: {
        ${offer ? "offer: $offer" : ""}
        ${validFromDate_lte ? "validFromDate_lte: $validFromDate_lte" : ""}
        ${validFromDate_gte ? "validFromDate_gte: $validFromDate_gte" : ""}
        ${validUntilDate_lte ? "validUntilDate_lte: $validUntilDate_lte" : ""}
        ${validUntilDate_gte ? "validUntilDate_gte: $validUntilDate_gte" : ""}
        ${exchangeToken ? "exchangeToken: $exchangeToken" : ""}
        ${sellerId ? "seller: $seller" : ""}
        ${
          quantityAvailable_lte
            ? "quantityAvailable_lte: $quantityAvailable_lte"
            : ""
        }
        ${
          quantityAvailable_gte
            ? "quantityAvailable_gte: $quantityAvailable_gte"
            : ""
        }
        ${sellerCurationList ? "seller_in: $sellerCurationList" : ""}
        ${offerCurationList ? "offer_in: $offerCurationList" : ""}
        name_contains_nocase: $name_contains_nocase
      }
    ) {
      offer ${offerGraphQl}
    }
  }
`;
}
