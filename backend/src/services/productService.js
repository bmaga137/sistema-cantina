import { consultar, buscar, executar } from "../config/database.js";

// Listar produtos ativos e disponíveis
export async function getProducts() {
  return consultar(`
    SELECT id, nome, descricao, preco_centavos, disponivel
    FROM produtos
    WHERE ativo = 1 AND disponivel = 1
    ORDER BY nome ASC
  `);
}

export async function getActiveProducts() {
  return consultar(`
    SELECT id, nome, descricao, preco_centavos, disponivel
    FROM produtos
    WHERE ativo = 1
    ORDER BY nome ASC
  `);
}

// Cadastrar produto
export async function createProduct({
  nome,
  descricao,
  preco_centavos,
  disponivel = 1
}) {
  const result = await executar(`
    INSERT INTO produtos (
      nome,
      descricao,
      preco_centavos,
      disponivel
    )
    VALUES (?, ?, ?, ?)
  `, [nome, descricao, preco_centavos, disponivel]);

  return buscar(`
    SELECT id, nome, descricao, preco_centavos, disponivel
    FROM produtos
    WHERE id = ?
  `, [Number(result.lastInsertRowid)]);
}

export async function updateProduct(id, {
  nome,
  descricao,
  preco_centavos,
  disponivel
}) {
  const result = await executar(`
    UPDATE produtos
    SET nome = ?,
        descricao = ?,
        preco_centavos = ?,
        disponivel = ?
    WHERE id = ? AND ativo = 1
  `, [nome, descricao, preco_centavos, disponivel, id]);

  if (result.rowsAffected === 0) {
    return null;
  }

  return buscar(`
    SELECT id, nome, descricao, preco_centavos, disponivel
    FROM produtos
    WHERE id = ?
  `, [id]);
}

export async function deactivateProduct(id) {
  const result = await executar(`
    UPDATE produtos
    SET ativo = 0, disponivel = 0
    WHERE id = ? AND ativo = 1
  `, [id]);

  return result.rowsAffected > 0;
}
