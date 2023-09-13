import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { useConfigContext } from "components/config/ConfigContext";
import { useMemo } from "react";
import { configureChains, createConfig } from "wagmi";
import * as wagmiChains from "wagmi/chains";

import { CONFIG } from "./config";

function getChain(chainId: number): Array<Chain> {
  const chain = Object.values(wagmiChains).find(
    (chain) => chain.id === chainId
  );
  if (!chain) {
    throw new Error(`Cannot find a chain with id ${chainId} in wagmiChains`);
  }
  return [chain];
}

export function getConnectors(chainId: number) {
  const { publicClient, chains } = configureChains(getChain(chainId), [
    jsonRpcProvider({
      rpc: (chain: Chain) => {
        return {
          http: chain.rpcUrls.default.http[0],
          webSocket: chain.rpcUrls.default.webSocket?.[0]
        };
      }
    })
  ]);

  const projectId = CONFIG.walletConnect.projectId;
  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet({ chains, projectId }),
        walletConnectWallet({ chains, projectId })
      ]
    }
  ]);
  return { connectors, publicClient };
}

export const useWagmiConfig = () => {
  const { config } = useConfigContext();
  const wagmiConfig = useMemo(() => {
    const { connectors, publicClient } = getConnectors(
      config.envConfig.chainId
    );
    const wagmiConfig = createConfig({
      autoConnect: false,
      connectors,
      publicClient
    });
    return wagmiConfig;
  }, [config.envConfig.chainId]);

  return wagmiConfig;
};
