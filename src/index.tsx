import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import ConvertionRateProvider from "./components/convertion-rate/ConvertionRateProvider";
import WalletConnectionProvider from "./components/WalletConnectionProvider";
import reportWebVitals from "./reportWebVitals";
import AppRouter from "./router/AppRouter";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

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
  // TODO: should be true
  <StrictMode enable={false}>
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            minWidth: "455px",
            padding: "24px",
            boxShadow: "0 3px 10px rgb(0 0 0 / 40%), 0 3px 3px rgb(0 0 0 / 5%)",
            borderRadius: 0
          }
        }}
      />
      <WalletConnectionProvider>
        <QueryClientProvider client={queryClient}>
          <ConvertionRateProvider>
            <AppRouter />
          </ConvertionRateProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </WalletConnectionProvider>
    </>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
