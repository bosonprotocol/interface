import { CID } from "multiformats/cid";

import { CONFIG } from "../config";
import { sanitizeUrl } from "./url";

// See https://docs.pinata.cloud/gateways/image-optimization
export type ImageOptimizationOpts = {
  width: number;
  height: number;
  dpr: number;
  fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
  gravity: "auto" | "side" | "XxY";
  quality: number;
  format: "auto";
  anim: boolean;
  sharpen: number;
};

export function getImageUrl(
  uri: string,
  opts: Partial<
    ImageOptimizationOpts & {
      gateway: string;
    }
  > = {}
) {
  const { gateway = CONFIG.ipfsGateway, ...optimizationOpts } = opts;
  const cid = uri.replaceAll("ipfs://", "");

  try {
    CID.parse(cid);
    return `${gateway}/${cid}?${optsToQueryParams(optimizationOpts)}`.replace(
      /([^:]\/)\/+/g,
      "$1"
    ); // remove double slash
  } catch (error) {
    // If CID.parse throws, then it it either not a valid CID or just an URL
    return sanitizeUrl(uri);
  }
}

export function getLensImageUrl(uri: string) {
  return getImageUrl(uri, { gateway: CONFIG.lens.ipfsGateway });
}

function optsToQueryParams(opts: Partial<ImageOptimizationOpts>) {
  const transformedOpts = Object.keys(opts).reduce(
    (transformed, oldKey) => {
      return {
        ...transformed,
        [`img-${oldKey}`]: opts[oldKey as keyof ImageOptimizationOpts]
      };
    },
    {
      "img-format": "auto"
    }
  );
  return new URLSearchParams(transformedOpts).toString();
}
