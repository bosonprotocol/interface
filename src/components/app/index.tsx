import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Layout from "../../components/Layout";
import GlobalStyle from "../../lib/styles/GlobalStyle";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import Footer from "../footer/Footer";
import Header from "../header/Header";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 0;
`;

const PageContainer = styled(Layout)``;

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
      <Footer />
    </Container>
  );
}
