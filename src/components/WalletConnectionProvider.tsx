import "@rainbow-me/rainbowkit/styles.css";

import {
  AvatarComponent,
  darkTheme,
  RainbowKitProvider,
  Theme
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";

import { colors } from "../lib/styles/colors";
import { useCSSVariable } from "../lib/utils/hooks/useCSSVariable";
import { chains, wagmiClient } from "../lib/wallet-connection";
import FallbackAvatar from "./avatar/fallback-avatar";

interface Props {
  children: ReactNode;
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
      body: "Plus Jakarta Sans, sans-serif"
    }
  } as Theme);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={walletConnectionTheme}
        avatar={CustomAvatar}
        appInfo={{ appName: "Boson Interface" }}
      >
        {children}
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
