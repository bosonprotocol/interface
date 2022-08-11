import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Route } from "react-router-dom";

import App from "./components/app";
import SentryProvider from "./components/SentryProvider";
import ScrollToTop from "./components/utils/Scroll";
import WalletConnectionProvider from "./components/WalletConnectionProvider";
import { BosonRoutes, OffersRoutes } from "./lib/routing/routes";
import PrivateAccount from "./pages/account/private/PrivateAccountContainer";
import PublicOrPrivateAccount from "./pages/account/public/PublicOrPrivateAccount";
import CreateProduct from "./pages/create-product/CreateProduct";
import CustomStore from "./pages/custom-store/CustomStore";
import Exchange from "./pages/exchange/Exchange";
import Explore from "./pages/explore/Explore";
import Landing from "./pages/landing/Landing";
import OfferDetail from "./pages/offers/OfferDetail";
import reportWebVitals from "./reportWebVitals";

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
        <HashRouter>
          <ScrollToTop />
          <SentryProvider>
            <Route path="/" element={<App />}>
              <Route path={BosonRoutes.Root} element={<Landing />} />
              {[
                OffersRoutes.Root,
                BosonRoutes.Explore,
                BosonRoutes.ExplorePage,
                BosonRoutes.ExplorePageByIndex
              ].map((route) => (
                <Route key={route} path={route} element={<Explore />} />
              ))}

              <Route path={BosonRoutes.Sell} element={<CreateProduct />} />
              <Route
                path={OffersRoutes.OfferDetail}
                element={<OfferDetail />}
              />
              <Route path={BosonRoutes.Exchange} element={<Exchange />} />
              <Route
                path={BosonRoutes.YourAccount}
                element={<PrivateAccount />}
              />
              <Route
                path={BosonRoutes.Account}
                element={<PublicOrPrivateAccount />}
              />
              <Route
                path={BosonRoutes.CreateStorefront}
                element={<CustomStore />}
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
