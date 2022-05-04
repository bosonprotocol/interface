import App from "components/app";
import { Layout } from "components/Layout";
import { BosonRoutes } from "lib/routing/routes";
import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Route, Routes } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");

const CreateOffer = React.lazy(
  () => import("./pages/create-offer/CreateOffer")
);
const Explore = React.lazy(() => import("./pages/explore/Explore"));
const ManageOffer = React.lazy(() => import("./pages/manage-offer"));
const Landing = React.lazy(() => import("./pages/landing/Landing"));
const Loading = () => (
  <Layout>
    <p>Loading...</p>
  </Layout>
);

const queryClient = new QueryClient();
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route
              path={BosonRoutes.Root}
              element={
                <React.Suspense fallback={<Loading />}>
                  <Landing />
                </React.Suspense>
              }
            />
            <Route
              path={BosonRoutes.Explore}
              element={
                <React.Suspense fallback={<Loading />}>
                  <Explore />
                </React.Suspense>
              }
            />
            <Route
              path={BosonRoutes.CreateOffer}
              element={
                <React.Suspense fallback={<Loading />}>
                  <CreateOffer />
                </React.Suspense>
              }
            />
            <Route
              path={BosonRoutes.ManageOffers}
              element={
                <React.Suspense fallback={<Loading />}>
                  <ManageOffer />
                </React.Suspense>
              }
            />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>Page not found</p>
                </main>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
