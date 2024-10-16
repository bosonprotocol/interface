import { getIpfsGatewayUrl } from "../ipfs";

export function resolveUrlFromIPFS(uri: string, ipfsGateway: string): string {
  return getIpfsGatewayUrl(uri, { gateway: ipfsGateway });
}
