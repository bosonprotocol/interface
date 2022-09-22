import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";

import ConvertionRateProvider from "./components/convertion-rate/ConvertionRateProvider";
import WalletConnectionProvider from "./components/WalletConnectionProvider";
import reportWebVitals from "./reportWebVitals";
import AppRouter from "./router/AppRouter";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");
const queryClient = new QueryClient();

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
    <WalletConnectionProvider>
      <QueryClientProvider client={queryClient}>
        <ConvertionRateProvider>
          <AppRouter />
        </ConvertionRateProvider>
      </QueryClientProvider>
    </WalletConnectionProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
