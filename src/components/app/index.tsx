import { IconContext } from "phosphor-react";
import { Fragment, ReactNode, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components";

import ModalProvider from "../../components/modal/ModalProvider";
import GlobalStyle from "../../lib/styles/GlobalStyle";
import ChatProvider from "../../pages/chat/ChatProvider/ChatProvider";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import theme from "../../theme";
import CookieBanner from "../cookie/CookieBanner";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Layout, { LayoutProps } from "../layout/Layout";

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
  withHeader?: boolean;
  withLayout?: boolean;
  withFullLayout?: boolean;
  withFooter?: boolean;
  fluidHeader?: boolean;
  withBosonStyles?: boolean;
}

const getLayoutWrapper =
  (fullWidth: LayoutProps["fullWidth"]) =>
  ({ children }: { children: ReactNode }) =>
    (
      <Layout
        style={{ display: "flex", flex: "1", flexDirection: "column" }}
        fullWidth={fullWidth}
      >
        {children}
      </Layout>
    );

export default function App({
  withHeader = true,
  withFullLayout = false,
  withLayout = true,
  withFooter = true,
  fluidHeader = false,
  withBosonStyles = true,
  children
}: Props) {
  const headerBgColor = useCustomStoreQueryParameter("headerBgColor");
  const headerTextColor = useCustomStoreQueryParameter("headerTextColor");
  const primaryBgColor = useCustomStoreQueryParameter("primaryBgColor");
  const secondaryBgColor = useCustomStoreQueryParameter("secondaryBgColor");
  const accentColor = useCustomStoreQueryParameter("accentColor");
  const textColor = useCustomStoreQueryParameter("textColor");
  const showFooterValue = useCustomStoreQueryParameter("showFooter");
  const showFooter = ["", "true"].includes(showFooterValue);
  const footerBgColor = useCustomStoreQueryParameter("footerBgColor");
  const footerTextColor = useCustomStoreQueryParameter("footerTextColor");
  const fontFamily = useCustomStoreQueryParameter("fontFamily");
  const buttonBgColor = useCustomStoreQueryParameter("buttonBgColor");
  const buttonTextColor = useCustomStoreQueryParameter("buttonTextColor");
  const upperCardBgColor = useCustomStoreQueryParameter("upperCardBgColor");
  const lowerCardBgColor = useCustomStoreQueryParameter("lowerCardBgColor");
  const LayoutWrapper = useMemo(() => {
    return getLayoutWrapper(withFullLayout);
  }, [withFullLayout]);
  const Wrapper = withLayout ? LayoutWrapper : Fragment;
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
            <>
              <Container>
                <GlobalStyle
                  $withBosonStyles={withBosonStyles}
                  $headerBgColor={headerBgColor}
                  $headerTextColor={headerTextColor}
                  $primaryBgColor={primaryBgColor}
                  $secondaryBgColor={secondaryBgColor}
                  $accentColor={accentColor}
                  $textColor={textColor}
                  $footerBgColor={showFooter ? footerBgColor : ""}
                  $footerTextColor={showFooter ? footerTextColor : ""}
                  $fontFamily={fontFamily}
                  $buttonBgColor={buttonBgColor}
                  $buttonTextColor={buttonTextColor}
                  $upperCardBgColor={upperCardBgColor}
                  $lowerCardBgColor={lowerCardBgColor}
                />
                {withHeader && <Header fluidHeader={fluidHeader} />}
                <Wrapper>{children}</Wrapper>
                <Footer withFooter={withFooter} />
              </Container>
              <CookieBanner />
            </>
          </ModalProvider>
        </ChatProvider>
      </IconContext.Provider>
    </ThemeProvider>
  );
}
