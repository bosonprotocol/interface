import { CONFIG } from "../config";
import { getIpfsGatewayUrl } from "./ipfs";

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
  if (uri.startsWith("data:")) {
    return uri;
  }
  const { gateway = CONFIG.ipfsImageGateway, ...optimizationOpts } = opts;
  const ipfsGatewayUrl = getIpfsGatewayUrl(uri, { gateway });
  return `${ipfsGatewayUrl}?${optsToQueryParams(optimizationOpts)}`;
}

export function getLensImageUrl(uri: string) {
  return getIpfsGatewayUrl(uri, { gateway: CONFIG.lens.ipfsGateway });
}

export function getFallbackImageUrl(
  uri: string,
  opts?: Partial<ImageOptimizationOpts>
) {
  return getImageUrl(uri, {
    gateway: CONFIG.ipfsGateway,
    ...opts
  });
}

function optsToQueryParams(opts: Partial<ImageOptimizationOpts> = {}) {
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
