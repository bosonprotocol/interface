import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import logo from "../../../src/assets/logo.svg";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import Layout from "../Layout";
import ConnectButton from "./ConnectButton";
import HeaderLinks, { HEADER_HEIGHT } from "./HeaderLinks";

const Header = styled.header<{ $navigationBarBgColor: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  + * {
    padding-top: ${HEADER_HEIGHT};
  }

  width: 100%;
  background-color: ${({ $navigationBarBgColor }) =>
    $navigationBarBgColor || colors.white};
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

const HeaderContainer = styled(Layout)<{ fluidHeader?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${breakpoint.xs} {
    max-width: ${({ fluidHeader }) => (fluidHeader ? "none" : "93.75rem;")};
  }
`;

const HeaderItems = styled.nav<{ isMobile: boolean; fluidHeader?: boolean }>`
  display: flex;
  align-items: ${({ isMobile }) => (isMobile ? "center" : "stretch")};
  justify-content: end;
  width: 100%;
  margin-left: ${({ fluidHeader }) => (fluidHeader ? "2.3rem" : "0")};
`;

const LogoImg = styled.img`
  height: 24px;
  cursor: pointer;
`;
interface Props {
  fluidHeader: boolean;
}
export default function HeaderComponent({ fluidHeader = false }: Props) {
  const { pathname, search } = useLocation();
  const { isLteM } = useBreakpoints();
  const [isOpen, setOpen] = useState(false);
  const logoUrl = useCustomStoreQueryParameter("logoUrl");
  const navigationBarBgColor = useCustomStoreQueryParameter(
    "navigationBarBgColor"
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname, search]);

  const toggleMenu = () => {
    setOpen(!isOpen);
  };
  const burgerMenuBreakpoint = isLteM;
  return (
    <Header $navigationBarBgColor={navigationBarBgColor}>
      <HeaderContainer fluidHeader={fluidHeader}>
        <LinkWithQuery to={BosonRoutes.Root}>
          <LogoImg src={logoUrl || logo} alt="logo image" data-testid="logo" />
        </LinkWithQuery>
        <HeaderItems isMobile={burgerMenuBreakpoint} fluidHeader={fluidHeader}>
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
