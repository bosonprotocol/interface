import { providers } from "ethers";

export function jsonRpcProvider({
  pollingInterval,
  priority,
  rpc,
  stallTimeout,
  static: static_ = true,
  weight
}: Record<string, any>) {
  return function (chain: any) {
    const rpcConfig = rpc(chain);
    if (!rpcConfig || rpcConfig.http === "") return null;
    return {
      chain: {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: rpcConfig.http
        }
      },
      provider: () => {
        const RpcProvider = static_
          ? providers.StaticJsonRpcProvider
          : providers.JsonRpcProvider;
        const provider = new RpcProvider(rpcConfig.http, {
          chainId: chain.id,
          name: chain.network,
          ensAddress: chain.ensAddress
        });
        if (pollingInterval) provider.pollingInterval = pollingInterval;
        return Object.assign(provider, { priority, stallTimeout, weight });
      },
      ...(rpcConfig.webSocket && {
        webSocketProvider: () =>
          new providers.WebSocketProvider(rpcConfig.webSocket, chain.id)
      })
    };
  };
}
