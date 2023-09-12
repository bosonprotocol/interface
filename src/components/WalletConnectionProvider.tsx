/* eslint-disable unused-imports/no-unused-imports */
import { useWeb3React } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { ReactNode, useEffect } from "react";
import { useAccount, useConnect, useNetwork, WagmiConfig } from "wagmi";

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
  const { account, connector } = useWeb3React();
  const { address } = useAccount();
  const { connect } = useConnect();
  const { chain, chains } = useNetwork();
  useEffect(() => {
    if (
      account &&
      !address &&
      config.envConfig.chainId &&
      chains[0].id === config.envConfig.chainId && // we want to connect (enter if) if config.envConfig.chainId doesnt change anymore (at the start)
      chain?.id !== config.envConfig.chainId
    ) {
      const { connectors } = getConnectors(config.envConfig.chainId);
      const connectorsList = connectors();
      connect({
        chainId: config.envConfig.chainId,
        connector:
          connectorsList.find((connector_) =>
            connector instanceof MetaMask
              ? connector_.id === "metaMask"
              : connector_.id === "walletConnect"
          ) || connectorsList[0]
      });
    }
  }, [
    account,
    address,
    config.envConfig.chainId,
    connect,
    connector,
    chain?.id,
    chains
  ]);
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
