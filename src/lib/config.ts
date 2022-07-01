import { getDefaultConfig } from "@bosonprotocol/common";
import { chain } from "wagmi";

const REACT_APP_CHAIN_ID = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : chain.ropsten.id;

export const config = getDefaultConfig({ chainId: REACT_APP_CHAIN_ID });

export const CONFIG = {
  ...config,
  widgetsUrl: process.env.REACT_APP_WIDGETS_URL || config.widgetsUrl,
  chainId: REACT_APP_CHAIN_ID,
  ipfsMetadataUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || "https://ipfs.infura.io:5001",
  sentryDSNUrl: process.env.SENTRY_DSN || ""
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
