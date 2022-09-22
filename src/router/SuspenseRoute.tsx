import { Suspense, useMemo } from "react";

import App from "../components/app";
import Loading from "../components/ui/Loading";
import GuardedRoute from "./GuardedRoute";
import { baseAppProps, IRoutes, UserRoles } from "./routes";

export default function SuspenseRoute({
  app,
  component: Component,
  componentProps,
  role
}: IRoutes) {
  const handleRoutesByRoles = useMemo(() => {
    switch (role) {
      case UserRoles.Guest:
        return {
          hide: []
        };
      case UserRoles.Buyer:
        return {
          hide: []
        };
      case UserRoles.Seller:
        return {
          hide: []
        };
      case UserRoles.DisputeResolver:
        return {
          hide: []
        };
    }
  }, [role]);

  if (role && role.length > 0) {
    return (
      <GuardedRoute role={role}>
        <Suspense
          fallback={
            <App {...baseAppProps}>
              <Loading />
            </App>
          }
        >
          <App {...app} appProps={handleRoutesByRoles}>
            <Component {...componentProps} />
          </App>
        </Suspense>
      </GuardedRoute>
    );
  }

  return (
    <Suspense
      fallback={
        <App {...baseAppProps}>
          <Loading />
        </App>
      }
    >
      <App {...app} appProps={handleRoutesByRoles}>
        <Component {...componentProps} />
      </App>
    </Suspense>
  );
}
