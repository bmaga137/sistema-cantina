
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    // 1. Recuperar o cabeçalho de autorização
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não fornecido."
      });
    }

    // 2. Separar a palavra Bearer do token
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({
        error: "Formato de token inválido."
      });
    }

    // 3. Verificar se o token é válido
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4. Disponibilizar os dados do usuário
    req.usuario = decoded;

    // 5. Permitir que a requisição continue
    next();

  } catch (error) {
    return res.status(401).json({
      error: "Token inválido ou expirado."
    });
  }
}
