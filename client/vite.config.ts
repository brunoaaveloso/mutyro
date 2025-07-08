import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

// Configuração alinhada com tsconfig.node.json (ES2022) e tsconfig.app.json (ES2020)
export default defineConfig({
  base: "/",
  plugins: [
    react({
      jsxImportSource: "react",
      babel: {
        plugins: ["@babel/plugin-transform-react-jsx"]
      }
    }),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./") // Adicionado para acesso à raiz
    },
    extensions: [
      ".ts", ".tsx", ".js", ".jsx", 
      ".json", ".mjs" // Adicionado para módulos modernos
    ],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5100",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.error("Proxy Error:", err);
          });
        }
      },
    },
  },
  build: {
    target: "es2022", // Alinhado com tsconfig.node.json
    outDir: "dist",
    emptyOutDir: true,
    cssTarget: "es2022", // CSS moderno
    rollupOptions: {
      external: [
        /^node:.*/,
        "@rollup/rollup-linux-x64-gnu",
        "react-big-calendar" // Adicionado para otimização
      ],
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("leaflet")) {
              return "vendor-leaflet";
            }
            return "vendor";
          }
        },
        format: "esm",
        chunkFileNames: "assets/[name]-[hash].mjs", // Extensão .mjs para módulos
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "assets/[name]-[hash].mjs",
      },
    },
    chunkSizeWarningLimit: 2500, // Aumentado para projetos grandes
    minify: "esbuild", // Otimizado para ES2022
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "styled-components",
      "lucide-react",
      "date-fns" // Adicionado para pré-empacotamento
    ],
    exclude: [
      "@rollup/rollup-linux-x64-gnu",
      "react-big-calendar"
    ],
    esbuildOptions: {
      target: "es2022", // Alinhado com tsconfig.node.json
      supported: {
        'top-level-await': true // Suporte a top-level await
      },
    },
  },
  esbuild: {
    target: "es2022",
    jsx: "automatic",
    jsxDev: false, // Desativado para produção
    jsxImportSource: "react",
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly", // Mais estrito
    },
    postcss: {
      plugins: [
        require("autoprefixer")({
          overrideBrowserslist: ["defaults and supports es6-module"],
        }),
      ],
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    __VITE_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
