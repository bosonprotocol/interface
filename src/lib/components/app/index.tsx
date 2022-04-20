import { colors } from "lib/colours";
import logo from "lib/logo.png";
import { BosonRoutes } from "lib/routes";
import { Outlet, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    font-family: 'Manrope', sans-serif;
    font-weight: 400;
    margin: 0;
    display:flex;
    flex-direction:column;
    background-color: ${colors.navy};
    z-index: -2;
    color: white;
  }
`;

const Container = styled.div`
  position: relative;
  min-height: 100vh;
`;

const LogoImg = styled.img`
  width: 227px;
  height: 50px;
  padding-top: 24px;
  cursor: pointer;
`;

const PageContainer = styled.div`
  padding-bottom: 150px; // a bit more than footer height
`;

const Footer = styled.footer`
  background-color: ${colors.arsenic};
  height: 100px;
  padding: 20px 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
`;

export default function App() {
  const navigate = useNavigate();

  return (
    <Container>
      <GlobalStyle />
      <LogoImg
        data-testid="logo"
        src={logo}
        onClick={() => navigate(BosonRoutes.Root)}
      />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer>
        <img
          src="https://assets.website-files.com/6058b6a3587b6e155196ebbb/6058b6a3587b6e3e4e96ec24_logo.png"
          alt="Boson Protocol"
          height={80}
        />
      </Footer>
    </Container>
  );
}
