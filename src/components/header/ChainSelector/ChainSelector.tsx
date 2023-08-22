import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { useAtomValue } from "jotai";
import {
  CaretDown as ChevronDown,
  CaretUp as ChevronUp,
  Warning as AlertTriangle
} from "phosphor-react";
import { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { getConnection } from "../../../lib/connection";
import { ConnectionType } from "../../../lib/connection/types";
import { WalletConnectV2 } from "../../../lib/connection/WalletConnectV2";
import { getChainInfo } from "../../../lib/constants/chainInfo";
import {
  getChainPriority,
  L1_CHAIN_IDS,
  L2_CHAIN_IDS,
  TESTNET_CHAIN_IDS,
  UniWalletSupportedChains
} from "../../../lib/constants/chains";
import { colors } from "../../../lib/styles/colors";
import { getSupportedChainIdsFromWalletConnectSession } from "../../../lib/utils/getSupportedChainIdsFromWalletConnectSession";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useOnClickOutside } from "../../../lib/utils/hooks/useOnClickOutside";
import useSelectChain from "../../../lib/utils/hooks/useSelectChain";
import useSyncChainQuery from "../../../lib/utils/hooks/useSyncChainQuery";
import { Portal } from "../../portal/Portal";
import Tooltip from "../../tooltip/Tooltip";
import { showTestnetsAtom } from "../accountDrawer/TestnetsToggle";
import { NavDropdown } from "../navDropdown/NavDropdown";
import ChainSelectorRow from "./ChainSelectorRow";

const IconAndChevron = styled.div`
  &:hover {
    background: ${colors.lightGrey} !important;
  }
`;

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
      <div
        data-testid="chain-selector-options"
        style={{ paddingLeft: "8px", paddingRight: "8px" }}
      >
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
        <IconAndChevron
          data-testid="chain-selector"
          style={{
            display: "flex",
            alignItems: "center",
            height: "40px",
            gap: "8px",
            flexDirection: "row",
            background: isOpen ? colors.lightGrey : "none",
            borderRadius: "8px",
            padding: "1px 6px"
          }}
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
        </IconAndChevron>
      </Tooltip>
      {isOpen && (isMobile ? <Portal>{dropdown}</Portal> : <>{dropdown}</>)}
    </div>
  );
};
