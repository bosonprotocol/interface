import { Chain, connectorsForWallets, wallet } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import ethIcon from "./assets/ethereum-chain-icon.svg";
import { CONFIG } from "./config";

type EnvironmentType = "local" | "testing" | "staging" | "production"; // TODO: export EnvironmentType in react-kit

const chainPerEnviromnent: Record<EnvironmentType, Chain> = {
  local: getLocalNetworkChainConfig(),
  testing: chain.polygonMumbai,
  staging: chain.polygonMumbai,
  production: chain.polygon
};

function getBosonTestNetworkChainConfig(): Chain {
  return {
    id: 1234,
    name: "Boson Test (PoA)",
    network: "boson",
    iconUrl: ethIcon,
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: Number(CONFIG.nativeCoin?.decimals) || 18,
      name: CONFIG.nativeCoin?.name || "",
      symbol: CONFIG.nativeCoin?.symbol || ""
    },
    rpcUrls: {
      default: CONFIG.jsonRpcUrl
    },
    blockExplorers: {
      default: {
        name: "Development",
        url: "https://explorer.bsn-development-potassium.bosonportal.io/"
      }
    },
    testnet: true
  };
}

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
      default: CONFIG.jsonRpcUrl
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
  if (!chain) {
    return [getBosonTestNetworkChainConfig()];
  }
  return [chain];
}

export const { provider, chains } = configureChains(getChainForEnvironment(), [
  jsonRpcProvider({
    rpc: (chain: Chain) => ({ http: chain.rpcUrls.default })
  })
]);

const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [wallet.metaMask({ chains }), wallet.walletConnect({ chains })]
  }
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});
