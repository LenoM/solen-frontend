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
          if (
            id.includes("components/ui/calendar") ||
            id.includes("date-fns")
          ) {
            return "@calendar";
          }

          if (id.includes("@radix-ui")) {
            return "@ui-base";
          }

          if (id.includes("components/input") || id.includes("components/ui")) {
            return "@ui";
          }

          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform") ||
            id.includes("node_modules/yup")
          ) {
            return "@form";
          }

          if (id.includes("node_modules/react/")) {
            return "@dom-1";
          }

          if (id.includes("node_modules/react-dom")) {
            return "@dom-2";
          }

          if (id.includes("@tanstack")) {
            return "@query";
          }

          if (id.includes("src/utils")) {
            return "@util";
          }

          if (id.includes("node_modules/validator")) {
            return "@validator";
          }

          if (id.includes("react-icons") || id.includes("lucide-react")) {
            return "@icon";
          }

          if (id.includes("features/dashboard")) {
            return "@dash";
          }

          if (id.includes("features/custom-report")) {
            return "@report";
          }

          if (id.includes("features/user")) {
            return "@user";
          }

          if (id.includes("features/login") || id.includes("features/logoff")) {
            return "@login";
          }

          if (id.includes("features/crm")) {
            return "@crm";
          }

          if (id.includes("features/product")) {
            return "@prod";
          }

          if (
            id.includes("features/invoice") ||
            id.includes("features/batch-generator")
          ) {
            return "@inv";
          }

          if (id.includes("features/client/details")) {
            return "@cli-det";
          }

          if (id.includes("features/client/table")) {
            return "@cli-list";
          }

          if (id.includes("features/client/add")) {
            return "@cli-add";
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
