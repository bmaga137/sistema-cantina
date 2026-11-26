import {
  getProducts,
  getActiveProducts,
  createProduct,
  updateProduct,
  deactivateProduct
} from "../services/productService.js";

// Listar produtos
export async function listProducts(req, res) {
  try {
    const produtos = await getProducts();

    return res.status(200).json(produtos);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao consultar produtos."
    });
  }
}

// Cadastrar produto
export async function listActiveProducts(req, res) {
  return res.json(await getActiveProducts());
}

export async function registerProduct(req, res) {
  try {
    const {
      nome,
      descricao,
      preco_centavos,
      disponivel
    } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      !Number.isInteger(preco_centavos) ||
      preco_centavos < 0 ||
      (disponivel !== undefined &&
        ![0, 1].includes(disponivel))
    ) {
      return res.status(400).json({
        error: "Dados do produto inválidos."
      });
    }

    const produto = await createProduct({
      nome: nome.trim(),
      descricao: descricao ?? "",
      preco_centavos,
      disponivel: disponivel ?? 1
    });

    return res.status(201).json({
      message: "Produto cadastrado com sucesso.",
      produto
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao cadastrar produto."
    });
  }
}

export async function editProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "ID de produto inválido."
      });
    }

    const {
      nome,
      descricao,
      preco_centavos,
      disponivel
    } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      !Number.isInteger(preco_centavos) ||
      preco_centavos < 0 ||
      ![0, 1].includes(disponivel) ||
      (descricao !== undefined && typeof descricao !== "string")
    ) {
      return res.status(400).json({
        error: "Dados do produto inválidos."
      });
    }

    const produto = await updateProduct(id, {
      nome: nome.trim(),
      descricao: descricao ?? "",
      preco_centavos,
      disponivel
    });

    if (!produto) {
      return res.status(404).json({
        error: "Produto não encontrado ou inativo."
      });
    }

    return res.status(200).json({
      message: "Produto atualizado com sucesso.",
      produto
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao atualizar produto."
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "ID de produto inválido."
      });
    }

    const desativado = await deactivateProduct(id);

    if (!desativado) {
      return res.status(404).json({
        error: "Produto não encontrado ou já inativo."
      });
    }

    return res.status(200).json({
      message: "Produto desativado com sucesso."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao desativar produto."
    });
  }
}
