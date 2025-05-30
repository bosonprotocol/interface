import { Button, hooks, ThemedButton } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import Tooltip from "components/tooltip/Tooltip";
import { Grid } from "components/ui/Grid";
import { envConfigsFilteredByEnv } from "lib/config";
import { getConnection } from "lib/connection";
import { CHAIN_IDS_TO_FRIENDLY_NAMES } from "lib/constants/chains";
import { colors } from "lib/styles/colors";
import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import { getConfigsByChainId } from "lib/utils/config/getConfigsByChainId";
import { useAccount, useChainId } from "lib/utils/hooks/connection/connection";
import { useBreakpoints } from "lib/utils/hooks/useBreakpoints";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import useENSName from "lib/utils/hooks/useENSName";
import { useLast } from "lib/utils/hooks/useLast";
import { memo, useCallback, useEffect, useRef } from "react";
import { useAppSelector } from "state/hooks";
import styled, { CSSProperties } from "styled-components";

import { breakpoint, breakpointNumbers } from "../../../lib/styles/breakpoint";
import { formatAddress } from "../../../lib/utils/address";
import { useAccountDrawer } from "../accountDrawer";
import StatusIcon from "../identicon/StatusIcon";
import { flexRowNoWrap } from "../styles";

const Web3StatusGeneric = styled.button`
  ${flexRowNoWrap};
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;

  margin-right: 2px;
  margin-left: 2px;
  &:focus {
    outline: none;
  }
`;

const breakpointWhenConnectButtonOverflows = "1300px";
const Web3StatusConnected = styled(Web3StatusGeneric)<{ $color: string }>`
  border: 2px solid transparent;
  width: auto;
  font-weight: 500;
  color: ${({ $color }) => $color};
  &:hover,
  &:focus {
    border: 2px solid color-mix(in srgb, var(--buttonBgColor) 90%, black);
  }
  @media (min-width: ${breakpointNumbers.xs}px) and (max-width: ${breakpointNumbers.l -
    1}px) {
    background-color: var(--buttonBgColor);
    border: 2px solid var(--buttonBgColor);
  }
  @media (min-width: ${breakpointWhenConnectButtonOverflows}) {
    background-color: var(--buttonBgColor);
    border: 2px solid var(--buttonBgColor);
  }
  ${breakpoint.xxs} {
    border-radius: 8px;
    margin: initial;
    * {
      margin: initial;
    }
  }
  @media (min-width: ${breakpointNumbers.l}px) and (max-width: ${breakpointWhenConnectButtonOverflows}) {
    border-radius: 8px;
    margin: initial;
    * {
      margin: initial;
    }
  }
`;

const AddressAndChevronContainer = styled.div`
  display: flex;

  ${breakpoint.xxs} {
    display: none;
  }
  @media (min-width: ${breakpointNumbers.l}px) and (max-width: ${breakpointWhenConnectButtonOverflows}) {
    display: none;
  }
  @media (min-width: ${breakpointWhenConnectButtonOverflows}) {
    display: flex;
  }
`;

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`;

const StyledConnectButton = styled(Button)<{ $color: CSSProperties["color"] }>`
  background-color: var(--buttonBgColor);
  color: ${({ $color }) => $color};
`;

const getCommonWalletButtonProps = (isXXS: boolean) =>
  ({
    tabIndex: 0,
    size: isXXS ? "small" : "regular",
    style: {
      whiteSpace: "pre"
    }
  }) as const;
function Web3StatusInner({ showOnlyIcon }: { showOnlyIcon?: boolean }) {
  const switchingChain = useAppSelector(
    (state) => state.wallets.switchingChain
  );
  const ignoreWhileSwitchingChain = useCallback(
    () => !switchingChain,
    [switchingChain]
  );
  const { account } = useLast(useAccount(), ignoreWhileSwitchingChain);

  const { isActive } = useWeb3React();
  const chainId = useChainId();
  const accountRef = useRef(account);
  const chainIdRef = useRef(chainId);
  useEffect(() => {
    if (account && !accountRef.current) {
      accountRef.current = account;
    }
  }, [account]);
  useEffect(() => {
    if (account && chainId && chainId !== chainIdRef.current) {
      chainIdRef.current = chainId;
    }
  }, [chainId, account]);
  const { isXXS } = useBreakpoints();

  const { connector } = useLast(useWeb3React(), ignoreWhileSwitchingChain);
  const connection = getConnection(connector);
  const { ENSName } = useENSName(account);

  const [, toggleAccountDrawer] = useAccountDrawer();
  const handleWalletDropdownClick = useCallback(() => {
    toggleAccountDrawer();
  }, [toggleAccountDrawer]);
  const buttonBgColor = useCSSVariable("--buttonBgColor") || colors.green;
  const textColor = useCSSVariable("--textColor") || colors.black;
  const connectedButtonTextColor = getColor1OverColor2WithContrast({
    color2: buttonBgColor,
    color1: textColor
  });
  const wasConnected = !!accountRef.current;
  const previousChainId = chainIdRef.current;
  const configsPreviousChain = getConfigsByChainId(previousChainId);
  const configsCurrentChain = getConfigsByChainId(chainId);
  const isMagicLoggedIn = hooks.useIsMagicLoggedIn();
  const connectedToWrongChainId = isMagicLoggedIn
    ? false
    : account
      ? !configsCurrentChain?.length
      : wasConnected && !configsPreviousChain?.length && isActive;

  if (!connectedToWrongChainId && account) {
    const color = getColor1OverColor2WithContrast({
      color2: buttonBgColor,
      color1: textColor
    });
    return (
      <Web3StatusConnected
        disabled={Boolean(switchingChain)}
        data-testid="web3-status-connected"
        onClick={handleWalletDropdownClick}
        $color={color}
      >
        <StatusIcon
          account={account}
          size={24}
          connection={connection}
          showMiniIcons={showOnlyIcon}
        />

        <AddressAndChevronContainer>
          <Text>{ENSName || formatAddress(account)}</Text>
        </AddressAndChevronContainer>
      </Web3StatusConnected>
    );
  }

  return (
    <Grid justifyContent="center" flexDirection="column">
      {connectedToWrongChainId ? (
        <Tooltip
          content={
            <div>
              Connect to{" "}
              {envConfigsFilteredByEnv
                .map(
                  (config) =>
                    `${
                      CHAIN_IDS_TO_FRIENDLY_NAMES[
                        config.chainId as keyof typeof CHAIN_IDS_TO_FRIENDLY_NAMES
                      ]
                    } (${config.chainId})`
                )
                .join(", ")}{" "}
              and click here again
            </div>
          }
        >
          <ThemedButton
            {...getCommonWalletButtonProps(isXXS)}
            onClick={handleWalletDropdownClick}
            themeVal="orangeInverse"
          >
            Wrong network
          </ThemedButton>
        </Tooltip>
      ) : (
        <StyledConnectButton
          onClick={handleWalletDropdownClick}
          data-testid="navbar-connect-wallet"
          {...getCommonWalletButtonProps(isXXS)}
          variant="primaryFill"
          style={{
            ...getCommonWalletButtonProps(isXXS).style
          }}
          $color={connectedButtonTextColor}
        >
          Connect Wallet
        </StyledConnectButton>
      )}
    </Grid>
  );
}

export const ConnectWallet = memo(function Web3Status({
  showOnlyIcon
}: {
  showOnlyIcon?: boolean;
}) {
  return (
    <div>
      <Web3StatusInner showOnlyIcon={showOnlyIcon} />
    </div>
  );
});

export default ConnectWallet;
