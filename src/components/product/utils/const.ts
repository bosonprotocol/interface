import { ProtocolConfig } from "@bosonprotocol/react-kit";
import { onlyFairExchangePolicyLabel } from "lib/constants/policies";

import { CONFIG } from "../../../lib/config";
import countries from "../../../lib/const/countries.json";
import { Token } from "../../convertion-rate/ConvertionRateContext";
import { ContactPreference } from "../../modal/components/Profile/const";

export const MAX_LOGO_SIZE = 600 * 1024;
export const MAX_IMAGE_SIZE = 600 * 1024;
export const SUPPORTED_FILE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/webp"
];

export const CREATE_PRODUCT_STEPS = (
  isMultiVariant: boolean,
  isTokenGated: boolean
) => [
  {
    name: "Product Data",
    steps: isMultiVariant ? 4 : 3
  } as const,
  {
    name: "Terms of Sale",
    steps: isTokenGated ? 4 : 3
  } as const,
  {
    name: "Confirm",
    steps: 1
  } as const
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
] as const;

export const getOptionsCurrencies = (envConfig: ProtocolConfig) =>
  envConfig.defaultTokens?.length
    ? [
        ...(envConfig.defaultTokens?.map((token: Token) => ({
          value: token?.symbol || "",
          label: token?.symbol || ""
        })) || [])
      ]
    : [
        {
          value: envConfig.nativeCoin?.symbol || "",
          label: envConfig.nativeCoin?.symbol || ""
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
] as const;

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
] as const;

export const TOKEN_CRITERIA = [
  {
    value: "minbalance",
    label: "Collection balance"
  },
  {
    value: "tokenid",
    label: "Specific token"
  }
] as const;

export const OPTIONS_EXCHANGE_POLICY = [
  {
    value: CONFIG.buyerSellerAgreementTemplate as string,
    label: onlyFairExchangePolicyLabel
  }
] as const;

export const OPTIONS_DISPUTE_RESOLVER = [
  {
    value: "redeemeum",
    label: "Redeemeum"
  }
] as const;

export const OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE = [
  {
    // default option
    value: ContactPreference.XMTP_AND_EMAIL,
    label: "Email"
  },
  {
    value: ContactPreference.XMTP,
    label: "Chat (XMTP)"
  }
] as const;

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const optionUnitValues = {
  fixed: "Fixed",
  "%": "Percent"
} as const;
export const optionUnitKeys = (
  Object.keys(optionUnitValues) as Array<keyof typeof optionUnitValues>
).reduce((prev, key) => {
  prev[key] = key;
  return prev;
}, {} as Record<keyof typeof optionUnitValues, keyof typeof optionUnitValues>);

export const OPTIONS_UNIT = (
  Object.entries(optionUnitValues) as Entries<typeof optionUnitValues>
).map(([key, value]) => ({
  value: key,
  label: value as typeof optionUnitValues[typeof key]
}));
export const PERCENT_OPTIONS_UNIT = [
  {
    value: "%",
    label: "Percent"
  }
] as const;
export const OPTIONS_PERIOD = [
  {
    value: "days",
    label: "Days"
  }
] as const;

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
] as const;

export const OPTIONS_WEIGHT = [
  {
    value: "g",
    label: "Gram"
  },
  {
    value: "kg",
    label: "Kilogram"
  }
] as const;

export enum ProductTypeValues {
  oneItemType = "oneItemType",
  differentVariants = "differentVariants"
}

export enum TypeKeys {
  Size = "Size",
  Color = "Color"
}

export enum ImageSpecificOrAll {
  all = "all",
  specific = "specific"
}

export const IMAGE_SPECIFIC_OR_ALL_OPTIONS = [
  {
    value: ImageSpecificOrAll.all,
    label: "All"
  },
  {
    value: ImageSpecificOrAll.specific,
    label: "Specific"
  }
] as const;

export const ProductMetadataAttributeKeys = {
  "Token Type": "Token Type",
  "Redeemable At": "Redeemable At",
  "Redeemable Until": "Redeemable Until",
  Seller: "Seller",
  [TypeKeys.Size]: TypeKeys.Size,
  [TypeKeys.Color]: TypeKeys.Color
} as const;
