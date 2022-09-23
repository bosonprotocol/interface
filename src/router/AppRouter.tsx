import { HashRouter, Route } from "react-router-dom";

import SentryProvider from "../components/SentryProvider";
import ScrollToTop from "../components/utils/Scroll";
import routes, { IRoutes } from "./routes";
import SuspenseRoute from "./SuspenseRoute";

export default function AppRouter() {
  return (
    <HashRouter>
      <ScrollToTop />
      <SentryProvider>
        <>
          {routes.map((route: IRoutes) => (
            <Route
              key={`route_${route.path}`}
              {...route}
              element={<SuspenseRoute {...route} />}
            />
          ))}
        </>
      </SentryProvider>
    </HashRouter>
  );
}
