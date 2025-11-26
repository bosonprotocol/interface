import { BosonThemeProvider } from "@bosonprotocol/react-kit";
import { IconContext } from "phosphor-react";
import { DefaultTheme, ThemeProvider } from "styled-components";

import ModalProvider from "../../components/modal/ModalProvider";
import { getCurrentViewMode, ViewMode } from "../../lib/viewMode";
import ChatProvider from "../../pages/chat/ChatProvider/ChatProvider";
import theme, { themeVars } from "../../theme";
import CookieBanner from "../cookie/CookieBanner";
import { AppView } from "./AppView";
import { Container } from "./index.styles";
import { useWrapper } from "./useWrapper";

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
    <ThemeProvider theme={theme as unknown as DefaultTheme}>
      <IconContext.Provider
        value={{
          size: 32,
          weight: "bold"
        }}
      >
        <ChatProvider>
          <BosonThemeProvider
            roundness={themeVars.roundness}
            theme={themeVars.themeKey}
          >
            <ModalProvider>
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
            </ModalProvider>
          </BosonThemeProvider>
        </ChatProvider>
      </IconContext.Provider>
    </ThemeProvider>
  );
}
