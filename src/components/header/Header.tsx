import styled from "styled-components";

import logo from "../../../src/assets/logo.svg";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Layout from "../Layout";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import ConnectButton from "./ConnectButton";
// import Logo from '../ui/Logo';

const Header = styled.header`
  position: fixed;
  + * {
    padding-top: 95px;
  }

  width: 100%;
  padding: 10px 0;
  background-color: ${colors.white};
  border-bottom: 2px solid ${colors.border};
  color: ${colors.darkGrey};
  z-index: 1000;
`;

const HeaderContainer = styled(Layout)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavigationLinks = styled.nav`
  display: flex;
  gap: 5rem;
  width: 100%;
  align-items: center;
  justify-content: flex-end;

  a {
    all: unset;
    cursor: pointer;
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-size: 16px;
    font-weight: 600;
    line-height: 150%;
  }
  a:hover {
    color: ${colors.secondary};
  }
`;

const LogoImg = styled.img`
  height: 24px;
  cursor: pointer;
`;

export default function HeaderComponent() {
  const navigate = useKeepQueryParamsNavigate();
  const logoUrl = useCustomStoreQueryParameter("logoUrl");

  return (
    <Header>
      <HeaderContainer>
        <LogoImg
          data-testid="logo"
          src={logoUrl || logo}
          onClick={() => navigate({ pathname: BosonRoutes.Root })}
        />
        <NavigationLinks>
          <LinkWithQuery to={BosonRoutes.Explore}>Explore</LinkWithQuery>
          <LinkWithQuery to={BosonRoutes.CreateOffer}>Create</LinkWithQuery>
          <ConnectButton />
        </NavigationLinks>
      </HeaderContainer>
    </Header>
  );
}
