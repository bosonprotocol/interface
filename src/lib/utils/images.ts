import { CID } from "multiformats/cid";

import { CONFIG } from "../config";
import { sanitizeUrl } from "./url";

export function getImageUrl(uri: string) {
  const cid = uri.replaceAll("ipfs://", "");

  try {
    CID.parse(cid);
    return [...CONFIG.ipfsGateway.split("/"), cid].join("/");
  } catch (error) {
    // If CID.parse throws, then it it either not a valid CID or just an URL
    return sanitizeUrl(uri);
  }
}
