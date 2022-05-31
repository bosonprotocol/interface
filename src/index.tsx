import { CONFIG } from "@lib/config";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  createRoutesFromChildren,
  HashRouter,
  matchRoutes,
  Route,
  Routes,
  useLocation,
  useNavigationType
} from "react-router-dom";

import App from "./components/app";
import Layout from "./components/Layout";
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

const Loading = () => (
  <Layout>
    <p>Loading...</p>
  </Layout>
);
const routingInstrumentationFn = Sentry.reactRouterV6Instrumentation(
  React.useEffect,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
);
routingInstrumentationFn(() => undefined, true, true);
Sentry.init({
  debug: true,
  dsn: "",
  enabled: true,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: routingInstrumentationFn
    })
  ],
  environment: CONFIG.envName,
  tracesSampleRate: 1.0
});
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <SentryRoutes>
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
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>Page not found</p>
                </main>
              }
            />
          </Route>
        </SentryRoutes>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
