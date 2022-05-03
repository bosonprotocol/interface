import { gql } from "graphql-request";
import { Offer } from "lib/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useQuery } from "react-query";

import { checkOfferMetadata } from "./validators";

const offerGraphQL = `
  {
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
  `;

interface UseOffersProps {
  name?: string; // TODO: to delete once brand is supported
  brand?: string; // TODO: not supported yet
  voided?: boolean;
  valid?: boolean;
  exchangeTokenAddress?: Offer["exchangeToken"]["address"];
  filterOutWrongMetadata?: boolean;
}
interface UseOfferProps extends UseOffersProps {
  offerId: string;
}

const buildOrderBy = () => {
  // TODO: change to createdAt
  return `
    orderBy: name,
    orderDirection: asc
  `;
};

// TODO: use brand to filter once it's supported
const buildWhere = ({
  name,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  brand,
  voided,
  valid,
  exchangeTokenAddress
}: UseOffersProps) => {
  const now = Math.floor(Date.now() / 1000);
  const validFromDate = now;
  const validUntilDate = now;
  const validWhere = valid
    ? `validFromDate_lte:${validFromDate},validUntilDate_gte:${validUntilDate}`
    : "";

  const voidedWhere = `voided:${voided}`;
  const nameWhere = name ? `name_contains_nocase:"${name}"` : "";

  const exchangeTokenAddressWhere = exchangeTokenAddress
    ? `exchangeToken:"${exchangeTokenAddress}"`
    : "";
  const where = `{${[
    validWhere,
    voidedWhere,
    nameWhere,
    // brandWhere,
    exchangeTokenAddressWhere
  ]
    .filter((cond) => cond)
    .join(",")}}`;
  return where;
};

const getOfferById = async (id: string, props: UseOffersProps) => {
  const where = buildWhere(props);
  const orderBy = buildOrderBy();
  const result = await fetchSubgraph<{ offer: Offer }>(
    gql`
      {
        baseMetadataEntity(id: ${id}, where: ${where}, ${orderBy}) {
          offer ${offerGraphQL}
        }
      }
    `
  );
  return result?.offer;
};

// TODO: to be used in details page
export const useOffer = ({ offerId, ...restProps }: UseOfferProps) => {
  return useQuery(
    ["offer", offerId],
    async () => {
      const offer = await getOfferById(offerId, restProps);
      if (offer && checkOfferMetadata(offer)) {
        return offer;
      }
      return null;
    },
    {
      enabled: !!offerId
    }
  );
};

export const useOffers = (props: UseOffersProps) => {
  const where = buildWhere(props);
  const orderBy = buildOrderBy();
  return useQuery(JSON.stringify(props), async () => {
    const result = await fetchSubgraph<{
      baseMetadataEntities: { offer: Offer }[];
    }>(
      gql`
        {
          baseMetadataEntities(first: 10, where: ${where}, ${orderBy}) {
            offer ${offerGraphQL}
          }
          
        }
      `
    );
    const { filterOutWrongMetadata } = props;
    return result?.baseMetadataEntities
      ?.filter((base) =>
        filterOutWrongMetadata ? checkOfferMetadata(base.offer) : true
      )
      .map((base) => base.offer);
  });
};
