import { gql } from "graphql-request";

export function getOffersQuery({
  exchangeToken,
  validFromDate_lte,
  validUntilDate_gte,
  skip,
  offer
}: {
  exchangeToken: boolean;
  validFromDate_lte: boolean;
  validUntilDate_gte: boolean;
  skip: boolean;
  offer: boolean;
}) {
  return gql`
  query GetOffers(
    $first: Int
    ${skip ? "$skip: Int" : ""}
    ${validFromDate_lte ? "$validFromDate_lte: String" : ""}
    ${validUntilDate_gte ? "$validUntilDate_gte: String" : ""}
    $name_contains_nocase: String
    ${exchangeToken ? "$exchangeToken: String" : ""}
    $orderBy: String
    $orderDirection: String
    ${offer ? "$offer: String" : ""}
  ) {
    baseMetadataEntities(
      first: $first
      ${skip ? "skip : $skip" : ""}
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: {
        ${offer ? "offer : $offer" : ""}
        ${validFromDate_lte ? "validFromDate_lte : $validFromDate_lte" : ""}
        ${validUntilDate_gte ? "validUntilDate_gte : $validUntilDate_gte" : ""}
        ${exchangeToken ? "exchangeToken : $exchangeToken" : ""}
        name_contains_nocase: $name_contains_nocase
      }
    ) {
      offer {
        id
        createdAt
        price
        offerChecksum
        sellerDeposit
        fulfillmentPeriodDuration
        metadataUri
        buyerCancelPenalty
        quantityAvailable
        redeemableFromDate
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
    }
  }
`;
}
