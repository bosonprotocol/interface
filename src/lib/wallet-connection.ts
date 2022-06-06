import {
  Chain,
  darkTheme,
  getDefaultWallets,
  Theme
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import { chain, configureChains, createClient } from "wagmi";

import { jsonRpcProvider } from "../wagmi-core-providers-jsonRpc.esm";
import ethIcon from "./assets/ethereum-chain-icon.svg";
import { CONFIG } from "./config";
import { colors } from "./styles/colors";

const supportedChains: Readonly<Array<number>> = [
  chain.ropsten.id,
  chain.mainnet.id
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

const { connectors } = getDefaultWallets({
  appName: "Boson dApp",
  chains
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export const walletConnectionTheme = merge(
  darkTheme({ borderRadius: "medium" }),
  {
    colors: {
      accentColor: colors.green,
      accentColorForeground: colors.navy,
      closeButtonBackground: colors.navy,
      actionButtonBorder: colors.navy,
      profileForeground: colors.navy,
      modalBackground: colors.navy,
      modalBorder: colors.navy,
      modalText: colors.white,
      modalTextSecondary: colors.lightGrey
    },
    shadows: {
      connectButton: "none"
    },
    fonts: {
      body: "Manrope, sans-serif"
    }
  } as Theme
);
