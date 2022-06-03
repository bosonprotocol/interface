import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  Routes,
  useLocation,
  useNavigationType
} from "react-router-dom";

import { CONFIG } from "./lib/config";

const routingInstrumentationFn = Sentry.reactRouterV6Instrumentation(
  React.useEffect,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
);
routingInstrumentationFn(() => undefined, true, true);
Sentry.init({
  debug: ["local", "testing"].includes(CONFIG.envName),
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

interface Props {
  children: JSX.Element;
}
export default function InitSentry({ children }: Props) {
  return <SentryRoutes>{children}</SentryRoutes>;
}
