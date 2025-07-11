import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname),
  server: {
    port: 5173,
    host: "0.0.0.0",
  },
  plugins: [tailwindcss(), react()],
});
