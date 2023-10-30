import { Connector } from "@web3-react/types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { updateSelectedWallet } from "state/user/reducer";

import {
  getConnection,
  gnosisSafeConnection,
  injectedConnection,
  networkConnection
} from "../../connection";

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`);
  }
}

export default function useEagerlyConnect() {
  const dispatch = useAppDispatch();

  const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
  const rehydrated = useAppSelector((state) => state._persist.rehydrated);

  useEffect(() => {
    if (!selectedWallet) return;
    try {
      const selectedConnection = getConnection(selectedWallet);
      connect(gnosisSafeConnection.connector);
      connect(networkConnection.connector);
      connect(injectedConnection.connector);
      if (selectedConnection) {
        connect(selectedConnection.connector);
      }
    } catch {
      // only clear the persisted wallet type if it failed to connect.
      if (rehydrated) {
        dispatch(updateSelectedWallet({ wallet: undefined }));
      }
      return;
    }
  }, [dispatch, rehydrated, selectedWallet]);
}
