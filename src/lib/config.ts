import { getDefaultConfig } from "@bosonprotocol/react-kit";

import lensFollowNftContractAbi from "../lib/utils/hooks/lens/abis/lens-follow-nft-contract-abi.json";
import lensHubContractAbi from "../lib/utils/hooks/lens/abis/lens-hub-contract-abi.json";
import lensPeripheryDataProvider from "../lib/utils/hooks/lens/abis/lens-periphery-data-provider.json";
import { parseCurationList } from "./utils/curationList";

type EnvironmentType = "local" | "testing" | "staging" | "production"; // TODO: export EnvironmentType in react-kit

const REACT_APP_ENV_NAME = process.env.REACT_APP_ENV_NAME;
export const config = getDefaultConfig(REACT_APP_ENV_NAME as EnvironmentType);

const REACT_APP_ENABLE_SENTRY_LOGGING =
  process.env.NODE_ENV === "development"
    ? stringToBoolean(process.env.REACT_APP_ENABLE_SENTRY_LOGGING)
    : ["local", "testing"].includes(config.envName);

export function getDefaultTokens() {
  let tokens = [];
  try {
    tokens = JSON.parse(
      process.env.REACT_APP_DEFAULT_TOKENS_LIST_TESTING ||
        process.env.REACT_APP_DEFAULT_TOKENS_LIST_STAGING ||
        process.env.REACT_APP_DEFAULT_TOKENS_LIST_PRODUCTION ||
        "[]"
    );
  } catch (e) {
    console.error(e);
  }
  return tokens;
}
const createProfileConfiguration: "LENS" | "NO_TOKEN" =
  (process.env.REACT_APP_CREATE_PROFILE_CONFIGURATION as "LENS" | "NO_TOKEN") ??
  "NO_TOKEN";

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
  metaTransactionsApiKey: process.env.REACT_APP_META_TX_API_KEY,
  sellerCurationList: parseCurationList(
    process.env.REACT_APP_SELLER_CURATION_LIST
  ),
  offerCurationList: parseCurationList(
    process.env.REACT_APP_OFFER_CURATION_LIST
  ),
  rNFTLicenseTemplate: process.env.REACT_APP_RNFT_LICENSE_TEMPLATE,
  buyerSellerAgreementTemplate:
    process.env.REACT_APP_BUYER_SELLER_AGREEMENT_TEMPLATE,
  enableCurationLists: stringToBoolean(
    process.env.REACT_APP_ENABLE_CURATION_LISTS
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
  minimumReturnPeriodInDays: 15,
  minimumDisputePeriodInDays: 30,
  createProfileConfiguration,
  lens: {
    enabled: createProfileConfiguration === "LENS" && availableOnNetwork,
    lensHandleExtension: config.chainId === 137 ? ".lens" : ".test",
    availableOnNetwork,
    apiLink: config.lens.apiLink,
    LENS_HUB_CONTRACT: config.lens.LENS_HUB_CONTRACT,
    LENS_PERIPHERY_CONTRACT: config.lens.LENS_PERIPHERY_CONTRACT,
    LENS_HUB_ABI: lensHubContractAbi,
    LENS_PERIPHERY_ABI: lensPeripheryDataProvider,
    LENS_FOLLOW_NFT_ABI: lensFollowNftContractAbi
  }
};

function stringToBoolean(value?: string) {
  if (typeof value === "string") {
    return ["1", "true"].includes(value);
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
