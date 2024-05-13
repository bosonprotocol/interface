import { Offer } from "../../src/lib/types/offer";

export const defaultMockOffers: Offer[] = [
  {
    id: "0",
    price: "1",
    createdAt: "",
    offerChecksum: "",
    sellerDeposit: "",
    disputePeriodDuration: "",
    metadataUri: "",
    buyerCancelPenalty: "",
    agentId: "0",
    quantityInitial: "0",
    voucherRedeemableFromDate: "",
    voucherRedeemableUntilDate: "",
    quantityAvailable: "",
    validFromDate: "",
    validUntilDate: "",
    voidedAt: null,
    voucherValidDuration: "",
    resolutionPeriodDuration: "",
    disputeResolverId: "",
    exchanges: [],
    seller: {
      id: "0",
      active: true,
      admin: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      clerk: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      assistant: "0x57fafe1fb7c682216fce44e50946c5249192b9d5",
      treasury: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
    },
    exchangeToken: {
      symbol: "ETH",
      decimals: "18",
      address: "0x0",
      name: "name"
    },
    metadata: {
      name: "first offer",
      description: "Description",
      type: "BASE",
      externalUrl: "externalUrl",
      licenseUrl: "licenseUrl",
      schemaUrl: "schemaUrl"
    }
  } as unknown as Offer
];
