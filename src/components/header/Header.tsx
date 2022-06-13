import styled from "styled-components";

import logo from "../../../src/assets/logo.png";
import { BosonRoutes } from "../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Layout from "../Layout";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import ConnectButton from "./ConnectButton";

const HeaderContainer = styled(Layout)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px auto 20px auto;
  padding-top: 24px;
`;

const NavigationLinks = styled.nav`
  display: flex;
  gap: 16px;
  width: 100%;
  align-items: center;
  justify-content: flex-end;

  a {
    all: unset;
    cursor: pointer;
  }
  a:hover {
    color: var(--secondary);
  }
`;

const LogoImg = styled.img`
  height: 50px;
  cursor: pointer;
`;

export default function Header() {
  const navigate = useKeepQueryParamsNavigate();
  const logoUrl = useCustomStoreQueryParameter("logoUrl");

  return (
    <HeaderContainer>
      <LogoImg
        data-testid="logo"
        src={logoUrl || logo}
        onClick={() => navigate({ pathname: BosonRoutes.Root })}
      />
      <NavigationLinks>
        <LinkWithQuery to={BosonRoutes.Root}>Home</LinkWithQuery>
        <LinkWithQuery to={BosonRoutes.Explore}>Explore</LinkWithQuery>
        <LinkWithQuery to={BosonRoutes.CreateOffer}>Create</LinkWithQuery>
        <ConnectButton />
      </NavigationLinks>
    </HeaderContainer>
  );
}
