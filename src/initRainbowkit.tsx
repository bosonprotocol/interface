import "@rainbow-me/rainbowkit/styles.css";

import {
  Chain,
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { CONFIG } from "./lib/config";

const existingChain = Object.values(chain).find(
  (value) => value.id === CONFIG.chainId
);

const chainToShow: Chain = existingChain
  ? existingChain
  : ({
      id: CONFIG.chainId,
      name: "Boson PoA",
      network: "boson",
      iconUrl: undefined,
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
    } as Chain);
const { provider, chains } = configureChains(
  [chainToShow],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
);
const { connectors } = getDefaultWallets({
  appName: "Boson dApp",
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

interface Props {
  children: JSX.Element;
}
export default function InitRainbowkit({ children }: Props) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
