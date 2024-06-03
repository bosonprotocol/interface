import { ConfigId, ProtocolConfig } from "@bosonprotocol/react-kit";
import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { useConfigContext } from "components/config/ConfigContext";
import { envConfigsFilteredByEnv } from "lib/config";
import {
  CaretDown as ChevronDown,
  CaretUp as ChevronUp,
  Warning as AlertTriangle
} from "phosphor-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { getConnection } from "../../../lib/connection";
import { ConnectionType } from "../../../lib/connection/types";
import { WalletConnectV2 } from "../../../lib/connection/WalletConnectV2";
import { getChainInfo } from "../../../lib/constants/chainInfo";
import {
  getChainPriority,
  TESTNET_CHAIN_IDS,
  UniWalletSupportedChains
} from "../../../lib/constants/chains";
import { getSupportedChainIdsFromWalletConnectSession } from "../../../lib/utils/getSupportedChainIdsFromWalletConnectSession";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useOnClickOutside } from "../../../lib/utils/hooks/useOnClickOutside";
import useSelectChain from "../../../lib/utils/hooks/useSelectChain";
import useSyncChainQuery from "../../../lib/utils/hooks/useSyncChainQuery";
import { Portal } from "../../portal/Portal";
import Tooltip from "../../tooltip/Tooltip";
import { NavDropdown } from "../navDropdown/NavDropdown";
import ChainSelectorRow from "./ChainSelectorRow";

const IconAndChevron = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  height: 40px;
  gap: 8px;
  flex-direction: row;
  ${({ $isOpen }) => css`
    background: ${$isOpen ? css`var(--buttonBgColor)` : "none"};
  `}
  border-radius: 8px;
  padding: 1px 6px;
  &:hover {
    background: color-mix(in srgb, var(--buttonBgColor) 90%, black);
  }
`;

const NETWORK_SELECTOR_CHAINS = envConfigsFilteredByEnv;
const NETWORK_SELECTOR_CHAINS_IDS = NETWORK_SELECTOR_CHAINS.map(
  (config) => config.chainId as ChainId
);

interface ChainSelectorProps {
  leftAlign?: boolean;
}

function useWalletSupportedChains(): ChainId[] {
  const { connector } = useWeb3React();

  const connectionType = getConnection(connector)?.type;

  switch (connectionType) {
    case ConnectionType.WALLET_CONNECT_V2:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return getSupportedChainIdsFromWalletConnectSession(
        (connector as WalletConnectV2).provider?.session
      );
    case ConnectionType.UNISWAP_WALLET_V2:
      return UniWalletSupportedChains;
    default:
      return NETWORK_SELECTOR_CHAINS_IDS;
  }
}
const chevronProps = {
  height: 20,
  width: 20
};
export const ChainSelector = ({ leftAlign }: ChainSelectorProps) => {
  const { config } = useConfigContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isXS: isMobile } = useBreakpoints();

  const walletSupportsChain = useWalletSupportedChains();

  const [supportedConfigs, unsupportedChains] = useMemo(() => {
    const { supported, unsupported } = NETWORK_SELECTOR_CHAINS.filter(
      (config) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          TESTNET_CHAIN_IDS.includes(config.chainId as any)
        );
      }
    )
      .sort(
        ({ chainId: a }, { chainId: b }) =>
          getChainPriority(a as ChainId) - getChainPriority(b as ChainId)
      )
      .reduce(
        (acc, config) => {
          const { chainId: chain } = config;
          if (walletSupportsChain.includes(chain as ChainId)) {
            acc.supported.push(config);
          } else {
            acc.unsupported.push(config);
          }
          return acc;
        },
        { supported: [], unsupported: [] } as Record<string, ProtocolConfig[]>
      );
    return [supported, unsupported];
  }, [walletSupportsChain]);

  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false), [modalRef]);
  const info = getChainInfo(config.envConfig.chainId); // TODO: verify if this is correct or it should be chainId as before
  const [activeConfigId, setActiveConfigId] = useState<ConfigId>(
    config.envConfig.configId
  );
  useEffect(() => {
    setActiveConfigId(config.envConfig.configId);
  }, [config.envConfig.configId]);
  const selectChain = useSelectChain({ throwErrors: true, doConnect: false });
  useSyncChainQuery();

  const [pendingConfigId, setPendingConfigId] = useState<ConfigId>();
  const onSelectChain = useCallback(
    async (config: ProtocolConfig) => {
      try {
        setPendingConfigId(config.configId);
        await selectChain(config.configId);
        setActiveConfigId(config.configId);
      } finally {
        setPendingConfigId(undefined);
        setIsOpen(false);
      }
    },
    [selectChain, setIsOpen]
  );

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
        {supportedConfigs.map((config) => (
          <ChainSelectorRow
            disabled={!walletSupportsChain.includes(config.chainId as ChainId)}
            onSelectChain={() => onSelectChain(config)}
            targetChain={config.chainId as ChainId}
            key={config.configId}
            active={config.configId === activeConfigId}
            isPending={config.configId === pendingConfigId}
          />
        ))}
        {unsupportedChains.map((config) => (
          <ChainSelectorRow
            disabled
            onSelectChain={() => undefined}
            targetChain={config.chainId as ChainId}
            key={config.configId}
            isPending={false}
            active={config.configId === activeConfigId}
          />
        ))}
      </div>
    </NavDropdown>
  );

  return (
    <div style={{ position: "relative", display: "flex" }} ref={ref}>
      <Tooltip
        content={`Your wallet's current network is unsupported.`}
        disabled={isSupported}
      >
        <IconAndChevron
          $isOpen={isOpen}
          data-testid="chain-selector"
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
