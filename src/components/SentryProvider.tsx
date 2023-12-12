import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { CONFIG } from "lib/config";
import React, { useEffect } from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  Routes,
  useLocation,
  useNavigationType
} from "react-router-dom";

import { useConfigContext } from "./config/ConfigContext";

const routingInstrumentationFn = Sentry.reactRouterV6Instrumentation(
  React.useEffect,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
);
routingInstrumentationFn(() => undefined, true, true);

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

interface Props {
  children: JSX.Element;
}
export default function SentryProvider({ children }: Props) {
  const { config } = useConfigContext();
  useEffect(() => {
    Sentry.init({
      debug: config.enableSentryLogging,
      dsn: CONFIG.sentryDSNUrl,
      enabled: true,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: routingInstrumentationFn
        })
      ],
      environment: config.envName,
      tracesSampleRate: 1.0
    });
  }, [config]);
  return <SentryRoutes>{children}</SentryRoutes>;
}
