import { CID } from "multiformats/cid";

import { CONFIG } from "../config";
import { sanitizeUrl } from "./url";

const lensIpfs = "https://lens.infura-ipfs.io/ipfs/";

export function getIpfsGatewayUrl(
  uri: string,
  opts: Partial<{
    gateway: string;
  }> = {}
): string {
  if (!uri) {
    return uri;
  }
  if (uri.startsWith(lensIpfs)) {
    return uri;
  }
  const { gateway = CONFIG.ipfsGateway } = opts;
  const cid = uri.replaceAll("ipfs://", "");

  try {
    CID.parse(cid);
    return `${gateway}/${cid}`.replace(/([^:]\/)\/+/g, "$1"); // remove double slash
  } catch (error) {
    // If CID.parse throws, then it is either not a valid CID or just an URL
    const cidFromUrl = uri.split("/ipfs/")[1];
    if (cidFromUrl) {
      return getIpfsGatewayUrl(cidFromUrl.split("?")[0], opts);
    }

    return sanitizeUrl(uri);
  }
}
