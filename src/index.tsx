import App from "components/app";
import { BosonRoutes, OffersRoutes } from "lib/routing/routes";
import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Route, Routes } from "react-router-dom";

// import CreateOffer from "./pages/create-offer/CreateOffer";
// import Explore from "./pages/explore/Explore";
// import Landing from "./pages/landing/Landing";
// import ManageOffer from "./pages/manage-offer";
// import OfferDetail from "./pages/offers/OfferDetail";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");

const queryClient = new QueryClient();
const CreateOffer = React.lazy(
  () => import("./pages/create-offer/CreateOffer")
);
const Explore = React.lazy(() => import("./pages/explore/Explore"));
const ManageOffer = React.lazy(() => import("./pages/manage-offer"));
const OfferDetail = React.lazy(() => import("./pages/offers/OfferDetail"));
const Landing = React.lazy(() => import("./pages/landing/Landing"));
const Loading = () => <p>Loading...</p>;
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
