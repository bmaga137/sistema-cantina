import db from "../config/database.js";

// Listar produtos ativos e disponíveis
export function getProducts() {
  return db.prepare(`
    SELECT id, nome, descricao, preco_centavos, disponivel
    FROM produtos
    WHERE ativo = 1 AND disponivel = 1
    ORDER BY nome ASC
  `).all();
}

export function getActiveProducts() {
  return db.prepare(`
    SELECT id, nome, descricao, preco_centavos, disponivel
    FROM produtos
    WHERE ativo = 1
    ORDER BY nome ASC
  `).all();
}

// Cadastrar produto
export function createProduct({
  nome,
  descricao,
  preco_centavos,
  disponivel = 1
}) {
  const result = db.prepare(`
    INSERT INTO produtos (
      nome,
      descricao,
      preco_centavos,
      disponivel
    )
    VALUES (?, ?, ?, ?)
  `).run(nome, descricao, preco_centavos, disponivel);

  return db.prepare(`
    SELECT id, nome, descricao, preco_centavos, disponivel
    FROM produtos
    WHERE id = ?
  `).get(result.lastInsertRowid);
}

export function updateProduct(id, {
  nome,
  descricao,
  preco_centavos,
  disponivel
}) {
  const result = db.prepare(`
    UPDATE produtos
    SET nome = ?,
        descricao = ?,
        preco_centavos = ?,
        disponivel = ?
    WHERE id = ? AND ativo = 1
  `).run(nome, descricao, preco_centavos, disponivel, id);

  if (result.changes === 0) {
    return null;
  }

  return db.prepare(`
    SELECT id, nome, descricao, preco_centavos, disponivel
    FROM produtos
    WHERE id = ?
  `).get(id);
}

export function deactivateProduct(id) {
  const result = db.prepare(`
    UPDATE produtos
    SET ativo = 0, disponivel = 0
    WHERE id = ? AND ativo = 1
  `).run(id);

  return result.changes > 0;
}
