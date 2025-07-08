import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5100",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      external: [
        /^node:.*/,
        "@rollup/rollup-linux-x64-gnu"
      ],
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          leaflet: ["leaflet", "react-leaflet"],
          utils: ["date-fns", "lodash.debounce", "clsx"],
        },
      },
    },
    chunkSizeWarningLimit: 1600,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "styled-components"
    ],
    exclude: ["@rollup/rollup-linux-x64-gnu"],
  },
});
