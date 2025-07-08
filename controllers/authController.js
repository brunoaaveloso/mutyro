import { StatusCodes } from "http-status-codes";
import Usuario from "../models/usuarioModel.js";
import { senhaHash, compararSenha } from "../utils/senhaUtils.js";
import { createJWT } from "../utils/tokenUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

//Lidando com o cadastro de usuários criando um novo usuário com os dados fornecidos no corpo da requisição.
export const cadastro = async (req, res) => {
  const primeiroCadastro = (await Usuario.countDocuments()) === 0;
  req.body.isAdmin = primeiroCadastro;

  //Criptografando a senha
  const senhaComHash = await senhaHash(req.body.senha);
  req.body.senha = senhaComHash;

  const user = await Usuario.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Usuário Cadastrado com sucesso!" });
};

//Lidando com o login de usuários
export const login = async (req, res) => {
  const usuario = await Usuario.findOne({ email: req.body.email });

  const usuarioValido =
    usuario && (await compararSenha(req.body.senha, usuario.senha));
  if (!usuarioValido)
    throw new UnauthenticatedError("Email ou senha incorretos!");

  const token = createJWT({
    userId: usuario._id,
    nome: usuario.nome,
    isAdmin: usuario.isAdmin,
  });

  const oneDAY = 1000 * 60 * 60 * 24;
  // Definindo o cookie com o token JWT

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDAY),
    secure: process.env.NODE_ENV === "production", // Define como true se estiver em ambiente de produção
  });

  // Enviando os dados do usuário na resposta
  const usuarioResposta = {
    _id: usuario._id,
    nome: usuario.nome,
    email: usuario.email,
    isAdmin: usuario.isAdmin,
    avatar: usuario.avatar,
  };

  res.status(StatusCodes.OK).json({
    msg: "Login realizado com sucesso!",
    token: token,
    usuario: usuarioResposta,
  });
};

export const googleCallback = async (req, res) => {
  try {
    // Verifica se o usuário já existe no banco de dados
    let usuario = await Usuario.findOne({ email: req.user.email });

    if (!usuario) {
      // Cria um novo usuário se ele não existir
      usuario = await Usuario.create({
        nome: req.user.displayName,
        email: req.user.email,
        senha: null, // Senha não é necessária para login via Google
      });
    }

    // Gera um token JWT
    const token = createJWT({
      userId: usuario._id,
      nome: usuario.nome,
      isAdmin: usuario.isAdmin,
    });

    const oneDAY = 1000 * 60 * 60 * 24;

    // Define o cookie com o token JWT
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDAY),
      secure: process.env.NODE_ENV === "production", // Use true em produção
    });

    // Redireciona para a página de usuário no frontend
    res.redirect(`${process.env.FRONTEND_URL}/user`);
  } catch (error) {
    console.error("Erro ao processar autenticação via Google:", error);
    res.redirect(process.env.FRONTEND_URL || "/"); // Redireciona para a página inicial em caso de erro
  }
};

// Configuração do Passport para autenticação com Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verifica se o usuário já existe no banco de dados
        let usuario = await Usuario.findOne({ email: profile.emails[0].value });

        if (!usuario) {
          // Cria um novo usuário se ele não existir
          usuario = await Usuario.create({
            nome: profile.displayName,
            email: profile.emails[0].value,
            senha: null, // Senha não é necessária para login via Google
          });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const usuario = await Usuario.findById(id);
  done(null, usuario);
});

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logout realizado com sucesso!" });
};

//redefinição de senha
export const enviarLinkRedefinicao = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Configurar transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar e-mail com o link de redefinição
    const link = `${process.env.FRONTEND_URL}/redefinir-senha/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Redefinição de Senha - Mutyro",
      html: `<p>Olá,</p>
             <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:</p>
             <a href="${link}">${link}</a>
             <p>Se você não solicitou isso, ignore este e-mail.</p>`,
    });

    res.status(200).json({ msg: "Link de redefinição enviado para o e-mail." });
  } catch (error) {
    console.error("Erro ao enviar link de redefinição:", error);
    res.status(500).json({ msg: "Erro ao enviar link de redefinição." });
  }
};

//validar o token e atualizar a senha no arquivo
export const redefinirSenha = async (req, res) => {
  const { token, novaSenha } = req.body;

  console.log("Token recebido:", token);
  console.log("Nova senha recebida:", novaSenha);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.userId);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    usuario.senha = await senhaHash(novaSenha);
    await usuario.save();

    res.status(200).json({ msg: "Senha redefinida com sucesso." });
  } catch (error) {
    res.status(400).json({ msg: "Token inválido ou expirado." });
  }
};
