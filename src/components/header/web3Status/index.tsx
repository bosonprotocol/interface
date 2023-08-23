import { useWeb3React } from "@web3-react/core";
import { getConnection } from "lib/connection";
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

// https://stackoverflow.com/a/31617326
const FULL_BORDER_RADIUS = 9999;

const Web3StatusGeneric = styled.button`
  ${flexRowNoWrap};
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: ${FULL_BORDER_RADIUS}px;
  cursor: pointer;
  user-select: none;
  height: 36px;
  margin-right: 2px;
  margin-left: 2px;
  :focus {
    outline: none;
  }
`;

const Web3StatusConnectWrapper = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  background-color: ${colors.blue};
  border-radius: ${FULL_BORDER_RADIUS}px;
  border: none;
  padding: 0;
  height: 40px;

  color: ${colors.secondary};
  :hover {
    color: ${colors.blue};
    stroke: ${colors.blue};
  }

  transition: 125ms color ease-in;
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
    border: 1px solid black;
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

const StyledConnectButton = styled.button`
  background-color: transparent;
  border: none;
  border-top-left-radius: ${FULL_BORDER_RADIUS}px;
  border-bottom-left-radius: ${FULL_BORDER_RADIUS}px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  padding: 10px 12px;
  color: inherit;
`;

function Web3StatusInner() {
  // const switchingChain = false; // TODO:
  const switchingChain = useAppSelector(
    (state) => state.wallets.switchingChain
  );
  // const ignoreWhileSwitchingChain = useCallback(
  //   () => !switchingChain,
  //   [switchingChain]
  // );
  const { account, connector } = useWeb3React();
  // const { account, connector } = useLast(
  //   useWeb3React(),
  //   ignoreWhileSwitchingChain
  // );
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
      <Web3StatusConnectWrapper
        tabIndex={0}
        onKeyPress={(e) => e.key === "Enter" && handleWalletDropdownClick()}
        onClick={handleWalletDropdownClick}
      >
        <StyledConnectButton tabIndex={-1} data-testid="navbar-connect-wallet">
          Connect
        </StyledConnectButton>
      </Web3StatusConnectWrapper>
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
