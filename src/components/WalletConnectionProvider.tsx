import "@rainbow-me/rainbowkit/styles.css";

import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import {
  AvatarComponent,
  darkTheme,
  RainbowKitProvider,
  Theme
} from "@rainbow-me/rainbowkit";
import { providers } from "ethers";
import merge from "lodash.merge";
import { ReactNode, useMemo } from "react";
import { useSigner, WagmiConfig } from "wagmi";

import { colors } from "../lib/styles/colors";
import { useCSSVariable } from "../lib/utils/hooks/useCSSVariable";
import { chains, wagmiClient } from "../lib/wallet-connection";
import FallbackAvatar from "./avatar/fallback-avatar";
import { EthersAdapterContext } from "./EthersAdapterContext";

interface Props {
  children: ReactNode;
}

function EthersAdapterProvider({ children }: Props) {
  const { data: signer } = useSigner();

  const ethersAdapter = useMemo(() => {
    if (!signer || !signer.provider) {
      return;
    }

    const adapter = new EthersAdapter(
      signer.provider as providers.Web3Provider
    );

    return adapter;
  }, [signer]);

  return (
    <EthersAdapterContext.Provider value={ethersAdapter}>
      {children}
    </EthersAdapterContext.Provider>
  );
}

export default function WalletConnectionProvider({ children }: Props) {
  const secondaryColor = useCSSVariable("--secondary");
  const accentDarkColor = useCSSVariable("--accentDark");
  const walletConnectionTheme = merge(darkTheme({ borderRadius: "medium" }), {
    colors: {
      accentColor: secondaryColor,
      accentColorForeground: accentDarkColor,
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
  } as Theme);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={walletConnectionTheme}
        avatar={CustomAvatar}
        appInfo={{ appName: "Boson dApp" }}
      >
        <EthersAdapterProvider>{children}</EthersAdapterProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img
      src={ensImage}
      alt="Avatar"
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <FallbackAvatar address={address} size={50} />
  );
};
