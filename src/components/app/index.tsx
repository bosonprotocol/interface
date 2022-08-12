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
}
export default function App({ withLayout = true, withFooter = true }: Props) {
  const primaryColor = useCustomStoreQueryParameter("primaryColor");
  const secondaryColor = useCustomStoreQueryParameter("secondaryColor");
  const accentColor = useCustomStoreQueryParameter("accentColor");
  const primaryBgColor = useCustomStoreQueryParameter("primaryBgColor");

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
                $primaryColor={primaryColor}
                $secondaryColor={secondaryColor}
                $accentColor={accentColor}
                $primaryBgColor={primaryBgColor}
              />
              <Header />
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
