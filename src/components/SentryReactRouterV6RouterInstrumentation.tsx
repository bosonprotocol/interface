/**
 * Extracted from https://gist.github.com/wontondon/e8c4bdf2888875e4c755712e99279536
 * as there is no reactRouterV6Instrumentation at the moment
 */

import { Transaction, TransactionContext } from "@sentry/types";
import { MutableRefObject, useEffect, useRef } from "react";
import {
  matchRoutes,
  RouteObject,
  useLocation,
  useNavigationType
} from "react-router-dom";

interface ReactRouterV6InstrumentationOptions {
  customStartTransaction: (
    context: TransactionContext
  ) => Transaction | undefined;
  matchPaths: boolean;
  routes: RouteObject[];
  startTransactionOnLocationChange?: boolean;
  startTransactionOnPageLoad?: boolean;
}

const instrumentationOptions: ReactRouterV6InstrumentationOptions = {
  customStartTransaction: () => undefined,
  matchPaths: false,
  routes: []
};

export function reactRouterV6Instrumentation(
  routes: RouteObject[] = [],
  matchPaths = false
) {
  return (
    customStartTransaction: (
      context: TransactionContext
    ) => Transaction | undefined,
    startTransactionOnPageLoad = true,
    startTransactionOnLocationChange = true
  ): void => {
    instrumentationOptions.customStartTransaction = customStartTransaction;
    instrumentationOptions.matchPaths = matchPaths;
    instrumentationOptions.routes = routes;
    instrumentationOptions.startTransactionOnLocationChange =
      startTransactionOnLocationChange;
    instrumentationOptions.startTransactionOnPageLoad =
      startTransactionOnPageLoad;
  };
}

const SENTRY_TAGS = {
  "routing.instrumentation": "react-router-v6-custom"
};

function getTransactionName(
  pathname: string,
  search: string,
  routes: RouteObject[] = []
): string {
  if (routes.length === 0) {
    return pathname;
  }

  const matches = matchRoutes(routes, pathname);
  if (matches && matches.length > 0) {
    const matchWithPathname = matches.find(
      (m) => m.pathname === pathname
    )?.pathname;
    if (matchWithPathname) {
      return `${matchWithPathname}${search}`;
    }
    return matches
      .filter((m) => !!m.route.path)
      .map((m) => `${m.route.path?.startsWith("/") ? "" : "/"}${m.route.path}`)
      .join("");
  }

  return pathname;
}

function SentryReactRouterV6RouterInstrumentation() {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();
  const activeTransaction: MutableRefObject<Transaction | undefined> = useRef();
  const instrumentationOptionsRef: MutableRefObject<
    ReactRouterV6InstrumentationOptions | undefined
  > = useRef(instrumentationOptions);

  useEffect(() => {
    if (instrumentationOptionsRef.current?.startTransactionOnPageLoad) {
      activeTransaction.current =
        instrumentationOptionsRef.current?.customStartTransaction({
          name: getTransactionName(
            pathname,
            search,
            instrumentationOptionsRef.current?.routes
          ),
          op: "pageload",
          tags: SENTRY_TAGS
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (instrumentationOptionsRef.current?.startTransactionOnLocationChange) {
      if (navigationType === "PUSH" || navigationType === "POP") {
        if (activeTransaction.current) {
          activeTransaction.current.finish();
        }

        activeTransaction.current =
          instrumentationOptionsRef.current?.customStartTransaction({
            name: getTransactionName(
              pathname,
              search,
              instrumentationOptionsRef.current?.routes
            ),
            op: "navigation",
            tags: SENTRY_TAGS
          });
      }
    }
  }, [pathname, navigationType]);

  return null;
}
export default SentryReactRouterV6RouterInstrumentation;
