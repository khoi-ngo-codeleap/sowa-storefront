import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "@/app/App";
import "./configs/instrument";
import "./index.css";

createRoot(document.getElementById("root")!, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn("Uncaught error", error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <StrictMode>
    <App />
  </StrictMode>
);
