import { LoadingMessage } from "components/loading/LoadingMessage";
import { Suspense } from "react";

import App from "../components/app";
import GuardedRoute from "./GuardedRoute";
import { baseAppProps } from "./routes";
import { IRoutes } from "./types";
import useUserRoles from "./useUserRoles";

export default function SuspenseRoute({
  app,
  component: Component,
  componentProps,
  role
}: IRoutes) {
  const roles = useUserRoles({ role });

  if (role && role.length > 0) {
    return (
      <GuardedRoute isAuth={roles.isAuth}>
        <Suspense
          fallback={
            <App {...baseAppProps}>
              <LoadingMessage />
            </App>
          }
        >
          <App {...app}>
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
          <LoadingMessage />
        </App>
      }
    >
      <App {...app}>
        <Component {...componentProps} />
      </App>
    </Suspense>
  );
}
