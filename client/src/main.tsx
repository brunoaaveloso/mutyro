import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import App from "./App.tsx";
import axios from "axios";

axios.defaults.withCredentials = true;

console.log(
  "Configuração global do Axios 'withCredentials' foi definida como:",
  axios.defaults.withCredentials
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-center" />
  </StrictMode>
);
