import { gql } from "graphql-request";

export const GET_OFFERS_QUERY = gql`
  query GetOffers(
    $first: Int
    $validFromDate_lte: String
    $name_contains_nocase: String
    $exchangeToken: String
    $orderBy: String
    $orderDirection: String
    $offer: String
  ) {
    baseMetadataEntities(
      first: $first
      validFromDate_lte: $validFromDate_lte
      name_contains_nocase: $name_contains_nocase
      exchangeToken: $exchangeToken
      orderBy: $orderBy
      offer: $offer
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
