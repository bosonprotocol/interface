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
    label: "Yes",
    disabled: true
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
