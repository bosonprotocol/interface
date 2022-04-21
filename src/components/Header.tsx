import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { colors } from "../lib/colors";
import logo from "../lib/logo.png";
import { BosonRoutes } from "../lib/routes";
import { Layout } from "./Layout";

const HeaderContainer = styled(Layout)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0px auto 20px auto;
`;

const NavigationLinks = styled.nav`
  display: flex;
  gap: 16px;

  a {
    all: unset;
    cursor: pointer;
  }
  a:hover {
    color: ${colors.green};
  }
`;

const LogoImg = styled.img`
  width: 227px;
  height: 50px;
  padding-top: 24px;
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
        <Link to={BosonRoutes.CreateOffer}>Create Offer</Link>
        <Link to={BosonRoutes.ManageOffers}>Manage Offers</Link>
      </NavigationLinks>
    </HeaderContainer>
  );
}
