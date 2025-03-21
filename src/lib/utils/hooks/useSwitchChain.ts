import { FALLBACK_URLS, getEnvConfigs } from "@bosonprotocol/react-kit";
import { ChainId } from "@uniswap/sdk-core";
import { Connector } from "@web3-react/types";
import { CONFIG } from "lib/config";
import { useCallback } from "react";
import { useAppDispatch } from "state/hooks";
import { endSwitchingChain, startSwitchingChain } from "state/wallets/reducer";

import {
  coinbaseWalletConnection,
  networkConnection,
  walletConnectV2Connection
} from "../../connection";
import { getChainInfo } from "../../constants/chainInfo";
import {
  ChainId_POLYGON_AMOY,
  isSupportedChain,
  SupportedChainsType
} from "../../constants/chains";
import { useChainId } from "./connection/connection";
const RPC_URLS = CONFIG.rpcUrls;
const localChainId = 31337;
const localRpcUrl = getEnvConfigs("local").find(
  (localConfig) => localConfig.chainId === localChainId
)?.jsonRpcUrl;
function getRpcUrl(chainId: SupportedChainsType): string {
  switch (chainId) {
    case ChainId.MAINNET:
    case ChainId.SEPOLIA:
    case ChainId_POLYGON_AMOY:
      return RPC_URLS[chainId][0];
    case localChainId: {
      if (localRpcUrl) {
        return localRpcUrl;
      }
      throw new Error(`chain ${localChainId} is not supported`);
    }
    // Attempting to add a chain using an infura URL will not work, as the URL will be unreachable from the MetaMask background page.
    // MetaMask allows switching to any publicly reachable URL, but for novel chains, it will display a warning if it is not on the "Safe" list.
    // See the definition of FALLBACK_URLS for more details.
    default:
      return FALLBACK_URLS[chainId][0];
  }
}

export function useSwitchChain(doConnect = true) {
  const connectedChain = useChainId();

  // if you are connected, all good
  // if you are not, then do nothing if it's from the chainselector (doConnect = false)
  const dispatch = useAppDispatch();
  return useCallback(
    async (connector: Connector, chainId: ChainId) => {
      if (!connectedChain && !doConnect) {
        return;
      }
      if (!isSupportedChain(chainId)) {
        throw new Error(
          `Chain ${chainId} not supported for connector (${typeof connector})`
        );
      } else {
        dispatch(startSwitchingChain(chainId));
        try {
          if (
            [
              walletConnectV2Connection.connector,
              coinbaseWalletConnection.connector,
              networkConnection.connector
            ].includes(connector)
          ) {
            await connector.activate(chainId);
          } else {
            const info = getChainInfo(chainId);
            const addChainParameter = {
              chainId,
              chainName: info.label,
              rpcUrls: [getRpcUrl(chainId)],
              nativeCurrency: info.nativeCurrency,
              blockExplorerUrls: [info.explorer]
            };
            await connector.activate(addChainParameter);
          }
        } catch (error) {
          // In activating a new chain, the connector passes through a deactivated state.
          // If we fail to switch chains, it may remain in this state, and no longer be usable.
          // We defensively re-activate the connector to ensure the user does not notice any change.
          try {
            await connector.activate();
          } catch (error) {
            console.error("Failed to re-activate connector", error);
          }
          throw error;
        } finally {
          dispatch(endSwitchingChain());
        }
      }
    },
    [connectedChain, dispatch, doConnect]
  );
}
