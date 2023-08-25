import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";

import { useWagmiConfig } from "../lib/wallet-connection";

interface Props {
  children: ReactNode;
}

export default function WalletConnectionProvider({ children }: Props) {
  const wagmiConfig = useWagmiConfig();
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
