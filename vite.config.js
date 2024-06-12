import { defineConfig } from "vite";
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
          if (id.includes("components/ui")) {
            return "@ui";
          }
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: pathConfig }],
  },
});
