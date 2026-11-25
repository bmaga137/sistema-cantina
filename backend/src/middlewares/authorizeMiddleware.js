
export function authorizeMiddleware(...tiposPermitidos) {
  return (req, res, next) => {
    // Verificar se existe um usuário autenticado
    if (!req.usuario) {
      return res.status(401).json({
        error: "Usuário não autenticado."
      });
    }

    // Verificar se o perfil possui autorização
    if (!tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({
        error: "Você não tem permissão para acessar este recurso."
      });
    }

    // Permitir que a requisição continue
    next();
  };
}
