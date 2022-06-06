import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import logo from "../../../src/assets/logo.png";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import Layout from "../Layout";
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
    color: ${colors.green};
  }
`;

const LogoImg = styled.img`
  height: 30px;

  cursor: pointer;
`;

export default function Header() {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <LogoImg
        data-testid="logo"
        src={logo}
        onClick={() => navigate(BosonRoutes.Root)}
      />
      <NavigationLinks>
        <Link to={BosonRoutes.Root}>Home</Link>
        <Link to={BosonRoutes.Explore}>Explore</Link>
        <Link to={BosonRoutes.CreateOffer}>Create</Link>
        <ConnectButton />
      </NavigationLinks>
    </HeaderContainer>
  );
}
