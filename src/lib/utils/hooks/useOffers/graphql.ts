import { gql } from "graphql-request";

export const GET_OFFERS_QUERY = gql`
  query GetOffers(
    $first: Int
    $validFromDate_lte: String
    $validUntilDate_gte: String
    $name_contains_nocase: String
    $exchangeToken: String
    $orderBy: String
    $orderDirection: String
    $offer: String
  ) {
    baseMetadataEntities(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      offer: $offer
      where: {
        validFromDate_lte: $validFromDate_lte
        validUntilDate_gte: $validUntilDate_gte
        exchangeToken: $exchangeToken
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
