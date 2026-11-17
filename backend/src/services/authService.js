
import db from "../config/database.js";
import bcrypt from "bcryptjs";

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
