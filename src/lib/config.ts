import { getDefaultConfig } from "@bosonprotocol/common"; // TODO: import from react-kit instead once it's exported there
import { chain } from "wagmi";

import { parseCurationList } from "./utils/curationList";

const REACT_APP_CHAIN_ID = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : chain.ropsten.id;

export const config = getDefaultConfig({ chainId: REACT_APP_CHAIN_ID });

export const CONFIG = {
  ...config,
  enableSentryLogging: ["local", "testing"].includes(config.envName),
  dateFormat: process.env.DATE_FORMAT || "YYYY/MM/DD",
  shortDateFormat: process.env.SHORT_DATE_FORMAT || "MMM DD, YYYY",
  fullDateFormat: process.env.FULL_DATE_FORMAT || "YYYY-MM-DDTHH:mm:ssZ[Z]",
  defaultCurrency: {
    ticker: process.env.DEFAULT_CURRENCY || "USD",
    symbol: process.env.DEFAULT_CURRENCY_SYMBOL || "$"
  },
  maxUploadSize: process.env.MAX_UPLOAD_SIZE
    ? Number(process.env.MAX_UPLOAD_SIZE)
    : 2 * 1024 * 1024,
  widgetsUrl: process.env.REACT_APP_WIDGETS_URL || config.widgetsUrl,
  chainId: REACT_APP_CHAIN_ID,
  ipfsMetadataUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || "https://ipfs.infura.io:5001",
  sentryDSNUrl:
    "https://ff9c04ed823a4658bc5de78945961937@o992661.ingest.sentry.io/6455090",
  metaTransactionsApiKey: process.env.REACT_APP_META_TX_API_KEY,
  sellerCurationList: parseCurationList(
    process.env.REACT_APP_SELLER_CURATION_LIST
  ),
  offerCurationList: parseCurationList(
    process.env.REACT_APP_OFFER_CURATION_LIST
  ),
  enableCurationLists: stringToBoolean(
    process.env.REACT_APP_ENABLE_CURATION_LISTS
  )
};

export const coreSdkConfig: Config = {
  ...config,
  chainId: REACT_APP_CHAIN_ID,
  ipfsMetadataUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || "https://ipfs.infura.io:5001",
  protocolDiamond: config.contracts.protocolDiamond
};

export type Config = {
  chainId: number;
  protocolDiamond: string;
  subgraphUrl: string;
  jsonRpcUrl: string;
  theGraphIpfsUrl?: string;
  ipfsMetadataUrl: string;
};
function stringToBoolean(value?: string) {
  if (typeof value === "string") {
    return ["1", "true"].includes(value);
  }

  return Boolean(value);
}
