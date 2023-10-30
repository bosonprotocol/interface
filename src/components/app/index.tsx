import { IconContext } from "phosphor-react";
import styled, { ThemeProvider } from "styled-components";

import ModalProvider from "../../components/modal/ModalProvider";
import { getCurrentViewMode, ViewMode } from "../../lib/viewMode";
import ChatProvider from "../../pages/chat/ChatProvider/ChatProvider";
import theme from "../../theme";
import CookieBanner from "../cookie/CookieBanner";
import { AppView } from "./AppView";
import { useWrapper } from "./useWrapper";

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

export default function App({
  withHeader = true,
  withFullLayout = false,
  withLayout = true,
  withFooter = true,
  fluidHeader = false,
  withBosonStyles = true,
  children
}: Props) {
  const Wrapper = useWrapper({ withFullLayout, withLayout });
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
                <AppView
                  wrapper={Wrapper}
                  withHeader={withHeader}
                  withFooter={withFooter}
                  fluidHeader={fluidHeader}
                  withBosonStyles={withBosonStyles}
                >
                  {children}
                </AppView>
              </Container>
              <CookieBanner isDapp={getCurrentViewMode() === ViewMode.DAPP} />
            </>
          </ModalProvider>
        </ChatProvider>
      </IconContext.Provider>
    </ThemeProvider>
  );
}
