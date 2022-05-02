import { REACT_APP_WIDGETS_URL } from "./constants";

export const CONFIG = {
  widgetsUrl: REACT_APP_WIDGETS_URL || "http://localhost:3000",
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID || "3"),
  ipfsMetadataUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || "https://ipfs.infura.io:5001"
};
