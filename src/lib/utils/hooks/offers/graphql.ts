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

export function getOffersQuery({
  exchangeToken,
  sellerId,
  validFromDate_lte,
  validFromDate_gte,
  validUntilDate_gte,
  quantityAvailable_lte,
  skip,
  offer
}: {
  exchangeToken: boolean;
  sellerId: boolean;
  validFromDate_lte: boolean;
  validFromDate_gte: boolean;
  validUntilDate_gte: boolean;
  quantityAvailable_lte: boolean;
  skip: boolean;
  offer: boolean;
}) {
  return gql`
  query GetOffers(
    $first: Int
    ${skip ? "$skip: Int" : ""}
    ${validFromDate_lte ? "$validFromDate_lte: String" : ""}
    ${validFromDate_gte ? "$validFromDate_gte: String" : ""}
    ${validUntilDate_gte ? "$validUntilDate_gte: String" : ""}
    $name_contains_nocase: String
    ${exchangeToken ? "$exchangeToken: String" : ""}
    ${sellerId ? "$seller: String" : ""}
    $orderBy: String
    $orderDirection: String
    ${quantityAvailable_lte ? "$quantityAvailable_lte: Int" : ""}
    ${offer ? "$offer: String" : ""}
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
        ${validUntilDate_gte ? "validUntilDate_gte: $validUntilDate_gte" : ""}
        ${
          quantityAvailable_lte
            ? "quantityAvailable_lte: $quantityAvailable_lte"
            : ""
        }
        ${exchangeToken ? "exchangeToken: $exchangeToken" : ""}
        ${sellerId ? "seller: $seller" : ""}
        name_contains_nocase: $name_contains_nocase
      }
    ) {
      offer ${offerGraphQl}
    }
  }
`;
}
