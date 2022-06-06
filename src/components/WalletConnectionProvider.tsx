import "@rainbow-me/rainbowkit/styles.css";

import { Image as AccountImage } from "@davatar/react";
import { AvatarComponent, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";

import {
  chains,
  wagmiClient,
  walletConnectionTheme
} from "../lib/wallet-connection";

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
    <AccountImage size={50} address={address} />
  );
};
