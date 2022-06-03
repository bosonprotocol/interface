import { getDefaultConfig } from "@bosonprotocol/common";

const REACT_APP_CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || "3");

const config = getDefaultConfig({ chainId: REACT_APP_CHAIN_ID });

export const CONFIG = {
  ...config,
  widgetsUrl: process.env.REACT_APP_WIDGETS_URL || config.widgetsUrl,
  chainId: REACT_APP_CHAIN_ID,
  ipfsMetadataUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || "https://ipfs.infura.io:5001"
};
