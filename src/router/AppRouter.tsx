import { HashRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "../components/utils/Scroll";
import routes, { IRoutes } from "./routes";
import SuspenseRoute from "./SuspenseRoute";

export default function AppRouter() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {routes.map((route: IRoutes) => (
          <Route
            key={`route_${route.path}`}
            {...route}
            element={<SuspenseRoute {...route} />}
          />
        ))}
      </Routes>
      {/* <SentryProvider>
      </SentryProvider> */}
    </HashRouter>
  );
}
