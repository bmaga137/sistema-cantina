import db, { buscar, consultar } from "../config/database.js";

export async function createOrder(usuarioId, itens) {
  const transacao = await db.transaction("write");

  try {
    const itensComPreco = [];
    let total = 0;

    for (const item of itens) {
      const { rows: [produto] } = await transacao.execute({
        sql: "SELECT preco_centavos FROM produtos WHERE id = ? AND ativo = 1 AND disponivel = 1",
        args: [item.produto_id]
      });
      if (!produto) throw new Error("PRODUCT_UNAVAILABLE");

      total += item.quantidade * produto.preco_centavos;
      itensComPreco.push({ ...item, preco: produto.preco_centavos });
    }

    if (!Number.isSafeInteger(total)) throw new Error("INVALID_TOTAL");

    const { lastInsertRowid } = await transacao.execute({
      sql: "INSERT INTO pedidos (usuario_id, valor_total_centavos) VALUES (?, ?)",
      args: [usuarioId, total]
    });
    const id = Number(lastInsertRowid);

    await transacao.batch(itensComPreco.map((item) => ({
      sql: `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario_centavos)
        VALUES (?, ?, ?, ?)`,
      args: [id, item.produto_id, item.quantidade, item.preco]
    })));

    await transacao.commit();
    return { id, status: "pendente", valor_total_centavos: total };
  } finally {
    transacao.close();
  }
}

export function getOrders(usuario) {
  if (usuario.tipo === "administrador") {
    return consultar("SELECT * FROM pedidos ORDER BY id DESC");
  }

  return consultar("SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY id DESC", [usuario.id]);
}

export async function getOrder(id, usuario) {
  const pedido = await (usuario.tipo === "administrador"
    ? buscar("SELECT * FROM pedidos WHERE id = ?", [id])
    : buscar("SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?", [id, usuario.id]));

  if (!pedido) {
    return null;
  }

  const itens = await consultar(`
    SELECT itens_pedido.produto_id, produtos.nome, itens_pedido.quantidade,
           itens_pedido.preco_unitario_centavos
    FROM itens_pedido
    JOIN produtos ON produtos.id = itens_pedido.produto_id
    WHERE pedido_id = ?
    ORDER BY itens_pedido.id
  `, [id]);

  return { ...pedido, itens };
}

export function updateOrderStatus(id, status) {
  return buscar("UPDATE pedidos SET status = ? WHERE id = ? RETURNING *", [status, id]);
}
