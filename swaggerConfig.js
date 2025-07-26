import swaggerJSDoc from "swagger-jsdoc";
import * as dotenv from "dotenv";
dotenv.config();

const servers = [
  {
    url: "http://localhost:5100",
    description: "Servidor de Desenvolvimento Local",
  },
];

if (process.env.NODE_ENV === "production") {
  servers.unshift({
    url: process.env.API_URL,
    description: "Servidor de Produção",
  });
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Mutirões Comunitários",
      version: "1.0.0",
      description: "Documentação da API de Mutirões Comunitários",
    },
    servers: servers, // Usa a lista de servidores dinâmica
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
