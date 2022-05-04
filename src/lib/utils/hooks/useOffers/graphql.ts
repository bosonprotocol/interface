import { UseOfferProps } from "./types";

export const offerGraphQL = `
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

export const buildOrderBy = () => {
  // TODO: change to createdAt
  return `
      orderBy: name,
      orderDirection: asc
    `;
};

// TODO: use brand to filter once it's supported
export const buildWhere = ({
  name,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  brand,
  voided,
  valid,
  exchangeTokenAddress,
  offerId
}: Partial<UseOfferProps>) => {
  const now = Math.floor(Date.now() / 1000);
  const validFromDate = now;
  const validUntilDate = now;
  const validWhere = valid
    ? `validFromDate_lte:${validFromDate},validUntilDate_gte:${validUntilDate}`
    : "";

  const voidedWhere = voided === undefined ? "" : `voided:${voided}`;
  const nameWhere = name ? `name_contains_nocase:"${name}"` : "";
  const offerIdWhere = offerId ? `offer:"${offerId}"` : "";

  const exchangeTokenAddressWhere = exchangeTokenAddress
    ? `exchangeToken:"${exchangeTokenAddress}"`
    : "";
  const where = `{${[
    validWhere,
    voidedWhere,
    nameWhere,
    offerIdWhere,
    // brandWhere,
    exchangeTokenAddressWhere
  ]
    .filter((cond) => cond)
    .join(",")}}`;
  return where;
};
