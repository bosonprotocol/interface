import { gql } from "graphql-request";

import { CONFIG } from "../../../config";

const offerGraphQl = gql`
  {
    id
    createdAt
    price
    metadataHash
    sellerDeposit
    disputePeriodDuration
    resolutionPeriodDuration
    metadataUri
    buyerCancelPenalty
    quantityAvailable
    quantityInitial
    validFromDate
    validUntilDate
    voidedAt
    voided
    createdAt
    voucherRedeemableFromDate
    voucherRedeemableUntilDate
    voucherValidDuration
    condition {
      id
      method
      tokenType
      tokenAddress
      tokenId
      threshold
      maxCommits
    }
    exchanges {
      cancelledDate
      committedDate
      completedDate
      disputedDate
      finalizedDate
      redeemedDate
      revokedDate
      buyer {
        id
      }
    }
    seller {
      id
      admin
      treasury
      assistant
      active
    }
    exchangeToken {
      address
      decimals
      name
      symbol
    }
    metadata {
      id
      name
      description
      animationUrl
      externalUrl
      licenseUrl
      schemaUrl
      type
      ... on ProductV1MetadataEntity {
        image
        attributes {
          id
          traitType
          value
          displayType
        }
        createdAt
        voided
        validFromDate
        validUntilDate
        uuid
        product {
          id
          uuid
          version
          title
          description
          identification_sKU
          identification_productId
          identification_productIdType
          productionInformation_brandName
          productionInformation_manufacturer
          productionInformation_manufacturerPartNumber
          productionInformation_modelNumber
          productionInformation_materials
          details_category
          details_subCategory
          details_subCategory2
          details_offerCategory
          offerCategory
          details_tags
          details_sections
          details_personalisation
          packaging_packageQuantity
          packaging_dimensions_length
          packaging_dimensions_width
          packaging_dimensions_height
          packaging_dimensions_unit
          packaging_weight_value
          packaging_weight_unit
          tags {
            name
          }
          visuals_images {
            url
            type
            tag
          }
        }
        productV1Seller {
          id
          defaultVersion
          name
          description
          externalUrl
          tokenId
          images {
            id
            url
            tag
            type
          }
          contactLinks {
            id
            url
            tag
          }
        }
        exchangePolicy {
          id
          uuid
          version
          label
          template
        }
        shipping {
          id
          defaultVersion
          countryOfOrigin
          supportedJurisdictions {
            id
            label
            deliveryTime
          }
          redemptionPoint
        }
      }
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
  offerCurationList,
  voided
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
  voided: boolean;
}) {
  // TODO: BP421 - Config dispute resolver value
  const disputeResolverId = CONFIG.defaultDisputeResolverId;

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
    ${voided ? "$voided: Boolean" : ""}
  ) {
    productV1MetadataEntities(
      where: {
        ${offer ? "offer: $offer" : ""}
        offer_: {
          disputeResolverId: "${disputeResolverId}"
        }
      }
    ) {
      offer ${offerGraphQl}
    }
  }
`;
}
