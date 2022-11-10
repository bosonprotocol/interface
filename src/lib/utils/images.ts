import { CID } from "multiformats/cid";

import { CONFIG } from "../config";
import { sanitizeUrl } from "./url";

export function getImageUrl(uri: string, gateway: string = CONFIG.ipfsGateway) {
  const cid = uri.replaceAll("ipfs://", "");

  try {
    CID.parse(cid);
    return `${gateway}/${cid}`.replace(/([^:]\/)\/+/g, "$1"); // remove double slash
  } catch (error) {
    // If CID.parse throws, then it it either not a valid CID or just an URL
    return sanitizeUrl(uri);
  }
}

export function getLensImageUrl(uri: string) {
  return getImageUrl(uri, CONFIG.lens.ipfsGateway);
}
