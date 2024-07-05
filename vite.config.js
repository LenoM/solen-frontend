import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
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
          if (id.includes("radix-ui")) {
            return "@radix-ui";
          }
        },
      },
    },
  },
  plugins: [react(), compression()],
  resolve: {
    alias: [{ find: "@", replacement: pathConfig }],
  },
});
