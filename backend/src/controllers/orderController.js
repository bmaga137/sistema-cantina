import { createOrder, getOrders, getOrder, updateOrderStatus } from "../services/orderService.js";

function isPositiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0;
}

export function registerOrder(req, res) {
  const itens = req.body?.itens;

  if (
    !Array.isArray(itens) ||
    itens.length === 0 ||
    itens.some((item) => !isPositiveInteger(item?.produto_id) || !isPositiveInteger(item?.quantidade))
  ) {
    return res.status(400).json({ error: "Informe os produtos e suas quantidades." });
  }

  if (new Set(itens.map((item) => item.produto_id)).size !== itens.length) {
    return res.status(400).json({ error: "Informe cada produto uma única vez no pedido." });
  }

  try {
    const pedido = createOrder(req.usuario.id, itens);
    return res.status(201).json({ message: "Pedido realizado com sucesso.", pedido });
  } catch (error) {
    if (error.message === "PRODUCT_UNAVAILABLE") {
      return res.status(400).json({ error: "Um dos produtos do pedido está indisponível." });
    }

    if (error.message === "INVALID_TOTAL") {
      return res.status(400).json({ error: "Valor total do pedido inválido." });
    }

    throw error;
  }
}

export function listOrders(req, res) {
  return res.json(getOrders(req.usuario));
}

export function showOrder(req, res) {
  const id = Number(req.params.id);

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ error: "ID de pedido inválido." });
  }

  const pedido = getOrder(id, req.usuario);

  if (!pedido) {
    return res.status(404).json({ error: "Pedido não encontrado." });
  }

  return res.json(pedido);
}

export function changeOrderStatus(req, res) {
  const id = Number(req.params.id);
  const status = req.body?.status;

  if (!isPositiveInteger(id) || !["pendente", "concluido", "cancelado"].includes(status)) {
    return res.status(400).json({ error: "ID ou status do pedido inválido." });
  }

  const pedido = updateOrderStatus(id, status);

  if (!pedido) {
    return res.status(404).json({ error: "Pedido não encontrado." });
  }

  return res.json(pedido);
}
