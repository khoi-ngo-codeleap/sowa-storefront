import * as Sentry from "@sentry/react";
import router from "./router";

Sentry.init({
  release: "sowa-storefront@1.0.0",
  dsn: "https://4ad16defa1e00771b1e2246409cd90ea@o4508845589790720.ingest.us.sentry.io/4508846114996224",
  integrations: [
    Sentry.tanstackRouterBrowserTracingIntegration(router),
    Sentry.replayIntegration(),
  ],
  sampleRate: 0.1,
  tracesSampleRate: 0.1,
  // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  replaysOnErrorSampleRate: 1.0
});
