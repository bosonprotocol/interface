import styled from "styled-components";

import logo from "../../../src/assets/logo.svg";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Layout from "../Layout";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import Button from "../ui/Button";
import ConnectButton from "./ConnectButton";

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  + * {
    padding-top: 7rem;
  }

  width: 100%;
  padding: 10px 0;
  background-color: ${colors.white};
  border-bottom: 2px solid ${colors.border};
  color: ${colors.darkGrey};
  z-index: 1000;
`;

const BurgerButton = styled(Button)``;

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
  const { isPhone } = useBreakpoints();
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
        {isPhone ? (
          <BurgerButton theme="blank">
            <div />
            <div />
            <div />
          </BurgerButton>
        ) : (
          <NavigationLinks>
            <LinkWithQuery to={BosonRoutes.Explore}>Explore</LinkWithQuery>
            <LinkWithQuery to={BosonRoutes.CreateOffer}>Create</LinkWithQuery>
            <ConnectButton />
          </NavigationLinks>
        )}
      </HeaderContainer>
    </Header>
  );
}
