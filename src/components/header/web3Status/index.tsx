import { Button } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import { getConnection } from "lib/connection";
import { colors } from "lib/styles/colors";
import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import { useAccount } from "lib/utils/hooks/ethers/connection";
import { useBreakpoints } from "lib/utils/hooks/useBreakpoints";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import useENSName from "lib/utils/hooks/useENSName";
import { useLast } from "lib/utils/hooks/useLast";
import { useCallback } from "react";
import { useAppSelector } from "state/hooks";
import styled from "styled-components";

import { breakpoint, breakpointNumbers } from "../../../lib/styles/breakpoint";
import { formatAddress } from "../../../lib/utils/address";
import { useAccountDrawer } from "../accountDrawer";
import PrefetchBalancesWrapper from "../accountDrawer/PrefetchBalancesWrapper";
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
  :focus {
    outline: none;
  }
`;

const breakpointWhenConnectButtonOverflows = "1300px";
const Web3StatusConnected = styled(Web3StatusGeneric)<{ $color: string }>`
  font-weight: 500;
  color: ${({ $color }) => $color};
  :hover,
  :focus {
    border: 1px solid color-mix(in srgb, var(--buttonBgColor) 90%, black);
  }
  @media (min-width: ${breakpointNumbers.xs}px) and (max-width: ${breakpointNumbers.l -
    1}px) {
    background-color: var(--buttonBgColor);
    border: 1px solid var(--buttonBgColor);
  }
  @media (min-width: ${breakpointWhenConnectButtonOverflows}) {
    background-color: var(--buttonBgColor);
    border: 1px solid var(--buttonBgColor);
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

const StyledConnectButton = styled(Button)`
  background-color: var(--buttonBgColor);
  color: inherit;
`;

function Web3StatusInner({ showOnlyIcon }: { showOnlyIcon?: boolean }) {
  const { isLteXS } = useBreakpoints();
  const switchingChain = useAppSelector(
    (state) => state.wallets.switchingChain
  );
  const ignoreWhileSwitchingChain = useCallback(
    () => !switchingChain,
    [switchingChain]
  );
  const { connector } = useLast(useWeb3React(), ignoreWhileSwitchingChain);
  const { account } = useLast(useAccount(), ignoreWhileSwitchingChain);
  const connection = getConnection(connector);
  const { ENSName } = useENSName(account);

  const [, toggleAccountDrawer] = useAccountDrawer();
  const handleWalletDropdownClick = useCallback(() => {
    toggleAccountDrawer();
  }, [toggleAccountDrawer]);
  const buttonBgColor = useCSSVariable("--buttonBgColor") || colors.primary;
  const textColor = useCSSVariable("--textColor") || colors.black;
  const connectedButtonTextColor = getColor1OverColor2WithContrast({
    color2: useCSSVariable("--buttonBgColor") || colors.primary,
    color1: useCSSVariable("--textColor") || colors.black
  });
  if (account) {
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
    <StyledConnectButton
      tabIndex={0}
      onClick={handleWalletDropdownClick}
      data-testid="navbar-connect-wallet"
      size={isLteXS ? "small" : "regular"}
      variant="primaryFill"
      style={{
        whiteSpace: "pre",
        color: connectedButtonTextColor
      }}
    >
      Connect Wallet
    </StyledConnectButton>
  );
}

export default function Web3Status({
  showOnlyIcon
}: {
  showOnlyIcon?: boolean;
}) {
  const [isDrawerOpen] = useAccountDrawer();
  return (
    <PrefetchBalancesWrapper shouldFetchOnAccountUpdate={isDrawerOpen}>
      <Web3StatusInner showOnlyIcon={showOnlyIcon} />
    </PrefetchBalancesWrapper>
  );
}
