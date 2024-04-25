import { CONFIG } from "../config";
import { blobToBase64 } from "./base64";
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
  if (!uri) {
    return "";
  }
  if (uri.startsWith("data:")) {
    return uri;
  }
  const { gateway = CONFIG.ipfsImageGateway, ...optimizationOpts } = opts;
  const ipfsGatewayUrl = getIpfsGatewayUrl(uri, { gateway });
  const url = new URL(ipfsGatewayUrl);
  for (const [key, value] of Array.from(
    optsToQueryParams(optimizationOpts).entries()
  )) {
    if (!url.searchParams.has(key)) {
      // no duplicated query params
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
}

export function getLensImageUrl(uri: string, lensIpfsGateway: string) {
  return getIpfsGatewayUrl(uri, { gateway: lensIpfsGateway });
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
  return new URLSearchParams(transformedOpts);
}

type ImageMetadata = {
  width: number;
  height: number;
};
export function getImageMetadata(image: File): Promise<ImageMetadata>;
export function getImageMetadata(image: string): Promise<ImageMetadata>;
export function getImageMetadata(image: File | string): Promise<ImageMetadata> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<ImageMetadata>(async (resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width
      });
    };
    img.onerror = (...errorArgs) => {
      reject(errorArgs);
    };
    if (typeof image === "string") {
      if (image.startsWith("ipfs://")) {
        return reject(
          "Image starts with ipfs:// instead of using a gateway or base64"
        );
      }
      img.src = image;
    } else {
      const base64 = await blobToBase64(image);
      img.src = base64;
    }
  });
}
