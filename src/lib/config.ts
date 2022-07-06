import { getDefaultConfig } from "@bosonprotocol/common";
import { chain } from "wagmi";

const REACT_APP_CHAIN_ID = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : chain.ropsten.id;

const config = getDefaultConfig({ chainId: REACT_APP_CHAIN_ID });

export const CONFIG = {
  ...config,
  widgetsUrl: process.env.REACT_APP_WIDGETS_URL || config.widgetsUrl,
  chainId: REACT_APP_CHAIN_ID,
  ipfsMetadataUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || "https://ipfs.infura.io:5001",
  sentryDSNUrl:
    "https://ff9c04ed823a4658bc5de78945961937@o992661.ingest.sentry.io/6455090",
  metaTransactionsApiKey: process.env.REACT_APP_META_TX_API_KEY,
  sellerWhitelist: parseWhitelist(process.env.REACT_APP_SELLER_WHITELIST),
  offerWhitelist: parseWhitelist(process.env.REACT_APP_OFFER_WHITELIST),
  enableWhitelists: stringToBoolean(process.env.REACT_APP_ENABLE_WHITELISTS)
};

function stringToBoolean(value?: string) {
  if (typeof value === "string") {
    return ["1", "true"].includes(value);
  }

  return Boolean(value);
}

function parseWhitelist(value?: string): string[] | undefined {
  if (value) {
    return value.split(",");
  }

  return undefined;
}
