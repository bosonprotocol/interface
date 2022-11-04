import { HashRouter, Route } from "react-router-dom";

import CoreSDKProvider from "../components/CoreSDKProvider";
import SentryProvider from "../components/SentryProvider";
import ScrollToTop from "../components/utils/Scroll";
import routes, { IRoutes } from "./routes";
import SuspenseRoute from "./SuspenseRoute";

export default function AppRouter() {
  return (
    <HashRouter>
      <ScrollToTop />
      <CoreSDKProvider>
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
      </CoreSDKProvider>
    </HashRouter>
  );
}
