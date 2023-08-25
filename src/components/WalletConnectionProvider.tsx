import { useWeb3React } from "@web3-react/core";
import { ReactNode, useEffect } from "react";
import { useAccount, useConnect, WagmiConfig } from "wagmi";

import { getConnectors, useWagmiConfig } from "../lib/wallet-connection";
import { useConfigContext } from "./config/ConfigContext";

interface Props {
  children: ReactNode;
}

/**
 * Component that forcefully connects wagmi if it's already connected in web3React
 * @param param0 children
 * @returns children
 */
function ForceConnectWagmi({ children }: Props) {
  const { config } = useConfigContext();
  const { account } = useWeb3React();
  const { address } = useAccount();
  const { connect } = useConnect();
  useEffect(() => {
    if (account && !address && config.envConfig.chainId) {
      const { connectors } = getConnectors(config.envConfig.chainId);
      const connectorsList = connectors();
      connect({
        chainId: config.envConfig.chainId,
        connector: connectorsList[0] // TODO: verify this
      });
    }
  }, [account, address, config.envConfig.chainId, connect]);
  return <>{children}</>;
}

export default function WalletConnectionProvider({ children }: Props) {
  const wagmiConfig = useWagmiConfig();
  return (
    <WagmiConfig config={wagmiConfig}>
      <ForceConnectWagmi>{children}</ForceConnectWagmi>
    </WagmiConfig>
  );
}
