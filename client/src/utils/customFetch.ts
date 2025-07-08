import axios from "axios";

// Cria uma instancia do axios
// Define a URL base para as requisições
// Isso significa que todas as requisições feitas com essa instância terão essa URL como prefixo
// Por exemplo, se você fizer uma requisição para "/users",
// a URL completa será "http://localhost:5000/api/v1/users"
const customFetch = axios.create({
  baseURL: "/api",
});

// Interceptor que será executado ANTES de cada requisição
customFetch.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Adiciona o token ao cabeçalho Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token adicionado ao cabeçalho da requisição.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default customFetch;
