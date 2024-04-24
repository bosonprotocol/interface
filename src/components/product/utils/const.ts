import { EvaluationMethod, TokenType } from "@bosonprotocol/common";
import {
  digitalNftTypeMapping,
  digitalTypeMappingDisplay,
  ProtocolConfig
} from "@bosonprotocol/react-kit";
import countries from "lib/constants/countries.json";
import { onlyFairExchangePolicyLabel } from "lib/constants/policies";

import { CONFIG } from "../../../lib/config";
import { Token } from "../../convertion-rate/ConvertionRateContext";
import { ContactPreference } from "../../modal/components/Profile/const";

export const MAX_LOGO_SIZE = 600 * 1024;
export const MAX_IMAGE_SIZE = 600 * 1024;
export const MAX_VIDEO_FILE_SIZE = 65 * 1024 * 1024;

export const SUPPORTED_FILE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/webp"
];
const yesOrNoOptions = [
  {
    value: "false",
    label: "No"
  },
  {
    value: "true",
    label: "Yes"
  }
] as const;
export const getCreateProductSteps = ({
  isMultiVariant,
  isPhygital,
  isTokenGated
}: {
  isMultiVariant: boolean;
  isTokenGated: boolean;
  isPhygital: boolean;
}) => [
  {
    name: "Product Data",
    steps: 3 + (isMultiVariant ? 1 : 0) + (isPhygital ? 1 : 0)
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

export const DIGITAL_TYPE = Object.entries(digitalTypeMappingDisplay).map(
  ([key, value]) => ({
    value: key,
    label: value
  })
);

export const DIGITAL_NFT_TYPE = Object.entries(digitalNftTypeMapping).map(
  ([key, value]) => ({
    value: key,
    label: value
  })
);

export const isNftMintedAlreadyOptions = [...yesOrNoOptions] as const;
export const buyerTranferInfoTitle = "Buyer information required for transfer";
const getTransferCriteriaCopy = (item: "NFT" | "Digital File" | "Experience") =>
  `Describe when the ${item} will be transferred to the buyer & what conditions need to be met`;
const getTransferTimeCopy = (item: "NFT" | "Digital File" | "Experience") =>
  `Describe when the buyer can expect to receive the ${item} once the transfer criteria has been met in days`;
export const newNftInfo = {
  newNftName: {
    key: "newNftName",
    displayKey: "Name"
  },
  newNftDescription: {
    key: "newNftDescription",
    displayKey: "Description"
  },
  newNftTransferCriteria: {
    key: "newNftTransferCriteria",
    displayKey: "Transfer criteria",
    subtitle: getTransferCriteriaCopy("NFT")
  },
  newNftTransferTime: {
    key: "newNftTransferTime",
    displayKey: "Transfer time",
    subtitle: getTransferTimeCopy("NFT")
  },
  newNftBuyerTransferInfo: {
    key: "newNftBuyerTransferInfo",
    displayKey: buyerTranferInfoTitle
  }
} as const;
export const mintedNftInfo = {
  mintedNftContractAddress: {
    key: "mintedNftContractAddress",
    displayKey: "Contract address"
  },
  mintedNftTokenType: {
    key: "mintedNftTokenType",
    displayKey: "Token type"
  },
  mintedNftTokenIdRangeMin: {
    key: "mintedNftTokenIdRangeMin",
    displayKey: "Min token ID"
  },
  mintedNftTokenIdRangeMax: {
    key: "mintedNftTokenIdRangeMax",
    displayKey: "Max token ID"
  },
  mintedNftExternalUrl: {
    key: "mintedNftExternalUrl",
    displayKey: "External URL"
  },
  mintedNftTransferTime: {
    key: "mintedNftTransferTime",
    displayKey: "Transfer time",
    subtitle: getTransferTimeCopy("NFT")
  },
  mintedNftTransferCriteria: {
    key: "mintedNftTransferCriteria",
    displayKey: "Transfer criteria",
    subtitle: getTransferCriteriaCopy("NFT")
  },
  mintedNftBuyerTransferInfo: {
    key: "mintedNftBuyerTransferInfo",
    displayKey: buyerTranferInfoTitle
  }
} as const;
export const digitalFileInfo = {
  digitalFileName: {
    key: "digitalFileName",
    displayKey: "Digital file title"
  },
  digitalFileDescription: {
    key: "digitalFileDescription",
    displayKey: "Digital file description"
  },
  digitalFileFormat: {
    key: "digitalFileFormat",
    displayKey: "Digital file format"
  },
  digitalFileTransferCriteria: {
    key: "digitalFileTransferCriteria",
    displayKey: "Transfer criteria",
    subtitle: getTransferCriteriaCopy("Digital File")
  },
  digitalFileTransferTime: {
    key: "digitalFileTransferTime",
    displayKey: "Transfer time",
    subtitle: getTransferTimeCopy("Digital File")
  },
  digitalFileBuyerTransferInfo: {
    key: "digitalFileBuyerTransferInfo",
    displayKey: buyerTranferInfoTitle
  }
} as const;

export const experientialInfo = {
  experientialName: {
    key: "experientialName",
    displayKey: "Experience title"
  },
  experientialDescription: {
    key: "experientialDescription",
    displayKey: "Description of experience"
  },
  experientialTransferTime: {
    key: "experientialTransferTime",
    displayKey: "Transfer time",
    subtitle: getTransferTimeCopy("Experience")
  },
  experientialTransferCriteria: {
    key: "experientialTransferCriteria",
    displayKey: "Transfer criteria",
    subtitle: getTransferCriteriaCopy("Experience")
  },
  experientialBuyerTransferInfo: {
    key: "experientialBuyerTransferInfo",
    displayKey: buyerTranferInfoTitle
  }
} as const;

export const getOptionsCurrencies = (
  envConfig: ProtocolConfig
): {
  value: string;
  label: string;
}[] =>
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

export const OPTIONS_TOKEN_GATED = [...yesOrNoOptions] as const;

export enum TokenTypes {
  "erc20" = "erc20",
  "erc721" = "erc721",
  "erc1155" = "erc1155"
}

export const TokenTypeEnumToString = {
  [TokenType.FungibleToken]: TokenTypes.erc20,
  [TokenType.NonFungibleToken]: TokenTypes.erc721,
  [TokenType.MultiToken]: TokenTypes.erc1155
} as const;

export const TOKEN_TYPES = [
  {
    value: TokenTypes.erc20,
    label: "ERC20"
  },
  {
    value: TokenTypes.erc721,
    label: "ERC721"
  },
  {
    value: TokenTypes.erc1155,
    label: "ERC1155"
  }
] as const;

export const NFT_TOKEN_TYPES = [
  {
    value: TokenTypes.erc721,
    label: "ERC721"
  },
  {
    value: TokenTypes.erc1155,
    label: "ERC1155"
  }
] as const;

export enum BuyerTransferInfo {
  "email" = "email",
  "walletAddress" = "walletAddress"
}

export const BUYER_TRANSFER_INFO_OPTIONS = [
  {
    value: BuyerTransferInfo.email,
    label: "E-mail"
  },
  {
    value: BuyerTransferInfo.walletAddress,
    label: "Wallet address"
  }
] as const;

export const TOKEN_CRITERIA = [
  {
    value: "minbalance",
    label: "Collection balance",
    method: EvaluationMethod.Threshold
  },
  {
    value: "tokenid",
    label: "Specific token",
    method: EvaluationMethod.TokenRange
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
).reduce(
  (prev, key) => {
    prev[key] = key;
    return prev;
  },
  {} as Record<keyof typeof optionUnitValues, keyof typeof optionUnitValues>
);

export const OPTIONS_UNIT = (
  Object.entries(optionUnitValues) as Entries<typeof optionUnitValues>
).map(([key, value]) => ({
  value: key,
  label: value as (typeof optionUnitValues)[typeof key]
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

export enum ProductTypeTypeValues {
  physical = "physical",
  phygital = "phygital"
}

export enum ProductTypeVariantsValues {
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
  "Redeemable After X Days": "Redeemable After X Days",
  Seller: "Seller",
  [TypeKeys.Size]: TypeKeys.Size,
  [TypeKeys.Color]: TypeKeys.Color
} as const;
