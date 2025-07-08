import "express-async-errors"; //trata os erros dassincronos e passa para o middleware de erro
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";

//Swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js";

//Routers
import mutiraoRoute from "./routes/mutiraoRoute.js";
import authRoute from "./routes/authRoute.js";
import userRouter from "./routes/userRouter.js";
import notificacaoRoutes from "./routes/notificacaoRoutes.js";

//Middlewares
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

//controllers
import { finalizarMutirao } from "./controllers/mutiraoController.js";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do express-session
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false, // Não salva a sessão novamente se não houver alterações
    saveUninitialized: true, // Salva sessões não inicializadas
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// verifica se o mutirao está finalizado e atualiza o status a cada 24 horas
async function iniciarVerificacaoPeriodica() {
  try {
    console.log("Executando verificação inicial de mutirões finalizados...");
    const resultados = await finalizarMutirao();
    console.log(
      `Mutirões finalizados: ${resultados.marcados} marcados, ${resultados.total} verificados`
    );

    // Configura o intervalo para verificar a cada 24 horas
    setInterval(async () => {
      try {
        console.log(
          "Executando verificação periódica de mutirões finalizados..."
        );
        const resultadosPeriodicos = await finalizarMutirao();
        console.log(
          `Mutirões finalizados: ${resultadosPeriodicos.marcados} marcados, ${resultadosPeriodicos.total} verificados`
        );
      } catch (error) {
        console.error("Erro na verificação periódica:", error);
      }
    }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos
  } catch (error) {
    console.error("Erro na verificação inicial:", error);
  }
}

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Dev
      "https://mutyro.vercel.app", // Produção
    ],
    credentials: true,
  })
);

// Arquivo estático para uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Configurações
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Olá mundo!");
});

//teste proxy
app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

//Rotas
app.use("/api/v1/mutiroes", mutiraoRoute);
app.use("/api/v1/usuarios", authenticateUser, userRouter);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/notificacoes", notificacaoRoutes);

// Rotas de erro tem que vir depois das Rotas do CRUD
app.use("*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada!" });
});

//Middleware de erro
app.use(errorHandlerMiddleware);

//Conexão com o banco de dados
const port = process.env.PORT || 5100;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, async () => {
    console.log(`Servidor rodando na porta ${port}....`);
    console.log(
      `Swagger docs disponíveis em: http://localhost:${port}/api-docs`
    );
    await iniciarVerificacaoPeriodica();
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

//MONGO_URL=mongodb+srv://Rogerio:password@cluster0.7p5tr.mongodb.net/Mutyro?retryWrites=true&w=majority&appName=Cluster0

//MONGO_URL=mongodb+srv://joaohenriquelamounier:125491jh@cluster1.g7wlbab.mongodb.net/MUTYRO?retryWrites=true&w=majority&appName=Cluster1
