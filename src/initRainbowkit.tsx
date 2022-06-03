import "@rainbow-me/rainbowkit/styles.css";

import {
  Chain,
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";

import { CONFIG } from "./lib/config";
import { jsonRpcProvider } from "./wagmi-core-providers-jsonRpc.esm";

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
      ensAddress: "0x7208c5FdF31FCc73CeeeF783F6b160eC1a5F18c3",
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
  [jsonRpcProvider({ rpc: (chain: any) => ({ http: chain.rpcUrls.default }) })]
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
