import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import logo from "../../../src/assets/logo.svg";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Layout from "../Layout";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import ConnectButton from "./ConnectButton";
import HeaderLinks, { HEADER_HEIGHT } from "./HeaderLinks";

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

const LogoImg = styled.img`
  height: 24px;
  cursor: pointer;
`;

export default function HeaderComponent() {
  const { pathname, search } = useLocation();
  const { isLteM } = useBreakpoints();
  const [isOpen, setOpen] = useState(false);
  const logoUrl = useCustomStoreQueryParameter("logoUrl");

  useEffect(() => {
    setOpen(false);
  }, [pathname, search]);

  const toggleMenu = () => {
    setOpen(!isOpen);
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
          <HeaderLinks isMobile={burgerMenuBreakpoint} isOpen={isOpen} />
          {!burgerMenuBreakpoint && <ConnectButton />}
        </HeaderItems>
      </HeaderContainer>
    </Header>
  );
}
