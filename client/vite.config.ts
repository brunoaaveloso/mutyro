import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [
    react({
      jsxImportSource: "react", // Alinhado com seu tsconfig.app.json (react-jsx)
    }),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alinhado com paths do tsconfig
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"], // Compatível com moduleResolution bundler
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
    target: "es2020", // Alinhado com seu tsconfig
    outDir: "dist",
    emptyOutDir: true,
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
          vendor: ["axios", "react-router-dom"],
        },
        format: "esm", // Alinhado com module ESNext
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
    chunkSizeWarningLimit: 2000,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "styled-components",
      "lucide-react"
    ],
    exclude: [
      "@rollup/rollup-linux-x64-gnu"
    ],
    esbuildOptions: {
      target: "es2020", // Consistente com tsconfig
    },
  },
  esbuild: {
    jsx: "automatic", // Equivalente a react-jsx
  },
});
