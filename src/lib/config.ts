import { EnvironmentType, getEnvConfigs } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";

import { Token } from "../components/convertion-rate/ConvertionRateContext";
import lensFollowNftContractAbi from "../lib/utils/hooks/lens/abis/lens-follow-nft-contract-abi.json";
import lensHubContractAbi from "../lib/utils/hooks/lens/abis/lens-hub-contract-abi.json";
import lensPeripheryDataProvider from "../lib/utils/hooks/lens/abis/lens-periphery-data-provider.json";
import { parseCurationList } from "./utils/curationList";
import { ViewMode } from "./viewMode";

const REACT_APP_ENV_NAME = process.env.REACT_APP_ENV_NAME;
export const config = getEnvConfigs(REACT_APP_ENV_NAME as EnvironmentType)[0];

const REACT_APP_ENABLE_SENTRY_LOGGING =
  process.env.NODE_ENV === "development"
    ? stringToBoolean(process.env.REACT_APP_ENABLE_SENTRY_LOGGING, false)
    : ["local", "testing"].includes(config.envName);

export function getDefaultTokens(): Token[] {
  let tokens: Token[] = [];
  try {
    tokens = JSON.parse(
      process.env.REACT_APP_DEFAULT_TOKENS_LIST_TESTING ||
        process.env.REACT_APP_DEFAULT_TOKENS_LIST_STAGING ||
        process.env.REACT_APP_DEFAULT_TOKENS_LIST_PRODUCTION ||
        "[]"
    );
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
  }
  return tokens;
}

function getMetaTxApiIds(protocolAddress: string) {
  const apiIds: Record<string, Record<string, string>> = {};
  try {
    const apiIdsInput = JSON.parse(
      process.env.REACT_APP_META_TX_API_IDS || "[]"
    );
    const method = "executeMetaTransaction"; // At the moment, both protocol and tokens have the same method
    const tokens = getDefaultTokens();
    Object.keys(apiIdsInput).forEach((key) => {
      if (key.toLowerCase() === "protocol") {
        apiIds[protocolAddress.toLowerCase()] = {};
        apiIds[protocolAddress.toLowerCase()][method] = apiIdsInput[key];
      } else {
        const token = tokens.find(
          (t: Token) => t.symbol.toLowerCase() === key.toLowerCase()
        );
        if (token) {
          apiIds[token.address.toLowerCase()] = {};
          apiIds[token.address.toLowerCase()][method] = apiIdsInput[key];
        } else {
          console.error(`Unable to resolve token with symbol ${key}`);
        }
      }
    });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
  }
  return apiIds;
}

const availableOnNetwork = [80001, 137].includes(config.chainId);

export const CONFIG = {
  ...config,
  enableSentryLogging: REACT_APP_ENABLE_SENTRY_LOGGING,
  dateFormat: process.env.DATE_FORMAT || "YYYY/MM/DD",
  shortDateFormat: process.env.SHORT_DATE_FORMAT || "MMM DD, YYYY",
  fullDateFormat: process.env.FULL_DATE_FORMAT || "YYYY-MM-DDTHH:mm:ssZ[Z]",
  shortMonthWithDay: process.env.SHORT_MONTH_WITH_DAY_FORMAT || "MMM DD",
  defaultCurrency: {
    ticker: process.env.DEFAULT_CURRENCY || "USD",
    symbol: process.env.DEFAULT_CURRENCY_SYMBOL || "$"
  },
  releaseTag: process.env.REACT_APP_RELEASE_TAG,
  releaseName: process.env.REACT_APP_RELEASE_NAME,
  envName: REACT_APP_ENV_NAME as EnvironmentType,
  theGraphIpfsUrl:
    process.env.REACT_APP_THE_GRAPH_IPFS_URL || config.theGraphIpfsUrl,
  ipfsMetadataStorageUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || config.ipfsMetadataUrl,
  ipfsMetadataStorageHeaders: getIpfsMetadataStorageHeaders(
    process.env.REACT_APP_INFURA_IPFS_PROJECT_ID,
    process.env.REACT_APP_INFURA_IPFS_PROJECT_SECRET
  ),
  sentryDSNUrl:
    "https://ff9c04ed823a4658bc5de78945961937@o992661.ingest.sentry.io/6455090",
  metaTx: {
    ...config.metaTx,
    apiKey: process.env.REACT_APP_META_TX_API_KEY,
    apiIds: getMetaTxApiIds(config.contracts.protocolDiamond)
  },
  sellerBlacklistUrl: process.env.REACT_APP_SELLER_BLACKLIST_URL,
  offerCurationList: parseCurationList(
    process.env.REACT_APP_OFFER_CURATION_LIST
  ),
  rNFTLicenseTemplate: process.env.REACT_APP_RNFT_LICENSE_TEMPLATE,
  buyerSellerAgreementTemplate:
    process.env.REACT_APP_BUYER_SELLER_AGREEMENT_TEMPLATE,
  fairExchangePolicyRules: process.env.REACT_APP_FAIR_EXCHANGE_POLICY_RULES,
  enableCurationLists: stringToBoolean(
    process.env.REACT_APP_ENABLE_CURATION_LISTS,
    true
  ),
  defaultTokens: getDefaultTokens(),
  mockSellerId: process.env.REACT_APP_MOCK_SELLER_ID,
  defaultDisputeResolverId:
    process.env.REACT_APP_DEFAULT_DISPUTE_RESOLVER_ID || "1",
  defaultDisputeResolutionPeriodDays:
    process.env.REACT_APP_DEFAULT_RESOLUTION_PERIOD_DAYS || "15",
  defaultSellerContactMethod: "Chat App in the dApp",
  defaultDisputeResolverContactMethod:
    process.env.NODE_ENV === "production"
      ? "disputes@redeemeum.com"
      : "disputes-test@redeemeum.com",
  defaultSupportEmail: "info@bosonapp.io",
  minimumReturnPeriodInDays: 1,
  defaultReturnPeriodInDays: 15,
  minimumDisputePeriodInDays: 30,
  ipfsGateway: process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.io/ipfs",
  ipfsImageGateway:
    process.env.REACT_APP_IPFS_IMAGE_GATEWAY ||
    process.env.REACT_APP_IPFS_GATEWAY ||
    "https://ipfs.io/ipfs",
  lens: {
    lensHandleExtension: config.chainId === 137 ? ".lens" : ".test",
    availableOnNetwork,
    apiLink: config.lens.apiLink,
    ipfsGateway: config.lens.ipfsGateway,
    LENS_HUB_CONTRACT: config.lens.LENS_HUB_CONTRACT,
    LENS_PERIPHERY_CONTRACT: config.lens.LENS_PERIPHERY_CONTRACT,
    LENS_PROFILES_CONTRACT_ADDRESS: config.lens.LENS_PROFILES_CONTRACT_ADDRESS,
    LENS_HUB_ABI: lensHubContractAbi,
    LENS_PERIPHERY_ABI: lensPeripheryDataProvider,
    LENS_PROFILES_CONTRACT_PARTIAL_ABI:
      config.lens.LENS_PROFILES_CONTRACT_PARTIAL_ABI,
    LENS_FOLLOW_NFT_ABI: lensFollowNftContractAbi
  },
  walletConnect: {
    projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || ""
  },
  carouselPromotedSellerId:
    process.env.REACT_APP_CAROUSEL_PROMOTED_SELLER_ID || undefined,
  envViewMode: {
    current: Object.values(ViewMode).includes(
      (process.env.REACT_APP_VIEW_MODE as ViewMode) || ""
    )
      ? (process.env.REACT_APP_VIEW_MODE as ViewMode)
      : ViewMode.DAPP,
    dappViewModeUrl: process.env.REACT_APP_DAPP_VIEW_MODE || "",
    drCenterViewModeUrl: process.env.REACT_APP_DR_CENTER_VIEW_MODE || ""
  }
};

function stringToBoolean(value: unknown | undefined, defaultValue: boolean) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (typeof value === "string") {
    if (defaultValue) {
      // return true except if value is "0" or "false"
      return !["0", "false"].includes(value);
    } else {
      // return false except if value is "1" or "true"
      return ["1", "true"].includes(value);
    }
  }

  return Boolean(value);
}

function getIpfsMetadataStorageHeaders(
  infuraProjectId?: string,
  infuraProjectSecret?: string
) {
  if (!infuraProjectId && !infuraProjectSecret) {
    return undefined;
  }

  return {
    authorization: `Basic ${Buffer.from(
      infuraProjectId + ":" + infuraProjectSecret
    ).toString("base64")}`
  };
}
