import { getDefaultConfig } from "@bosonprotocol/react-kit";
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
  enableCurationLists: stringToBoolean(
    process.env.REACT_APP_ENABLE_CURATION_LISTS
  )
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
