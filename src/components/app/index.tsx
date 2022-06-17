import { Outlet } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import Layout from "../../components/Layout";
import { colors } from "../../lib/styles/colors";
import { footerHeight } from "../../lib/styles/layout";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Header from "../header/Header";

const GlobalStyle = createGlobalStyle<{
  $primaryColor: string;
  $secondaryColor: string;
  $accentColor: string;
}>`
  :root {
    --primary: ${(props) =>
      props.$primaryColor ? props.$primaryColor : colors.navy};
    --secondary: ${(props) =>
      props.$secondaryColor ? props.$secondaryColor : colors.green};
    --accent: ${(props) =>
      props.$accentColor ? props.$accentColor : colors.white};
    --accentDark: ${(props) =>
      props.$accentColor ? props.$accentColor : colors.arsenic};
  }

  html, body {
    font-family: 'Manrope', sans-serif;
    font-weight: 400;
    margin: 0;
    display:flex;
    flex-direction:column;
    background-color: var(--primary);
    z-index: -2;
    color: var(--accent);
  }
`;

const Container = styled.div`
  position: relative;
  min-height: 100vh;
`;

const PageContainer = styled(Layout)`
  padding-bottom: calc(${footerHeight} + 70px); // a bit more than footer height
`;

const Footer = styled.footer`
  background-color: var(--accentDark);
  height: ${footerHeight};
  padding: 20px 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
`;

export default function App() {
  const primaryColor = useCustomStoreQueryParameter("primaryColor");
  const secondaryColor = useCustomStoreQueryParameter("secondaryColor");
  const accentColor = useCustomStoreQueryParameter("accentColor");

  return (
    <Container>
      <GlobalStyle
        $primaryColor={primaryColor}
        $secondaryColor={secondaryColor}
        $accentColor={accentColor}
      />
      <Header />
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
