import "dotenv/config";
import bcrypt from "bcryptjs";
import db, { executar } from "../config/database.js";
import { initDatabase } from "../config/initDatabase.js";

async function createAdmin() {
  const nome = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;

  if (!nome || !email || !senha) {
    throw new Error("Configure as variáveis ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD.");
  }

  if (senha.length < 8) {
    throw new Error("A senha do administrador deve ter pelo menos 8 caracteres.");
  }

  await initDatabase();

  const senhaHash = await bcrypt.hash(senha, 10);

  const resultado = await executar(`
    INSERT INTO usuarios (nome, email, senha_hash, tipo)
    VALUES (?, ?, ?, 'administrador')
    ON CONFLICT(email) DO NOTHING
  `, [nome, email, senhaHash]);

  if (resultado.rowsAffected === 0) {
    throw new Error("Já existe um usuário com esse e-mail.");
  }

  console.log("Administrador criado com sucesso!");
}

createAdmin()
  .catch((error) => {
    console.error("Erro:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    db.close();
  });
