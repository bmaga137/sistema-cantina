
import { registerUser } from "../services/authService.js";

export async function register(req, res) {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                error: "Preencha todos os campos."
            });
        }

        const usuario = await registerUser({
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha
        });

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso.",
            usuario
        });

    } catch (error) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                error: "Este e-mail já está cadastrado."
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}
