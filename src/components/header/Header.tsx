import { X } from "phosphor-react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAccount } from "wagmi";

import logo from "../../../src/assets/logo.svg";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Banner from "../banner/Banner";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import Layout from "../Layout";
import ViewTxButton from "../transactions/ViewTxButton";
import Grid from "../ui/Grid";
import ConnectButton from "./ConnectButton";
import HeaderLinks, { HEADER_HEIGHT } from "./HeaderLinks";

const smallWidth = "180px";
const mediumWidth = "225px";
const sideMargin = "1rem";
const closedHeaderWidth = "75px";
const Header = styled.header<{
  $navigationBarPosition: string;
  $isSideBarOpen: boolean;
}>`
  position: fixed;
  transition: width 300ms;

  ${({ $navigationBarPosition, $isSideBarOpen }) => {
    if (["left", "right"].includes($navigationBarPosition)) {
      return css`
        ${$isSideBarOpen
          ? css`
              width: ${smallWidth};
            `
          : css`
              width: ${closedHeaderWidth};
            `}
        top: 0;
        ${$navigationBarPosition === "left"
          ? css`
              left: 0;
              border-right: 2px solid ${colors.border};

              && {
                ~ * {
                  ${$isSideBarOpen
                    ? css`
                        padding-left: calc(${smallWidth} + ${sideMargin});
                      `
                    : css`
                        padding-left: calc(
                          ${closedHeaderWidth} + ${sideMargin}
                        );
                      `}

                  ${breakpoint.m} {
                    ${$isSideBarOpen
                      ? css`
                          padding-left: calc(${mediumWidth} + ${sideMargin});
                        `
                      : css`
                          padding-left: calc(
                            ${closedHeaderWidth} + ${sideMargin}
                          );
                        `}
                  }
                }
              }
            `
          : css`
              right: 0;
              border-left: 2px solid ${colors.border};
              && {
                ~ * {
                  ${$isSideBarOpen
                    ? css`
                        padding-right: calc(${smallWidth} + ${sideMargin});
                      `
                    : css`
                        padding-right: calc(
                          ${closedHeaderWidth} + ${sideMargin}
                        );
                      `}
                  ${breakpoint.m} {
                    ${$isSideBarOpen
                      ? css`
                          padding-right: calc(${mediumWidth} + ${sideMargin});
                        `
                      : css`
                          padding-right: calc(
                            ${closedHeaderWidth} + ${sideMargin}
                          );
                        `}
                  }
                }
              }
            `}
        height: 100%;

        ${breakpoint.m} {
          width: ${mediumWidth};
        }
      `;
    }
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

const BurgerButton = styled.button`
  all: unset;
  cursor: pointer;

  position: relative;

  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0.5rem;
  padding: 0.5rem;
  > div {
    width: 1.25rem;
    height: 2px;
    border-radius: 5px;
    background: var(--accent);
  }
`;

const HeaderContainer = styled(Layout)<{
  fluidHeader?: boolean;
  $navigationBarPosition: string;
}>`
  ${({ $navigationBarPosition, fluidHeader }) => {
    if (["left", "right"].includes($navigationBarPosition)) {
      return css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        padding: 1rem;
        gap: 2rem;

        ${breakpoint.m} {
          align-items: center;
        }
      `;
    }
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
  isMobile: boolean;
  fluidHeader?: boolean;
  $navigationBarPosition: string;
}>`
  ${({ $navigationBarPosition, isMobile, fluidHeader }) => {
    if (["left", "right"].includes($navigationBarPosition)) {
      return css`
        display: flex;
        flex-direction: column;
        align-items: ${isMobile ? "center" : "stretch"};
        justify-content: end;
        width: 100%;
      `;
    }
    return css`
      display: flex;
      align-items: ${isMobile ? "center" : "stretch"};
      justify-content: end;
      width: 100%;
      margin-left: ${fluidHeader ? "2.3rem" : "0"};
    `;
  }}
`;

const LogoImg = styled.img`
  height: 24px;
  cursor: pointer;
`;

const Burger = ({ onClick }: { onClick: () => void }) => {
  return (
    <BurgerButton theme="blank" onClick={onClick}>
      <div />
      <div />
      <div />
    </BurgerButton>
  );
};

interface Props {
  fluidHeader: boolean;
  withBanner: boolean;
}
const HeaderComponent = forwardRef<HTMLElement, Props>(
  ({ fluidHeader = false, withBanner = false }, ref) => {
    const { address } = useAccount();
    const [isOpen, setOpen] = useState(false);
    const { pathname, search } = useLocation();
    const { isLteS, isLteM, isM } = useBreakpoints();
    const logoUrl = useCustomStoreQueryParameter("logoUrl");
    const navigationBarPosition = useCustomStoreQueryParameter(
      "navigationBarPosition"
    );
    const isSideNavBar = ["left", "right"].includes(navigationBarPosition);
    const burgerMenuBreakpoint = isLteM && !isSideNavBar;
    const isSideCrossVisible = isSideNavBar && isOpen && isLteS;
    const isSideBurgerVisible = isSideNavBar && !isOpen && isLteS;

    const toggleMenu = () => {
      setOpen(!isOpen);
    };

    useEffect(() => {
      if (!isSideNavBar) {
        setOpen(false);
      }
    }, [pathname, search, isSideNavBar, setOpen]);

    useEffect(() => {
      if ((!isLteM || isM) && !isOpen && isSideNavBar) {
        setOpen(true);
      }
    }, [isLteM, isM, isOpen, setOpen, isSideNavBar]);

    const Connect = useCallback(
      (props: Parameters<typeof ConnectButton>[0]) => {
        return (
          <>
            <ConnectButton {...props} showAddress={!address} />
            {address && (
              <Grid flexBasis="content" margin="0 0 0 1rem">
                <ViewTxButton />
              </Grid>
            )}
          </>
        );
      },
      [address]
    );

    return (
      <Header
        $navigationBarPosition={navigationBarPosition}
        $isSideBarOpen={isOpen}
        ref={ref}
      >
        {withBanner && <Banner />}
        <HeaderContainer
          fluidHeader={fluidHeader}
          $navigationBarPosition={navigationBarPosition}
        >
          {isSideBurgerVisible ? (
            <Grid justifyContent="center">
              <Burger onClick={toggleMenu} />
            </Grid>
          ) : (
            <>
              <Grid flexDirection="row" alignItems="center" $width="initial">
                <LinkWithQuery to={BosonRoutes.Root}>
                  <LogoImg
                    src={logoUrl || logo}
                    alt="logo image"
                    data-testid="logo"
                  />
                </LinkWithQuery>
                {isSideCrossVisible && (
                  <X
                    color={colors.secondary}
                    onClick={toggleMenu}
                    style={{ cursor: "pointer" }}
                    size="24"
                  />
                )}
              </Grid>
              <HeaderItems
                isMobile={burgerMenuBreakpoint}
                fluidHeader={fluidHeader}
                $navigationBarPosition={navigationBarPosition}
              >
                {burgerMenuBreakpoint && (
                  <>
                    <Connect />
                    <Burger onClick={toggleMenu} />
                  </>
                )}
                <HeaderLinks
                  isMobile={burgerMenuBreakpoint}
                  isOpen={isOpen}
                  navigationBarPosition={navigationBarPosition}
                />
                {!burgerMenuBreakpoint && (
                  <Connect navigationBarPosition={navigationBarPosition} />
                )}
              </HeaderItems>
            </>
          )}
        </HeaderContainer>
      </Header>
    );
  }
);

export default HeaderComponent;
