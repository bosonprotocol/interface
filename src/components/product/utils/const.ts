import { ethers } from "ethers";

import { CONFIG } from "../../../lib/config";
import countries from "../../../lib/const/countries.json";
import { Token } from "../../convertion-rate/ConvertionRateContext";

export const MAX_LOGO_SIZE = 600 * 1024;
export const MAX_IMAGE_SIZE = 600 * 1024;
export const SUPPORTED_FILE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png"
];

export const CREATE_PRODUCT_STEPS = (isMultiVariant: boolean) => [
  {
    name: "Product Data",
    steps: isMultiVariant ? 4 : 3
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
export const CATEGORY_OPTIONS = [
  {
    value: "apparel-accessories",
    label: "Apparel & Accessories"
  },
  {
    value: "art",
    label: "Art"
  },
  {
    value: "jewelry",
    label: "Jewelry"
  },
  {
    value: "photography",
    label: "Photography"
  },
  {
    value: "shoes",
    label: "Shoes"
  },
  {
    value: "collectibles",
    label: "Collectibles"
  },
  {
    value: "other",
    label: "Other"
  }
];

export const OPTIONS_CURRENCIES = CONFIG.defaultTokens?.length
  ? [
      ...(CONFIG.defaultTokens?.map((token: Token) => ({
        value: token?.symbol || "",
        label: token?.symbol || ""
      })) || [])
    ]
  : [
      {
        value: CONFIG.nativeCoin?.symbol || "",
        label: CONFIG.nativeCoin?.symbol || ""
      }
    ];
export const OPTIONS_TOKEN_GATED = [
  {
    value: "false",
    label: "No"
  },
  {
    value: "true",
    label: "Yes"
  }
];

export const TOKEN_GATED_VARIANTS = [
  {
    value: "all",
    label: "All"
  }
];

export const TOKEN_TYPES = [
  {
    value: "erc20",
    label: "ERC20"
  },
  {
    value: "erc721",
    label: "ERC721"
  },
  {
    value: "erc1155",
    label: "ERC1155"
  }
];

export const TOKEN_CRITERIA = [
  {
    value: "minbalance",
    label: "minBalance"
  },
  {
    value: "tokenid",
    label: "tokenId"
  }
];

export const OPTIONS_EXCHANGE_POLICY = [
  {
    value: "fairExchangePolicy",
    label: "Fair Exchange Policy"
  }
];

export const OPTIONS_DISPUTE_RESOLVER = [
  {
    value: "redeemeum",
    label: "Redeemeum"
  }
];

export const OPTIONS_UNIT = [
  {
    value: "%",
    label: "Percent"
  }
];

export const OPTIONS_PERIOD = [
  {
    value: "days",
    label: "Days"
  }
];

export const OPTIONS_COUNTRIES = countries;

export const OPTIONS_LENGTH = [
  {
    value: "cm",
    label: "Centimetres"
  },
  {
    value: "m",
    label: "Metres"
  },
  {
    value: "in",
    label: "Inches"
  },
  {
    value: "ft",
    label: "Feet"
  }
];

export const OPTIONS_WEIGHT = [
  {
    value: "g",
    label: "Gram"
  },
  {
    value: "kg",
    label: "Kilogram"
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
    disputePeriodDuration: "86400",
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
      address: ethers.constants.AddressZero,
      decimals: CONFIG.nativeCoin?.decimals || "",
      name: CONFIG.nativeCoin?.name || "",
      symbol: CONFIG.nativeCoin?.symbol || ""
    },
    metadata: {
      name: "Long-lived Test Item",
      description: "Lore ipsum",
      externalUrl: "https://interface-test.on.fleek.co",
      licenseUrl: "https://interface-test.on.fleek.co/license",
      schemaUrl: "https://schema.org/",
      type: "BASE",
      imageUrl: "https://picsum.photos/seed/35/700"
    },
    isValid: true
  }
};
