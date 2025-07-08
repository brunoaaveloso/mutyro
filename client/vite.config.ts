import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // caminho absoluto para src, sem usar path ou __dirname
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        //target: "http://backend:5100",
        target: "http://localhost:5100",
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: [
      "mutyro.com.br",
      "www.mutyro.com.br",
      "localhost",
      "127.0.0.1",
    ],
  },
});
