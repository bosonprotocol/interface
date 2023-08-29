import { ConfigId, ProtocolConfig } from "@bosonprotocol/react-kit";
import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { useConfigContext } from "components/config/ConfigContext";
import { useAtomValue } from "jotai";
import { envConfigsFilteredByEnv } from "lib/config";
import {
  CaretDown as ChevronDown,
  CaretUp as ChevronUp,
  Warning as AlertTriangle
} from "phosphor-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { getConnection } from "../../../lib/connection";
import { ConnectionType } from "../../../lib/connection/types";
import { WalletConnectV2 } from "../../../lib/connection/WalletConnectV2";
import { getChainInfo } from "../../../lib/constants/chainInfo";
import {
  getChainPriority,
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

const NETWORK_SELECTOR_CHAINS = envConfigsFilteredByEnv;
const NETWORK_SELECTOR_CHAINS_IDS = NETWORK_SELECTOR_CHAINS.map(
  (config) => config.chainId as ChainId
);

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
      return NETWORK_SELECTOR_CHAINS_IDS;
  }
}

export const ChainSelector = ({ leftAlign }: ChainSelectorProps) => {
  const { config } = useConfigContext();
  const { address } = useAccount();
  const { chainId, account } = useWeb3React();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isXS: isMobile } = useBreakpoints();

  const showTestnets = useAtomValue(showTestnetsAtom);
  const walletSupportsChain = useWalletSupportedChains();

  const [supportedConfigs] = useMemo(() => {
    const { supported } = NETWORK_SELECTOR_CHAINS.filter((config) => {
      return showTestnets || !TESTNET_CHAIN_IDS.includes(config.chainId as any);
    })
      .sort(
        ({ chainId: a }, { chainId: b }) =>
          getChainPriority(a as ChainId) - getChainPriority(b as ChainId)
      )
      .reduce(
        (acc, config) => {
          const { chainId: chain } = config;
          if (walletSupportsChain.includes(chain as ChainId)) {
            acc.supported.push(config);
          }
          return acc;
        },
        { supported: [] } as Record<string, ProtocolConfig[]>
      );
    return [supported];
  }, [showTestnets, walletSupportsChain]);

  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false), [modalRef]);
  const info = getChainInfo(chainId);
  // TODO: remove
  console.log(
    "chainId",
    chainId,
    "config.envConfig.chainId",
    config.envConfig.chainId,
    config.envConfig.configId,
    { account, address }
  );
  const [activeConfigId, setActiveConfigId] = useState<ConfigId>(
    config.envConfig.configId
  );
  useEffect(() => {
    setActiveConfigId(config.envConfig.configId);
  }, [config.envConfig.configId]);
  const selectChain = useSelectChain({ throwErrors: true });
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
        {supportedConfigs.map((config) => (
          <ChainSelectorRow
            disabled={!walletSupportsChain.includes(config.chainId as ChainId)}
            onSelectChain={() => onSelectChain(config)}
            targetChain={config.chainId as ChainId}
            label={config.envName}
            key={config.configId}
            active={config.configId === activeConfigId}
            isPending={config.configId === pendingConfigId}
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
