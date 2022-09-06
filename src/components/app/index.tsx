import { IconContext } from "phosphor-react";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import Layout from "../../components/Layout";
import ModalProvider from "../../components/modal/ModalProvider";
import GlobalStyle from "../../lib/styles/GlobalStyle";
import ChatProvider from "../../pages/chat/ChatProvider/ChatProvider";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import theme from "../../theme";
import Footer from "../footer/Footer";
import Header from "../header/Header";

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

interface Props {
  withLayout?: boolean;
  withFooter?: boolean;
  fluidHeader?: boolean;
}
export default function App({
  withLayout = true,
  withFooter = true,
  fluidHeader = false
}: Props) {
  const primaryBgColor = useCustomStoreQueryParameter("primaryBgColor");
  const secondaryBgColor = useCustomStoreQueryParameter("secondaryBgColor");
  const accentColor1 = useCustomStoreQueryParameter("accentColor1");
  const accentColor2 = useCustomStoreQueryParameter("accentColor2");
  const textColor = useCustomStoreQueryParameter("textColor");

  const Wrapper = withLayout ? Layout : Fragment;

  return (
    <ThemeProvider theme={theme}>
      <IconContext.Provider
        value={{
          size: 32,
          weight: "bold"
        }}
      >
        <ChatProvider>
          <ModalProvider>
            <Container>
              <GlobalStyle
                $primaryBgColor={primaryBgColor}
                $secondaryBgColor={secondaryBgColor}
                $accentColor1={accentColor1}
                $accentColor2={accentColor2}
                $textColor={textColor}
              />
              <Header fluidHeader={fluidHeader} />
              <Wrapper>
                <Outlet />
              </Wrapper>
              {withFooter && <Footer />}
            </Container>
          </ModalProvider>
        </ChatProvider>
      </IconContext.Provider>
    </ThemeProvider>
  );
}
