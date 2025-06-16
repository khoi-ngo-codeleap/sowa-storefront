import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3100,
    host: "0.0.0.0",
  },
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react({
      babel: {
        presets: [["jotai/babel/preset"]],
      },
    }),
    sentryVitePlugin({
      org: "sowa-gd",
      project: "sowa-storefront",
      authToken:
        "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",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
