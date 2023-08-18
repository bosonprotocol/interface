import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { ReactNode } from "react";

import { connections } from "../../connection";
import useEagerlyConnect from "../../hooks/useEagerlyConnect";

export default function Web3Provider({ children }: { children: ReactNode }) {
  useEagerlyConnect();
  const connectors = connections.map<[Connector, Web3ReactHooks]>(
    ({ hooks, connector }) => [connector, hooks]
  );

  return (
    <Web3ReactProvider connectors={connectors}>
      {/* <Updater /> */}
      {children}
    </Web3ReactProvider>
  );
}
