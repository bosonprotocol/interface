import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
// import { MouseoverTooltip } from "components/Tooltip";
import { useAtomValue } from "jotai";
import {
  CaretDown as ChevronDown,
  CaretUp as ChevronUp,
  Warning as AlertTriangle
} from "phosphor-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import Tooltip from "../../tooltip/Tooltip";
// import * as styles from "./ChainSelector.css";
import ChainSelectorRow from "./ChainSelectorRow";
import { showTestnetsAtom } from "./components/AccountDrawer/TestnetsToggle";
import { NavDropdown } from "./components/NavDropdown/NavDropdown";
import { Portal } from "./components/Portal/Portal";
import { getConnection } from "./connection";
import { ConnectionType } from "./connection/types";
import { WalletConnectV2 } from "./connection/WalletConnectV2";
import { getChainInfo } from "./constants/chainInfo";
import {
  getChainPriority,
  L1_CHAIN_IDS,
  L2_CHAIN_IDS,
  TESTNET_CHAIN_IDS,
  UniWalletSupportedChains
} from "./constants/chains";
import { useOnClickOutside } from "./hooks/useOnClickOutside";
import useSelectChain from "./hooks/useSelectChain";
import useSyncChainQuery from "./hooks/useSyncChainQuery";
import { getSupportedChainIdsFromWalletConnectSession } from "./utils/getSupportedChainIdsFromWalletConnectSession";

const NETWORK_SELECTOR_CHAINS = [...L1_CHAIN_IDS, ...L2_CHAIN_IDS];

interface ChainSelectorProps {
  leftAlign?: boolean;
}

function useWalletSupportedChains(): ChainId[] {
  const { connector } = useWeb3React();

  const connectionType = getConnection(connector).type;

  switch (connectionType) {
    case ConnectionType.WALLET_CONNECT_V2:
      return getSupportedChainIdsFromWalletConnectSession(
        (connector as WalletConnectV2).provider?.session
      );
    case ConnectionType.UNISWAP_WALLET_V2:
      return UniWalletSupportedChains;
    default:
      return NETWORK_SELECTOR_CHAINS;
  }
}

export const ChainSelector = ({ leftAlign }: ChainSelectorProps) => {
  const { chainId } = useWeb3React();
  console.log({
    chainId
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isXS: isMobile } = useBreakpoints();

  const showTestnets = useAtomValue(showTestnetsAtom);
  const walletSupportsChain = useWalletSupportedChains();

  const [supportedChains, unsupportedChains] = useMemo(() => {
    const { supported, unsupported } = NETWORK_SELECTOR_CHAINS.filter(
      (chain: number) => {
        return showTestnets || !TESTNET_CHAIN_IDS.includes(chain);
      }
    )
      .sort((a, b) => getChainPriority(a) - getChainPriority(b))
      .reduce(
        (acc, chain) => {
          if (walletSupportsChain.includes(chain)) {
            acc.supported.push(chain);
          } else {
            acc.unsupported.push(chain);
          }
          return acc;
        },
        { supported: [], unsupported: [] } as Record<string, ChainId[]>
      );
    return [supported, unsupported];
  }, [showTestnets, walletSupportsChain]);

  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false), [modalRef]);

  const info = getChainInfo(chainId);

  const selectChain = useSelectChain();
  useSyncChainQuery();

  const [pendingChainId, setPendingChainId] = useState<ChainId | undefined>(
    undefined
  );

  const onSelectChain = useCallback(
    async (targetChainId: ChainId) => {
      setPendingChainId(targetChainId);
      await selectChain(targetChainId);
      setPendingChainId(undefined);
      setIsOpen(false);
    },
    [selectChain, setIsOpen]
  );

  if (!chainId) {
    return null;
  }

  const isSupported = !!info;

  const dropdown = (
    <NavDropdown
      left={leftAlign ? "0" : "auto"}
      right={leftAlign ? "auto" : "0"}
      ref={modalRef}
    >
      <div data-testid="chain-selector-options">
        {supportedChains.map((selectorChain) => (
          <ChainSelectorRow
            disabled={!walletSupportsChain.includes(selectorChain)}
            onSelectChain={onSelectChain}
            targetChain={selectorChain}
            key={selectorChain}
            isPending={selectorChain === pendingChainId}
          />
        ))}
        {unsupportedChains.map((selectorChain) => (
          <ChainSelectorRow
            disabled
            onSelectChain={() => undefined}
            targetChain={selectorChain}
            key={selectorChain}
            isPending={false}
          />
        ))}
      </div>
    </NavDropdown>
  );

  const chevronProps = {
    height: 20,
    width: 20
  };

  return (
    <div style={{ position: "relative", display: "flex" }} ref={ref}>
      <Tooltip
        content={`Your wallet's current network is unsupported.`}
        disabled={isSupported}
      >
        <div
          data-testid="chain-selector"
          style={{
            display: "flex",
            alignItems: "center",
            height: "40px",
            gap: "8px",
            flexDirection: "row"
          }}
          // background={isOpen ? "accentActiveSoft" : "none"}
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isSupported ? (
            <AlertTriangle size={20} />
          ) : (
            <img
              src={info.logoUrl}
              alt={info.label}
              style={{
                width: "20px",
                height: "20px"
              }}
              data-testid="chain-selector-logo"
            />
          )}
          {isOpen ? (
            <ChevronUp {...chevronProps} />
          ) : (
            <ChevronDown {...chevronProps} />
          )}
        </div>
      </Tooltip>
      {isOpen && (isMobile ? <Portal>{dropdown}</Portal> : <>{dropdown}</>)}
    </div>
  );
};
