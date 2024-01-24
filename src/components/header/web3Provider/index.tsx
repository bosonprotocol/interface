import {
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider
} from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { usePrevious } from "lib/utils/hooks/usePrevious";
import { ReactNode, useEffect } from "react";
import { useConnectedWallets } from "state/wallets/hooks";

import { connections, getConnection } from "../../../lib/connection";
import useEagerlyConnect from "../../../lib/utils/hooks/useEagerlyConnect";

export default function Web3Provider({ children }: { children: ReactNode }) {
  useEagerlyConnect();
  const connectors = connections.map<[Connector, Web3ReactHooks]>(
    ({ hooks, connector }) => [connector, hooks]
  );

  return (
    <Web3ReactProvider connectors={connectors}>
      <Updater />
      {children}
    </Web3ReactProvider>
  );
}

/** A component to run hooks under the Web3ReactProvider context. */
function Updater() {
  const { account } = useWeb3React();

  const { connector } = useWeb3React();

  const previousAccount = usePrevious(account);
  const [, addConnectedWallet] = useConnectedWallets();
  useEffect(() => {
    if (account && account !== previousAccount) {
      const walletType = getConnection(connector)?.getName() ?? "";

      addConnectedWallet({ account, walletType });
    }
  }, [account, addConnectedWallet, connector, previousAccount]);

  return null;
}
