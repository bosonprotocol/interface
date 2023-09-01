import { Percent } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import AnimatedDropdown from "components/animatedDropdown";
import { Scrim } from "components/header/accountDrawer";
import { CloseIcon, Divider } from "components/icons";
import { Portal } from "components/portal/Portal";
import Column, { AutoColumn } from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { isSupportedChain, L2_CHAIN_IDS } from "lib/constants/chains";
import { breakpoint } from "lib/styles/breakpoint";
import { colors } from "lib/styles/colors";
import { useBreakpoints } from "lib/utils/hooks/useBreakpoints";
import useDisableScrolling from "lib/utils/hooks/useDisableScrolling";
import { useOnClickOutside } from "lib/utils/hooks/useOnClickOutside";
import { useMemo, useRef } from "react";
import { useModalIsOpen, useToggleSettingsMenu } from "state/application/hooks";
import { ApplicationModal } from "state/application/reducer";
import { InterfaceTrade } from "state/routing/types";
import { isUniswapXTrade } from "state/routing/utils";
import styled from "styled-components";

import MaxSlippageSettings from "./maxSlippageSettings";
import MenuButton from "./menuButton";
import RouterPreferenceSettings from "./routerPreferenceSettings";
import TransactionDeadlineSettings from "./transactionDeadlineSettings";

const Menu = styled.div`
  position: relative;
`;

const MenuFlyout = styled(AutoColumn)`
  min-width: 20.125rem;
  background-color: ${colors.lightGrey};
  border: 1px solid ${colors.lightGrey};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  position: absolute;
  top: 100%;
  margin-top: 10px;
  right: 0;
  z-index: 100;
  color: ${({ theme }) => theme.textPrimary};
  // TODO: check theme.deprecated_mediaWidth
  // .deprecated_upToMedium
  // min-width: 18.125rem;
  //};
  ${breakpoint.m} {
    min-width: 18.125rem;
  }
  user-select: none;
  padding: 16px;
`;

const ExpandColumn = styled(AutoColumn)`
  gap: 16px;
  padding-top: 16px;
`;

const MobileMenuContainer = styled(Grid)`
  overflow: visible;
  position: fixed;
  height: 100%;
  top: 100vh;
  left: 0;
  right: 0;
  width: 100%;
  // TODO: z-index: Z_INDEX.fixed;
`;

const MobileMenuWrapper = styled(Column)<{ open: boolean }>`
  height: min-content;
  width: 100%;
  padding: 8px 16px 24px;
  background-color: ${colors.lightGrey};
  overflow: hidden;
  position: absolute;
  bottom: ${({ open }) => (open ? `100vh` : 0)};
  transition: bottom 250ms;
  border: ${({ theme }) => `1px solid ${theme.backgroundOutline}`};
  border-radius: 12px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  font-size: 16px;
  box-shadow: unset;
  /* TODO: z-index: Z_INDEX.modal; */
`;

const MobileMenuHeader = styled(Grid)`
  margin-bottom: 16px;
`;

export function SettingsTab({
  autoSlippage,
  chainId,
  trade
}: {
  autoSlippage: Percent;
  chainId?: number;
  trade?: InterfaceTrade;
}) {
  const { chainId: connectedChainId } = useWeb3React();
  const showDeadlineSettings = Boolean(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chainId && !L2_CHAIN_IDS.includes(chainId)
  );

  const node = useRef<HTMLDivElement | null>(null);
  const isOpen = useModalIsOpen(ApplicationModal.SETTINGS);

  const toggleMenu = useToggleSettingsMenu();

  const { isLteS: isMobile } = useBreakpoints();
  const isOpenMobile = isOpen && isMobile;
  const isOpenDesktop = isOpen && !isMobile;

  useOnClickOutside(node, isOpenDesktop ? toggleMenu : undefined);
  useDisableScrolling(isOpen);

  const isChainSupported = isSupportedChain(chainId);

  const Settings = useMemo(
    () => (
      <>
        <AutoColumn gap="16px">
          <RouterPreferenceSettings />
        </AutoColumn>
        <AnimatedDropdown open={!isUniswapXTrade(trade)}>
          <ExpandColumn>
            <Divider />
            <MaxSlippageSettings autoSlippage={autoSlippage} />
            {showDeadlineSettings && (
              <>
                <Divider />
                <TransactionDeadlineSettings />
              </>
            )}
          </ExpandColumn>
        </AnimatedDropdown>
      </>
    ),
    [autoSlippage, showDeadlineSettings, trade]
  );

  return (
    <>
      <Menu ref={node}>
        <MenuButton
          disabled={!isChainSupported || chainId !== connectedChainId}
          isActive={isOpen}
          onClick={toggleMenu}
        />
        {isOpenDesktop && !isMobile && <MenuFlyout>{Settings}</MenuFlyout>}
      </Menu>
      {isMobile && (
        <Portal>
          <MobileMenuContainer data-testid="mobile-settings-menu">
            <Scrim
              testId="mobile-settings-scrim"
              onClick={toggleMenu}
              open={isOpenMobile}
            />
            <MobileMenuWrapper open={isOpenMobile}>
              <MobileMenuHeader padding="8px 0px 4px">
                <CloseIcon size={24} onClick={toggleMenu} />
                <Grid padding="0px 24px 0px 0px" justifyContent="center">
                  <Typography>
                    <>Settings</>
                  </Typography>
                </Grid>
              </MobileMenuHeader>
              {Settings}
            </MobileMenuWrapper>
          </MobileMenuContainer>
        </Portal>
      )}
    </>
  );
}
