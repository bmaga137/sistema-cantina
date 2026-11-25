import db from "../config/database.js";

export const createOrder = db.transaction((usuarioId, itens) => {
  const findAvailableProduct = db.prepare(`
    SELECT preco_centavos FROM produtos
    WHERE id = ? AND ativo = 1 AND disponivel = 1
  `);
  let total = 0;

  const itensComPreco = itens.map((item) => {
    const produto = findAvailableProduct.get(item.produto_id);

    if (!produto) {
      throw new Error("PRODUCT_UNAVAILABLE");
    }

    total += item.quantidade * produto.preco_centavos;
    return { ...item, preco: produto.preco_centavos };
  });

  if (!Number.isSafeInteger(total)) {
    throw new Error("INVALID_TOTAL");
  }

  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO pedidos (usuario_id, valor_total_centavos) VALUES (?, ?)
  `).run(usuarioId, total);

  const insertItem = db.prepare(`
    INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario_centavos)
    VALUES (?, ?, ?, ?)
  `);

  for (const item of itensComPreco) {
    insertItem.run(id, item.produto_id, item.quantidade, item.preco);
  }

  return { id, status: "pendente", valor_total_centavos: total };
}).immediate;

export function getOrders(usuario) {
  if (usuario.tipo === "administrador") {
    return db.prepare("SELECT * FROM pedidos ORDER BY id DESC").all();
  }

  return db.prepare("SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY id DESC")
    .all(usuario.id);
}

export function getOrder(id, usuario) {
  const pedido = usuario.tipo === "administrador"
    ? db.prepare("SELECT * FROM pedidos WHERE id = ?").get(id)
    : db.prepare("SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?").get(id, usuario.id);

  if (!pedido) {
    return null;
  }

  const itens = db.prepare(`
    SELECT itens_pedido.produto_id, produtos.nome, itens_pedido.quantidade,
           itens_pedido.preco_unitario_centavos
    FROM itens_pedido
    JOIN produtos ON produtos.id = itens_pedido.produto_id
    WHERE pedido_id = ?
    ORDER BY itens_pedido.id
  `).all(id);

  return { ...pedido, itens };
}

export function updateOrderStatus(id, status) {
  return db.prepare("UPDATE pedidos SET status = ? WHERE id = ? RETURNING *")
    .get(status, id);
}
