import { useConfigContext } from "components/config/ConfigContext";
import { removeItemInStorage } from "lib/utils/hooks/localstorage/useLocalStorage";
import {
  didReleaseVersionChange,
  saveCurrentReleaseVersion
} from "lib/utils/release";
import { queryClient } from "queryClient";
import { useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";

import SentryProvider from "../components/SentryProvider";
import ScrollToTop from "../components/utils/Scroll";
import routes from "./routes";
import SuspenseRoute from "./SuspenseRoute";
import { IRoutes } from "./types";

const useHandleRelease = () => {
  useEffect(() => {
    if (didReleaseVersionChange()) {
      removeItemInStorage("create-product");
    }

    saveCurrentReleaseVersion();
  }, []);
};

export default function AppRouter() {
  const { config } = useConfigContext();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [config.envConfig.configId]);
  useHandleRelease();
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
