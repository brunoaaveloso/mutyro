import axios from "axios";

// Cria uma instancia do axios
// Define a URL base para as requisições
// Isso significa que todas as requisições feitas com essa instância terão essa URL como prefixo
// Por exemplo, se você fizer uma requisição para "/users",
// a URL completa será "http://localhost:5000/api/v1/users"
const customFetch = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Adicione um interceptor de requisição
customFetch.interceptors.request.use((config) => {
  // Para requisições FormData, não definir Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// Interceptor para respostas
customFetch.interceptors.response.use(
  (response) => {
    console.log("Resposta recebida:", response);
    return response;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

export default customFetch;
