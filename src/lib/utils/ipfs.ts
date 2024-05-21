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
  try {
    try {
      CID.parse(uri);
      const cid = uri;
      return `${gateway}/${cid}`.replace(/([^:]\/)\/+/g, "$1");
    } catch {
      // if uri it's not the cid only, then continue as expected and ignore this error
    }
    const url = new URL(
      uri.startsWith("ipfs://") ? uri.replace("ipfs://", "https://") : uri
    );
    const hostIndex = uri.toLowerCase().indexOf(url.host.toLowerCase());
    const cid = uri.substring(hostIndex, hostIndex + url.host.length); // we cannot use url.host because the browser changes it to lowercase so a lowercased CID would not be valid
    CID.parse(cid);
    return `${gateway}/${cid}${url.pathname === "/" ? "" : url.pathname}${url.search}`.replace(
      /([^:]\/)\/+/g,
      "$1"
    ); // remove double slash
  } catch (error) {
    // If CID.parse throws, then it is either not a valid CID or just an URL
    const cidFromUrl = uri.split("/ipfs/")[1];
    if (cidFromUrl) {
      return getIpfsGatewayUrl(`ipfs://${cidFromUrl}`, opts);
    }

    return sanitizeUrl(uri);
  }
}
