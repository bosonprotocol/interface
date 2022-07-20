import { Outlet } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import Layout from "../../components/Layout";
import ModalProvider from "../../components/modal/ModalProvider";
import GlobalStyle from "../../lib/styles/GlobalStyle";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import theme from "../../theme";
import Footer from "../footer/Footer";
import Header from "../header/Header";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
`;

const PageContainer = styled(Layout)``;

export default function App() {
  const primaryColor = useCustomStoreQueryParameter("primaryColor");
  const secondaryColor = useCustomStoreQueryParameter("secondaryColor");
  const accentColor = useCustomStoreQueryParameter("accentColor");
  const primaryBgColor = useCustomStoreQueryParameter("primaryBgColor");

  return (
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <Container>
          <GlobalStyle
            $primaryColor={primaryColor}
            $secondaryColor={secondaryColor}
            $accentColor={accentColor}
            $primaryBgColor={primaryBgColor}
          />
          <Header />
          <PageContainer>
            <Outlet />
          </PageContainer>
          <Footer />
        </Container>
      </ModalProvider>
    </ThemeProvider>
  );
}
