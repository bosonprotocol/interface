import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import logo from "../../../src/assets/logo.svg";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Layout from "../Layout";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import ConnectButton from "./ConnectButton";
import Search from "./Search";

const HEADER_HEIGHT = "5.4rem";

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  + * {
    padding-top: calc(${HEADER_HEIGHT} + 2rem) !important;
  }

  width: 100%;
  background-color: ${colors.white};
  border-bottom: 2px solid ${colors.border};
  color: ${colors.darkGrey};
  z-index: ${zIndex.Header};
  > div {
    height: ${HEADER_HEIGHT};
    > * {
      height: ${HEADER_HEIGHT};
      display: flex;
      align-items: center;
    }
  }
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
    background: var(--secondary);
  }
`;

const HeaderContainer = styled(Layout)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderItems = styled.nav<{ isMobile: boolean }>`
  display: flex;
  align-items: ${({ isMobile }) => (isMobile ? "center" : "stretch")};
  justify-content: end;
  width: 100%;
`;

const NavigationLinks = styled.div<{ isMobile: boolean; isOpen: boolean }>`
  > * {
    flex: 1;
  }
  height: 100%;
  ${({ isMobile, isOpen }) =>
    isMobile
      ? `
    position: absolute;
    top: calc(${HEADER_HEIGHT} + 2px);
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    background: white;
    transform: ${isOpen ? "translateX(0%)" : "translateX(100%)"};

     a {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-family: "Plus Jakarta Sans";
      font-style: normal;
      font-size: 16px;
      font-weight: 600;
      line-height: 150%;
      padding: 2rem;
      color: ${colors.black};
      background-color: ${colors.lightGrey};
      border-bottom: 2px solid ${colors.border};
      position: relative;
      white-space: pre;
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background-color: ${colors.border};
        transition: all 150ms ease-in-out;
      }

      &:hover {
        color:var(--secondary);
        &:before {
          height: 100%;
        }
      }
    }
  `
      : `
      margin: 0 1rem;
      display: flex;
      width: 100%;
      align-items: stretch;
      justify-content: space-between;
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-family: "Plus Jakarta Sans";
        font-style: normal;
        font-size: 16px;
        font-weight: 600;
        line-height: 150%;
        padding: 1rem;
        height: 100%;
        color: ${colors.black};
      }
      a:hover {
        background-color: ${colors.border};
        color: var(--secondary);
      }
  `};
`;

const Links = styled.div<{ isMobile: boolean }>`
  display: flex;
  justify-content: end;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
`;

const LogoImg = styled.img`
  height: 24px;
  cursor: pointer;
`;

export default function HeaderComponent() {
  const { pathname, search } = useLocation();
  const { isLteM } = useBreakpoints();
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const logoUrl = useCustomStoreQueryParameter("logoUrl");

  useEffect(() => {
    setOpen(false);
  }, [pathname, search]);

  const toggleMenu = () => {
    setOpen(!open);
  };
  const burgerMenuBreakpoint = isLteM;
  return (
    <Header>
      <HeaderContainer>
        <LinkWithQuery to={BosonRoutes.Root}>
          <LogoImg
            src={logoUrl || logo}
            alt="Boson Protocol"
            data-testid="logo"
          />
        </LinkWithQuery>
        <HeaderItems isMobile={burgerMenuBreakpoint}>
          {burgerMenuBreakpoint && (
            <>
              <ConnectButton />
              <BurgerButton theme="blank" onClick={toggleMenu}>
                <div />
                <div />
                <div />
              </BurgerButton>
            </>
          )}
          <NavigationLinks isMobile={burgerMenuBreakpoint} isOpen={open}>
            <Search isMobile={burgerMenuBreakpoint} />
            <Links isMobile={burgerMenuBreakpoint}>
              <LinkWithQuery to={BosonRoutes.Sell}>Sell</LinkWithQuery>
              <LinkWithQuery to={BosonRoutes.Explore}>
                Explore Products
              </LinkWithQuery>
              {address && (
                <LinkWithQuery to={BosonRoutes.YourAccount}>
                  My Items
                </LinkWithQuery>
              )}
            </Links>
          </NavigationLinks>
          {!burgerMenuBreakpoint && <ConnectButton />}
        </HeaderItems>
      </HeaderContainer>
    </Header>
  );
}
