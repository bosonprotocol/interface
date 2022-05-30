import SentryReactRouterV6RouterInstrumentation from "@components/SentryReactRouterV6RouterInstrumentation";
import { routes } from "@lib/routing/routes";
import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, useRoutes } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");
const queryClient = new QueryClient();

const root = createRoot(rootElement);
const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <>
          <AppRoutes />
          <SentryReactRouterV6RouterInstrumentation />
        </>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
