import { registerUser } from "../services/authService.js";
import { loginUser } from "../services/authService.js";

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

export async function login(req, res) {
  console.log("Rota de login foi chamada!");
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: "Informe e-mail e senha."
      });
    }

    console.log("Tentando autenticar:", email);
    const resultado = await loginUser({
      email: email.trim().toLowerCase(),
      senha
    });

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      ...resultado
    });

  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "E-mail ou senha incorretos."
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Erro interno do servidor."
    });
  }
}