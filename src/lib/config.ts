import {
  EnvironmentType,
  getEnvConfigs,
  getRpcUrls,
  ProtocolConfig
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";

import { Token } from "../components/convertion-rate/ConvertionRateContext";
import lensFollowNftContractAbi from "../lib/utils/hooks/lens/abis/lens-follow-nft-contract-abi.json";
import lensHubContractAbi from "../lib/utils/hooks/lens/abis/lens-hub-contract-abi.json";
import lensPeripheryDataProvider from "../lib/utils/hooks/lens/abis/lens-periphery-data-provider.json";
import { parseCurationList } from "./utils/curationList";
import { ViewMode } from "./viewMode";

/**
 * Remove trailing slash from a URL string if it exists
 * @param url - The URL string to process
 * @returns The URL string without trailing slash
 */
export function removeTrailingSlash(url: string | undefined): string {
  if (!url) {
    return "";
  }
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const envName = process.env.REACT_APP_ENV_NAME as EnvironmentType;
if (!envName) {
  throw new Error("REACT_APP_ENV_NAME is not defined");
}
const infuraKey = process.env.REACT_APP_INFURA_KEY;
if (!infuraKey) {
  throw new Error("REACT_APP_INFURA_KEY is not defined");
}
const widgetsUrl = removeTrailingSlash(process.env.REACT_APP_WIDGETS_URL);
if (!widgetsUrl) {
  throw new Error("REACT_APP_WIDGETS_URL is not defined");
}

const infuraProjectSecret = process.env.REACT_APP_INFURA_IPFS_PROJECT_SECRET;
const infuraProjectId = process.env.REACT_APP_INFURA_IPFS_PROJECT_ID;

function getMetaTxApiIds(envConfig: ProtocolConfig) {
  const protocolAddress: string = envConfig.contracts.protocolDiamond;
  const defaultTokens: Token[] = envConfig.defaultTokens || [];
  const apiIds: Record<string, Record<string, string>> = {};
  try {
    const apiIdsInputPerConfigId = JSON.parse(
      process.env.REACT_APP_META_TX_API_IDS_MAP || "{}"
    );
    const method = "executeMetaTransaction"; // At the moment, both protocol and tokens have the same method
    const tokens = defaultTokens;
    const apiIdsInput = apiIdsInputPerConfigId[envConfig.configId];
    if (!apiIdsInput) {
      return;
    }
    Object.keys(apiIdsInput).forEach((key) => {
      if (key.toLowerCase() === "protocol") {
        apiIds[protocolAddress.toLowerCase()] = {};
        apiIds[protocolAddress.toLowerCase()][method] = apiIdsInput[key];
      } else if (key.toLowerCase() === "forwarder") {
        apiIds["FORWARDER"] = {};
        apiIds["FORWARDER"]["FORWARD"] = apiIdsInput[key];
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

function getMetaTxApiKey(envConfig: ProtocolConfig) {
  let apiKey = "";
  try {
    const apiKeysPerConfigId = JSON.parse(
      process.env.REACT_APP_META_TX_API_KEY_MAP || "{}"
    );
    apiKey = apiKeysPerConfigId[envConfig.configId];
    return apiKey;
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
  }
  return apiKey;
}

export const envConfigsFilteredByEnv: ProtocolConfig[] = getEnvConfigs(envName);
export const envChainIds = envConfigsFilteredByEnv.map(
  (envConf) => envConf.chainId
);
export const defaultEnvConfig: ProtocolConfig = envConfigsFilteredByEnv[0];
export const defaultChainId = defaultEnvConfig.chainId;

export const CONFIG = {
  dateFormat: process.env.DATE_FORMAT || "YYYY/MM/DD",
  shortDateFormat: process.env.SHORT_DATE_FORMAT || "MMM DD, YYYY",
  fullDateFormat: process.env.FULL_DATE_FORMAT || "YYYY-MM-DDTHH:mm:ssZ[Z]",
  shortMonthWithDay: process.env.SHORT_MONTH_WITH_DAY_FORMAT || "MMM DD",
  defaultCurrency: {
    ticker: process.env.DEFAULT_CURRENCY || "USD",
    symbol: process.env.DEFAULT_CURRENCY_SYMBOL || "$"
  },
  releaseTag: process.env.REACT_APP_RELEASE_TAG,
  releaseName:
    process.env.REACT_APP_RELEASE_NAME ||
    (process.env.DATE && process.env.TIME
      ? `${process.env.DATE} ${process.env.TIME}`
      : undefined),
  sentryDSNUrl:
    "https://ff9c04ed823a4658bc5de78945961937@o992661.ingest.sentry.io/6455090",
  offerCurationList: parseCurationList(
    process.env.REACT_APP_OFFER_CURATION_LIST
  ),
  rNFTLicenseTemplate: process.env.REACT_APP_RNFT_LICENSE_TEMPLATE ?? "",
  buyerSellerAgreementTemplate:
    process.env.REACT_APP_BUYER_SELLER_AGREEMENT_TEMPLATE ?? "",
  fairExchangePolicyRules:
    process.env.REACT_APP_FAIR_EXCHANGE_POLICY_RULES ?? "",
  enableCurationLists: stringToBoolean(
    process.env.REACT_APP_ENABLE_CURATION_LISTS,
    true
  ),
  mockSellerId: process.env.REACT_APP_MOCK_SELLER_ID,
  mockConversionRates: stringToBoolean(
    process.env.REACT_MOCK_CONVERSION_RATES,
    false
  ),
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
  walletConnect: {
    projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || ""
  },
  envViewMode: {
    current: Object.values(ViewMode).includes(
      (process.env.REACT_APP_VIEW_MODE as ViewMode) || ""
    )
      ? (process.env.REACT_APP_VIEW_MODE as ViewMode)
      : ViewMode.DAPP,
    dappViewModeUrl: removeTrailingSlash(process.env.REACT_APP_DAPP_VIEW_MODE),
    drCenterViewModeUrl: removeTrailingSlash(
      process.env.REACT_APP_DR_CENTER_VIEW_MODE
    )
  },
  moonpay: {
    api: process.env.REACT_APP_MOONPAY_API || "",
    apiKey: process.env.REACT_APP_MOONPAY_API_KEY || "",
    link: process.env.REACT_APP_MOONPAY_LINK || "",
    externalLink: process.env.REACT_APP_MOONPAY_EXTERNAL_LINK || ""
  },
  awsApiEndpoint: process.env.REACT_APP_AWS_API_ENDPOINT as string,
  uniswapApiUrl: process.env.REACT_APP_UNISWAP_API_URL as string,
  infuraKey,
  infuraProjectId,
  infuraProjectSecret,
  ipfsMetadataStorageHeaders: getIpfsMetadataStorageHeaders(
    infuraProjectId,
    infuraProjectSecret
  ),
  magicLinkKey: process.env.REACT_APP_MAGIC_API_KEY as string,
  rpcUrls: getRpcUrls(infuraKey),
  widgetsUrl,
  guidesUrl:
    process.env.REACT_APP_GUIDES_URL ||
    "https://bosonprotocol.github.io/interface"
} as const;
export type GlobalConfig = typeof CONFIG;
export const lensHandleMaxLength = Math.max(
  ...[".lens", ".test"].map((ext) => ext.length)
);
export type DappConfig = ReturnType<typeof getDappConfig>;
export const getDappConfig = (envConfig: ProtocolConfig) => {
  return {
    envConfig,
    enableSentryLogging:
      process.env.NODE_ENV === "development"
        ? stringToBoolean(process.env.REACT_APP_ENABLE_SENTRY_LOGGING, false)
        : ["local", "testing"].includes(envConfig.envName),
    envName: envConfig.envName,
    theGraphIpfsUrl:
      process.env.REACT_APP_THE_GRAPH_IPFS_URL || envConfig.theGraphIpfsUrl,
    ipfsMetadataStorageUrl:
      process.env.REACT_APP_IPFS_METADATA_URL || envConfig.ipfsMetadataUrl,
    metaTx: envConfig.metaTx
      ? {
          ...envConfig.metaTx,
          relayerUrl:
            process.env.REACT_APP_META_TX_RELAYER_URL ||
            envConfig.metaTx?.relayerUrl,
          apiKey: getMetaTxApiKey(envConfig),
          apiIds: getMetaTxApiIds(envConfig)
        }
      : undefined,
    lens: {
      lensHandleExtension: envConfig.chainId === 137 ? ".lens" : ".test",
      availableOnNetwork: [80001, 137].includes(envConfig.chainId),
      apiLink: envConfig.lens?.apiLink,
      ipfsGateway: CONFIG.ipfsGateway, // this is our ipfs gateway, not lens'
      LENS_HUB_CONTRACT: envConfig.lens?.LENS_HUB_CONTRACT,
      LENS_PERIPHERY_CONTRACT: envConfig.lens?.LENS_PERIPHERY_CONTRACT,
      LENS_PROFILES_CONTRACT_ADDRESS:
        envConfig.lens?.LENS_PROFILES_CONTRACT_ADDRESS,
      LENS_HUB_ABI: lensHubContractAbi,
      LENS_PERIPHERY_ABI: lensPeripheryDataProvider,
      LENS_PROFILES_CONTRACT_PARTIAL_ABI:
        envConfig.lens?.LENS_PROFILES_CONTRACT_PARTIAL_ABI,
      LENS_FOLLOW_NFT_ABI: lensFollowNftContractAbi
    }
  };
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
