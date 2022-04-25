export const CONFIG = {
  widgetsUrl: process.env.REACT_APP_WIDGETS_URL || "http://localhost:3000",
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID || "3"),
  ipfsMetadataUrl:
    process.env.REACT_APP_IPFS_METADATA_URL || "https://ipfs.infura.io:5001",
  metadataBaseUrl:
    process.env.REACT_APP_METADATA_BASE_URL || "https://ipfs.io/ipfs"
};
