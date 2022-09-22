import { IconContext } from "phosphor-react";
import { Fragment } from "react";
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
  children: JSX.Element;
  withLayout?: boolean;
  withFooter?: boolean;
  fluidHeader?: boolean;
  appProps?: any;
}
export default function App({
  appProps = {},
  withLayout = true,
  withFooter = true,
  fluidHeader = false,
  children
}: Props) {
  // console.log("appProps", appProps);
  const headerBgColor = useCustomStoreQueryParameter("headerBgColor");
  const headerTextColor = useCustomStoreQueryParameter("headerTextColor");
  const primaryBgColor = useCustomStoreQueryParameter("primaryBgColor");
  const secondaryBgColor = useCustomStoreQueryParameter("secondaryBgColor");
  const accentColor = useCustomStoreQueryParameter("accentColor");
  const textColor = useCustomStoreQueryParameter("textColor");
  const footerBgColor = useCustomStoreQueryParameter("footerBgColor");
  const footerTextColor = useCustomStoreQueryParameter("footerTextColor");
  const showFooterValue = useCustomStoreQueryParameter("showFooter");
  const fontFamily = useCustomStoreQueryParameter("fontFamily");
  const showFooter = ["", "true"].includes(showFooterValue) && withFooter;
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
                $headerBgColor={headerBgColor}
                $headerTextColor={headerTextColor}
                $primaryBgColor={primaryBgColor}
                $secondaryBgColor={secondaryBgColor}
                $accentColor={accentColor}
                $textColor={textColor}
                $footerBgColor={footerBgColor}
                $footerTextColor={footerTextColor}
                $fontFamily={fontFamily}
              />
              <Header fluidHeader={fluidHeader} {...appProps} />
              <Wrapper>{children}</Wrapper>
              {showFooter && <Footer {...appProps} />}
            </Container>
          </ModalProvider>
        </ChatProvider>
      </IconContext.Provider>
    </ThemeProvider>
  );
}
