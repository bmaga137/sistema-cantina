
import db from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser({ nome, email, senha }) {
    const existingUser = db.prepare(
        "SELECT id FROM usuarios WHERE email = ?"
    ).get(email);

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = db.prepare(`
        INSERT INTO usuarios (nome, email, senha_hash)
        VALUES (?, ?, ?)
    `).run(nome, email, senhaHash);

    return {
        id: result.lastInsertRowid,
        nome,
        email,
        tipo: "cliente"
    };
}

export async function loginUser({ email, senha }) {
  // 1. Procurar usuário pelo e-mail
  const usuario = db.prepare(
    "SELECT * FROM usuarios WHERE email = ?"
  ).get(email);

  if (!usuario) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // 2. Comparar a senha digitada com o hash salvo
  const senhaValida = await bcrypt.compare(
    senha,
    usuario.senha_hash
  );

  if (!senhaValida) {
    throw new Error("INVALID_CREDENTIALS");

    console.log("JWT_SECRET carregado:", !!process.env.JWT_SECRET);
  }

  // 3. Criar o token JWT
  const token = jwt.sign(
    {
      id: usuario.id,
      tipo: usuario.tipo
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );

  // 4. Retornar token e dados públicos do usuário
  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    }
  };
}