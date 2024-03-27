import { subgraph } from "@bosonprotocol/react-kit";
import { gql } from "graphql-request";

export const getBuildGetOffersQuery =
  (defaultDisputeResolverId: string) =>
  ({
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
  }) => {
    const disputeResolverId = defaultDisputeResolverId;

    return gql`
    ${subgraph.BaseOfferFieldsFragmentDoc}
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
      offer {
        ...BaseOfferFields
      }
    }
  }
`;
  };
