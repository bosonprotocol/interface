import { Portal } from "components/portal/Portal";
import { forwardRef, useState } from "react";
import styled, { css } from "styled-components";

import logo from "../../../src/assets/logo.svg";
import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import Layout from "../layout/Layout";
import Grid from "../ui/Grid";
import { AccountDrawer } from "./accountDrawer";
import { BurgerButton } from "./BurgerButton";
import { Selector } from "./chainSelector/Selector";
import ConnectButton from "./ConnectButton";
import HeaderLinks, { HEADER_HEIGHT } from "./HeaderLinks";

const Header = styled.header`
  position: fixed;
  transition: width 300ms;

  ${() => {
    return css`
      width: 100%;
      top: 0;
      left: 0;
      right: 0;
      + * {
        padding-top: ${HEADER_HEIGHT};
      }
      border-bottom: 2px solid ${colors.border};
      > div {
        > * {
          height: ${HEADER_HEIGHT};
          display: flex;
          align-items: center;
        }
      }
    `;
  }}

  background-color: var(--headerBgColor);
  color: var(--headerTextColor);
  z-index: ${zIndex.Header};
`;

const HeaderContainer = styled(Layout)<{
  fluidHeader?: boolean;
}>`
  ${({ fluidHeader }) => {
    return css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: ${HEADER_HEIGHT};
      ${breakpoint.xs} {
        max-width: ${fluidHeader ? "none" : "93.75rem;"};
      }
    `;
  }}
`;

const HeaderItems = styled.nav<{
  fluidHeader?: boolean;
}>`
  gap: 1rem;
  ${({ fluidHeader }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: end;
      width: 100%;
      margin-left: ${fluidHeader ? "2.3rem" : "0"};
    `;
  }}
`;
const logoXXSHeightPx = 24;
const logoSHeightPx = 47;
const LogoImg = styled.img`
  height: ${logoXXSHeightPx}px;
  cursor: pointer;
  ${breakpoint.s} {
    height: ${logoSHeightPx}px;
  }
`;

type DrCenterHeaderProps = {
  fluidHeader: boolean | undefined;
};

export const DrCenterHeader = forwardRef<HTMLElement, DrCenterHeaderProps>(
  ({ fluidHeader = false }, ref) => {
    const [isOpen, setOpen] = useState(false);
    const { isLteM, isLteXS } = useBreakpoints();

    const toggleMenu = () => {
      setOpen(!isOpen);
    };
    const burgerMenuBreakpoint = isLteM;

    return (
      <>
        <Header ref={ref}>
          <HeaderContainer fluidHeader={fluidHeader}>
            <>
              <Grid flexDirection="row" alignItems="center" $width="initial">
                <LinkWithQuery
                  to={DrCenterRoutes.Root}
                  style={{ display: "flex" }}
                >
                  <LogoImg
                    src={logo}
                    alt="Boson logo"
                    data-testid="logo"
                    width={isLteXS ? 104 : 204}
                    height={isLteXS ? logoXXSHeightPx : logoSHeightPx}
                  />
                </LinkWithQuery>
              </Grid>
              <HeaderItems fluidHeader={fluidHeader}>
                {burgerMenuBreakpoint && (
                  <>
                    <Selector />
                    <ConnectButton />
                    <BurgerButton onClick={toggleMenu} />
                  </>
                )}
                <HeaderLinks
                  isMobile={burgerMenuBreakpoint}
                  isOpen={isOpen}
                  withSearch={false}
                  withExploreProducts={false}
                  withMyItems
                  withDisputeAdmin={false}
                  withResolutionCenter
                  withSellerHub
                />
                {!burgerMenuBreakpoint && (
                  <>
                    <Selector />
                    <ConnectButton />
                  </>
                )}
              </HeaderItems>
            </>
          </HeaderContainer>
          <Portal>
            <AccountDrawer />
          </Portal>
        </Header>
      </>
    );
  }
);
