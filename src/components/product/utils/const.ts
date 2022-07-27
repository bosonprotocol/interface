export const CREATE_PRODUCT_STEPS = [
  {
    name: "Profile info",
    steps: 1
  } as const,
  {
    name: "Product Data",
    // steps: 4
    steps: 3 // NOTE: FOR CURRENT SCOPE PRODUCTS VARIANTS ARE EXCLUDED
  } as const,
  {
    name: "Terms of Sale",
    steps: 3
  } as const,
  {
    name: "Confirm",
    steps: 1
  } as const
];

export const MOCK_OPTIONS = [
  {
    value: "first",
    label: "First option"
  },
  {
    value: "second",
    label: "Second option"
  }
];

export const MOCK_MODAL_DATA = {
  noCloseIcon: true,
  title: "Congratulations!",
  name: "FEWO SHOE EPIC #76/207",
  message: "You have successfully created:",
  image: "https://picsum.photos/seed/58/700",
  price: "2000000000000000",
  offer: {
    id: "35",
    createdAt: "1657198698",
    price: "2000000000000000",
    metadataHash: "Qmf77HBcgxaiB2XT8fYSdDPMWo58VrMu1PVPXoBsBpgAko",
    sellerDeposit: "20000000000000",
    fulfillmentPeriodDuration: "86400",
    resolutionPeriodDuration: "86400",
    metadataUri: "ipfs://Qmf77HBcgxaiB2XT8fYSdDPMWo58VrMu1PVPXoBsBpgAko",
    buyerCancelPenalty: "10000000000000",
    quantityAvailable: "994",
    quantityInitial: "1000",
    validFromDate: "1657198839",
    validUntilDate: "1677285059",
    voidedAt: null,
    voucherValidDuration: "21727820",
    exchanges: [
      {
        committedDate: "1657730973",
        redeemedDate: "1657789278"
      },
      {
        committedDate: "1657198878",
        redeemedDate: null
      },
      {
        committedDate: "1657288773",
        redeemedDate: null
      },
      {
        committedDate: "1657538028",
        redeemedDate: null
      },
      {
        committedDate: "1657538133",
        redeemedDate: null
      },
      {
        committedDate: "1657641168",
        redeemedDate: null
      }
    ],
    seller: {
      id: "4",
      admin: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      clerk: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      treasury: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      operator: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      active: true
    },
    exchangeToken: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      name: "Ether",
      symbol: "ETH"
    },
    metadata: {
      name: "Long-lived Test Item",
      description: "Lore ipsum",
      externalUrl: "https://interface-test.on.fleek.co",
      schemaUrl: "https://schema.org/schema",
      type: "BASE",
      imageUrl: "https://picsum.photos/seed/35/700"
    },
    isValid: true
  }
};
