import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "components/config/ConfigProvider";
import { CoreSDKProvider } from "components/core-sdk/CoreSDKProvider";
import { UserProvider } from "components/magicLink/UserContext";
import { apolloClient } from "graphql/data/apollo";
import { MulticallUpdater } from "lib/state/multicall";
import { BlockNumberProvider } from "lib/utils/hooks/useBlockNumber";
import { queryClient, rootElement } from "queryClient";
import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import store from "state";
import { ApplicationUpdater } from "state/application/updater";
import { ListsUpdater } from "state/lists/updater";

import ConvertionRateProvider from "./components/convertion-rate/ConvertionRateProvider";
import Web3Provider from "./components/header/web3Provider";
import reportWebVitals from "./reportWebVitals";
import AppRouter from "./router/AppRouter";

// const rootElement = document.getElementById("root");
// if (!rootElement) throw new Error("Unable to find the root element");
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false
//     }
//   }
// });

function Updaters() {
  return (
    <>
      {/* <RadialGradientByChainUpdater /> */}
      <ListsUpdater />
      {/* <SystemThemeUpdater /> */}
      <ApplicationUpdater />
      {/* <TransactionUpdater /> */}
      {/* <OrderUpdater /> */}
      <MulticallUpdater />
      {/* <LogsUpdater /> */}
    </>
  );
}

if (!rootElement) throw new Error("Unable to find the root element");
const root = createRoot(rootElement);

const StrictMode = ({
  enable,
  children
}: {
  enable: boolean;
  children: JSX.Element;
}) => {
  if (enable) {
    return <React.StrictMode>{children}</React.StrictMode>;
  }
  return <>{children}</>;
};

root.render(
  <StrictMode enable={true}>
    <Provider store={store}>
      <Web3Provider>
        <ConfigProvider>
          <UserProvider>
            <ApolloProvider client={apolloClient}>
              <BlockNumberProvider>
                <Updaters />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      minWidth: "455px",
                      padding: "24px",
                      boxShadow:
                        "0 3px 10px rgb(0 0 0 / 40%), 0 3px 3px rgb(0 0 0 / 5%)",
                      borderRadius: 0
                    }
                  }}
                />

                <QueryClientProvider client={queryClient}>
                  <CoreSDKProvider>
                    <ConvertionRateProvider>
                      <AppRouter />
                    </ConvertionRateProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                  </CoreSDKProvider>
                </QueryClientProvider>
              </BlockNumberProvider>
            </ApolloProvider>
          </UserProvider>
        </ConfigProvider>
      </Web3Provider>
    </Provider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
