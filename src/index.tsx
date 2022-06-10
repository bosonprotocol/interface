import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Route } from "react-router-dom";

import App from "./components/app";
import Layout from "./components/Layout";
import SentryProvider from "./components/SentryProvider";
import WalletConnectionProvider from "./components/WalletConnectionProvider";
import { BosonRoutes, OffersRoutes } from "./lib/routing/routes";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");
const queryClient = new QueryClient();

const root = createRoot(rootElement);

const CreateOffer = React.lazy(
  () => import("./pages/create-offer/CreateOffer")
);
const Explore = React.lazy(() => import("./pages/explore/Explore"));
const Landing = React.lazy(() => import("./pages/landing/Landing"));
const OfferDetail = React.lazy(() => import("./pages/offers/OfferDetail"));
const Exchange = React.lazy(() => import("./pages/exchange/Exchange"));
const PrivateAccount = React.lazy(
  () => import("./pages/account/private/PrivateAccountContainer")
);
const PublicOrPrivateAccount = React.lazy(
  () => import("./pages/account/public/PublicOrPrivateAccount")
);
const CustomStore = React.lazy(
  () => import("./pages/custom-store/CustomStore")
);

const Loading = () => (
  <Layout>
    <p>Loading...</p>
  </Layout>
);

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
  <StrictMode enable={false}>
    <WalletConnectionProvider>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <SentryProvider>
            <Route path="/" element={<App />}>
              <Route
                path={BosonRoutes.Root}
                element={
                  <React.Suspense fallback={<Loading />}>
                    <Landing />
                  </React.Suspense>
                }
              />
              {[
                BosonRoutes.Explore,
                BosonRoutes.ExplorePage,
                BosonRoutes.ExplorePageByIndex
              ].map((route) => (
                <Route
                  key={route}
                  path={route}
                  element={
                    <React.Suspense fallback={<Loading />}>
                      <Explore />
                    </React.Suspense>
                  }
                />
              ))}

              <Route
                path={BosonRoutes.CreateOffer}
                element={
                  <React.Suspense fallback={<Loading />}>
                    <CreateOffer />
                  </React.Suspense>
                }
              />
              <Route
                path={OffersRoutes.Root}
                element={
                  <React.Suspense fallback={<Loading />}>
                    <Explore />
                  </React.Suspense>
                }
              />
              <Route
                path={OffersRoutes.OfferDetail}
                element={
                  <React.Suspense fallback={<Loading />}>
                    <OfferDetail />
                  </React.Suspense>
                }
              />
              <Route
                path={BosonRoutes.Exchange}
                element={
                  <React.Suspense fallback={<Loading />}>
                    <Exchange />
                  </React.Suspense>
                }
              />
              <Route
                path={BosonRoutes.YourAccount}
                element={
                  <React.Suspense fallback={<Loading />}>
                    <PrivateAccount />
                  </React.Suspense>
                }
              />
              <Route
                path={BosonRoutes.Account}
                element={
                  <React.Suspense fallback={<Loading />}>
                    <PublicOrPrivateAccount />
                  </React.Suspense>
                }
              />
              <Route
                path={BosonRoutes.CreateStorefront}
                element={
                  <React.Suspense fallback={<Loading />}>
                    <CustomStore />
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
          </SentryProvider>
        </HashRouter>
      </QueryClientProvider>
    </WalletConnectionProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
