import { Chain, connectorsForWallets, wallet } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import ethIcon from "./assets/ethereum-chain-icon.svg";
import { CONFIG } from "./config";

const supportedChains: Readonly<Array<number>> = [
  chain.ropsten.id,
  chain.mainnet.id,
  chain.polygonMumbai.id
] as const;

function getBosonTestNetworkChainConfig(): Chain {
  return {
    id: CONFIG.chainId,
    name: "Boson Test (PoA)",
    network: "boson",
    iconUrl: ethIcon,
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH"
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

function getChainForEnvironment(): Array<Chain> {
  if (!supportedChains.includes(CONFIG.chainId)) {
    return [getBosonTestNetworkChainConfig()];
  }

  const existingChain = Object.values(chain).find(
    (value: Chain) => value.id === CONFIG.chainId
  );

  return [existingChain ?? chain.ropsten];
}

export const { provider, chains } = configureChains(getChainForEnvironment(), [
  jsonRpcProvider({
    rpc: (chain: Chain) => ({ http: chain.rpcUrls.default })
  })
]);

const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      wallet.rainbow({ chains }),
      wallet.metaMask({ chains }),
      wallet.walletConnect({ chains })
    ]
  }
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});
