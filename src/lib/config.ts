import { getDefaultConfig } from "@bosonprotocol/common";
import { chain } from "wagmi";

const REACT_APP_CHAIN_ID = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : chain.ropsten.id;

const config = getDefaultConfig({ chainId: REACT_APP_CHAIN_ID });

export const CONFIG = {
  ...config,
  dateFormat: process.env.DATE_FORMAT || "YYYY/MM/DD",
  defaultCurrency: process.env.DEFAULT_CURRENCY || "USD",
  widgetsUrl: process.env.REACT_APP_WIDGETS_URL || config.widgetsUrl,
  chainId: REACT_APP_CHAIN_ID,
  ipfsMetadataUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || "https://ipfs.infura.io:5001",
  sentryDSNUrl:
    "https://ff9c04ed823a4658bc5de78945961937@o992661.ingest.sentry.io/6455090"
};
