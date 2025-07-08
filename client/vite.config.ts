import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

export default defineConfig({
  base: "/", // Configuração essencial para o Vercel
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Caminho absoluto mais seguro
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
    outDir: "dist", // Explícito para o Vercel
    emptyOutDir: true, // Limpa o diretório antes de buildar
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
          vendor: ["axios", "react-router-dom"], // Adicionado para melhor cache
        },
        chunkFileNames: "assets/[name]-[hash].js", // Nomeação consistente
      },
    },
    chunkSizeWarningLimit: 2000, // Aumentado para projetos grandes
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "styled-components",
      "lucide-react" // Adicionado para otimização
    ],
    exclude: [
      "@rollup/rollup-linux-x64-gnu",
      "react-big-calendar" // Melhora tempo de build
    ],
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";` // Se usar SCSS
      }
    }
  }
});
