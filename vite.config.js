import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";
import path from "path";

const pathConfig = path.resolve(path.resolve(), "src");

export default defineConfig({
  build: {
    cssMinify: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react-dom")) {
            return "@dom-1";
          }

          if (id.includes("node_modules/react-router-dom/")) {
            return "@dom-2";
          }

          if (id.includes("node_modules/validator")) {
            return "@validator";
          }

          if (id.includes("@tanstack/query-core")) {
            return "@query";
          }

          if (id.includes("@tanstack/table-core")) {
            return "@table";
          }

          if (id.includes("src/lib")) {
            return "@lib";
          }

          if (id.includes("lucide-react")) {
            return "@icon";
          }

          if (id.includes("date-fns")) {
            return "@date";
          }

          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform") ||
            id.includes("node_modules/yup")
          ) {
            return "@form";
          }
        },
      },
    },
  },
  plugins: [react(), compression(), visualizer()],
  resolve: {
    alias: [{ find: "@", replacement: pathConfig }],
  },
});
