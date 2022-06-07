import "@rainbow-me/rainbowkit/styles.css";

import { AvatarComponent, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";

import {
  chains,
  wagmiClient,
  walletConnectionTheme
} from "../lib/wallet-connection";
import FallbackAvatar from "./avatar/fallback-avatar";

interface Props {
  children: ReactNode;
}

export default function WalletConnectionProvider({ children }: Props) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={walletConnectionTheme}
        avatar={CustomAvatar}
        appInfo={{ appName: "Boson dApp" }}
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
