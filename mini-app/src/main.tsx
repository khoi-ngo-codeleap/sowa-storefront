import { AppBridge, createAppBridge } from "@jtl-software/cloud-apps-core";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
declare global {
  interface Window {
    bridge: AppBridge;
  }
}

async function init() {
  const bridge = await createAppBridge();
  window.bridge = bridge;
  createRoot(document.getElementById("root")!).render(<App />);
}

init();
