import App from "lib/components/app";
import Landing from "lib/pages/Landing";
import { BosonRoutes } from "lib/routes";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");

const Search = React.lazy(() => import("lib/pages/Search"));
const FallBack = <>There has been a problem while loading this page</>;

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path={BosonRoutes.Root} element={<Landing />} />
          <Route
            path={BosonRoutes.Search}
            element={
              <React.Suspense fallback={FallBack}>
                <Search />
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
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
