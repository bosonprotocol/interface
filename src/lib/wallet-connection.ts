import { EnvironmentType } from "@bosonprotocol/react-kit";
import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import ethIcon from "assets/ethereum-chain-icon.svg";
import { configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";

import { CONFIG } from "./config";

const chainPerEnviromnent: Record<EnvironmentType, Chain> = {
  local: getLocalNetworkChainConfig(),
  testing: polygonMumbai,
  staging: polygonMumbai,
  production: polygon
};

function getLocalNetworkChainConfig(): Chain {
  return {
    id: 31337,
    name: "Local Hardhat",
    network: "hardhat",
    iconUrl: ethIcon,
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: Number(CONFIG.nativeCoin?.decimals) || 18,
      name: CONFIG.nativeCoin?.name || "",
      symbol: CONFIG.nativeCoin?.symbol || ""
    },
    rpcUrls: {
      default: { http: [CONFIG.jsonRpcUrl] }, // TODO:check
      public: { http: [CONFIG.jsonRpcUrl] } // TODO:check
    },
    blockExplorers: {
      default: {
        name: "Local",
        url: ""
      }
    },
    testnet: true
  };
}

function getChainForEnvironment(): Array<Chain> {
  const chain = chainPerEnviromnent[CONFIG.envName];
  return [chain];
}

const { publicClient, chains } = configureChains(getChainForEnvironment(), [
  jsonRpcProvider({
    rpc: (chain: Chain) => {
      return {
        http: chain.rpcUrls.default.http[0],
        webSocket: chain.rpcUrls.default.webSocket?.[0]
      };
    }
  })
]);
export { chains };
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

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});
