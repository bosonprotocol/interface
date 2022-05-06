import { Layout } from "@components/Layout";
import { colors } from "@lib/styles/colors";
import { Outlet } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import Header from "../Header";

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

const PageContainer = styled(Layout)`
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
  return (
    <Container>
      <GlobalStyle />
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
