
import { buscar, executar } from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser({ nome, email, senha }) {
    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await executar(`
        INSERT INTO usuarios (nome, email, senha_hash)
        VALUES (?, ?, ?)
        ON CONFLICT(email) DO NOTHING
    `, [nome, email, senhaHash]);

    if (result.rowsAffected === 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    return {
        id: Number(result.lastInsertRowid),
        nome,
        email,
        tipo: "cliente"
    };
}

export async function loginUser({ email, senha }) {
  // 1. Procurar usuário pelo e-mail
  const usuario = await buscar("SELECT * FROM usuarios WHERE email = ?", [email]);

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
