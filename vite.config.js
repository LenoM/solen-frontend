import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

import path from "path";

const pathConfig = path.resolve(path.resolve(), "src");

export default defineConfig({
  build: {
    cssMinify: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("react-hook-form") || id.includes("@hookform")) {
            return "@hook";
          }

          if (id.includes("tailwind-merge")) {
            return "@merge";
          }

          if (id.includes("node_modules/react/")) {
            return "@dom-1";
          }

          if (id.includes("node_modules/react-dom")) {
            return "@dom-2";
          }

          if (id.includes("table-core")) {
            return "@table";
          }

          if (id.includes("@tanstack")) {
            return "@query";
          }

          if (id.includes("node_modules/yup")) {
            return "@forms";
          }

          if (id.includes("sonner")) {
            return "@sonner";
          }

          if (id.includes("node_modules/validator")) {
            return "@validator";
          }

          if (id.includes("react-router")) {
            return "@router";
          }

          if (id.includes("date-fns")) {
            return "@date";
          }

          if (id.includes("react-icons") || id.includes("lucide-react")) {
            return "@icon";
          }

          if (id.includes("radix-ui/react-dialog")) {
            return "@ui-dialog";
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
