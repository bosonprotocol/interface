import { Button, ButtonSize } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import { getConnection } from "lib/connection";
import { useBreakpoints } from "lib/utils/hooks/useBreakpoints";
import { useLast } from "lib/utils/hooks/useLast";
import { useCallback } from "react";
import { useAppSelector } from "state/hooks";
import styled from "styled-components";
import { useEnsName } from "wagmi";

import { breakpoint, breakpointNumbers } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { formatAddress } from "../../../lib/utils/address";
import { Portal } from "../../portal/Portal";
import PortfolioDrawer, { useAccountDrawer } from "../accountDrawer";
import PrefetchBalancesWrapper from "../accountDrawer/PrefetchBalancesWrapper";
import StatusIcon from "../identicon/StatusIcon";
import { flexColumnNoWrap, flexRowNoWrap } from "../styles";

const Web3StatusGeneric = styled.button`
  ${flexRowNoWrap};
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;
  height: 45px;
  margin-right: 2px;
  margin-left: 2px;
  :focus {
    outline: none;
  }
`;

export const IconWrapper = styled.div<{ size?: number }>`
  position: relative;
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
  ${breakpoint.m} {
    align-items: flex-end;
  } ;
`;

const Web3StatusConnected = styled(Web3StatusGeneric)<{
  isClaimAvailable?: boolean;
  pending?: boolean;
}>`
  background-color: ${({ pending }) =>
    pending ? colors.secondary : colors.lightGrey};
  border: 1px solid
    ${({ pending }) => (pending ? colors.secondary : colors.lightGrey)};
  font-weight: 500;
  border: ${({ isClaimAvailable }) =>
    isClaimAvailable && `1px solid ${colors.secondary}`};
  :hover,
  :focus {
    border: 1px solid ${colors.darkGrey};
  }

  @media only screen and (max-width: ${breakpointNumbers.l}px) {
    ${IconWrapper} {
      margin-right: 0;
    }
  }
`;
const navSearchInputVisibleSize = 1100;

const AddressAndChevronContainer = styled.div`
  display: flex;

  @media only screen and (max-width: ${navSearchInputVisibleSize}px) {
    display: none;
  }
`;

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`;

const StyledConnectButton = styled(Button)`
  color: ${colors.darkGrey};
`;

function Web3StatusInner() {
  const { isLteXS } = useBreakpoints();
  const switchingChain = useAppSelector(
    (state) => state.wallets.switchingChain
  );
  const ignoreWhileSwitchingChain = useCallback(
    () => !switchingChain,
    [switchingChain]
  );
  const { account, connector } = useLast(
    useWeb3React(),
    ignoreWhileSwitchingChain
  );
  const connection = getConnection(connector);
  const { data: ENSName } = useEnsName({ address: account as `0x${string}` });

  const [, toggleAccountDrawer] = useAccountDrawer();
  const handleWalletDropdownClick = useCallback(() => {
    toggleAccountDrawer();
  }, [toggleAccountDrawer]);

  if (account) {
    return (
      <Web3StatusConnected
        disabled={Boolean(switchingChain)}
        data-testid="web3-status-connected"
        onClick={handleWalletDropdownClick}
        isClaimAvailable={false}
      >
        <StatusIcon
          account={account}
          size={24}
          connection={connection}
          showMiniIcons={false}
        />

        <AddressAndChevronContainer>
          <Text>{ENSName || formatAddress(account)}</Text>
        </AddressAndChevronContainer>
      </Web3StatusConnected>
    );
  } else {
    return (
      <StyledConnectButton
        tabIndex={0}
        onClick={handleWalletDropdownClick}
        data-testid="navbar-connect-wallet"
        size={isLteXS ? ButtonSize.Small : ButtonSize.Medium}
        variant="primaryFill"
        style={{
          whiteSpace: "pre"
        }}
      >
        Connect Wallet
      </StyledConnectButton>
    );
  }
}

export default function Web3Status() {
  const [isDrawerOpen] = useAccountDrawer();
  return (
    <PrefetchBalancesWrapper shouldFetchOnAccountUpdate={isDrawerOpen}>
      <Web3StatusInner />
      <Portal>
        <PortfolioDrawer />
      </Portal>
    </PrefetchBalancesWrapper>
  );
}
