import { useConfigContext } from "components/config/ConfigContext";
import { queryClient } from "queryClient";
import { useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";

import SentryProvider from "../components/SentryProvider";
import ScrollToTop from "../components/utils/Scroll";
import routes, { IRoutes } from "./routes";
import SuspenseRoute from "./SuspenseRoute";

export default function AppRouter() {
  const { config } = useConfigContext();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [config.envConfig.configId]);
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
