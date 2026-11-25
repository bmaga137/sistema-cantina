import React, { useEffect, useState } from "react";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function Cardapio({ token, aoRegistrarPedido }) {
  const [produtos, setProdutos] = useState(null);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [quantidades, setQuantidades] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroPedido, setErroPedido] = useState("");
  const [pedido, setPedido] = useState(null);

  const itens = (produtos ?? [])
    .filter((produto) => quantidades[produto.id] > 0)
    .map((produto) => ({ ...produto, quantidade: quantidades[produto.id] }));
  const total = itens.reduce((soma, item) => soma + item.preco_centavos * item.quantidade, 0);

  function alterarQuantidade(id, ajuste) {
    setQuantidades((atual) => ({
      ...atual,
      [id]: Math.max(0, (atual[id] ?? 0) + ajuste)
    }));
    setErroPedido("");
    setPedido(null);
  }

  async function finalizarPedido() {
    if (enviando || itens.length === 0) return;

    setEnviando(true);
    setErroPedido("");

    try {
      const resposta = await fetch("/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itens: itens.map(({ id, quantidade }) => ({ produto_id: id, quantidade }))
        })
      });
      const dados = await resposta.json().catch(() => null);

      if (resposta.status === 401) {
        setErroPedido("Sua sessão expirou. Saia e entre novamente.");
        return;
      }

      if (!resposta.ok || !dados?.pedido) {
        setErroPedido(dados?.error ?? "Não foi possível confirmar o pedido.");
        return;
      }

      setPedido(dados.pedido);
      setQuantidades({});
      aoRegistrarPedido();
    } catch {
      setErroPedido("A conexão falhou e o pedido não pôde ser confirmado.");
    } finally {
      setEnviando(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        const resposta = await fetch("/api/produtos", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        if (!resposta.ok) throw new Error("Falha ao consultar o cardápio.");

        const catalogo = await resposta.json();
        if (!Array.isArray(catalogo)) throw new Error("Catálogo inválido.");

        if (!controller.signal.aborted) setProdutos(catalogo);
      } catch {
        if (!controller.signal.aborted) setErro("Não foi possível carregar o cardápio.");
      }
    }

    carregar();
    return () => controller.abort();
  }, [token, tentativa]);

  function tentarNovamente() {
    setErro("");
    setTentativa((atual) => atual + 1);
  }

  return (
    <section className="cardapio" aria-labelledby="cardapio">
      <h2 id="cardapio">Cardápio</h2>
      {erro ? (
        <>
          <p role="alert">{erro}</p>
          <button type="button" onClick={tentarNovamente}>Tentar novamente</button>
        </>
      ) : produtos === null ? (
        <p role="status">Carregando cardápio…</p>
      ) : produtos.length === 0 ? (
        <p role="status">Nenhum produto disponível no momento.</p>
      ) : (
        <ul className="produtos">
          {produtos.map((produto) => (
            <li key={produto.id}>
              <h3>{produto.nome}</h3>
              {produto.descricao && <p>{produto.descricao}</p>}
              <strong>{moeda.format(produto.preco_centavos / 100)}</strong>
              <button
                type="button"
                disabled={enviando}
                onClick={() => alterarQuantidade(produto.id, 1)}
                aria-label={`Adicionar ${produto.nome} ao carrinho`}
              >
                Adicionar
              </button>
            </li>
          ))}
        </ul>
      )}
      {produtos?.length > 0 && (
        <section className="carrinho" aria-labelledby="carrinho">
          <h2 id="carrinho">Carrinho</h2>
          {itens.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul className="itens-carrinho">
                {itens.map((item) => (
                  <li key={item.id}>
                    <span>{item.nome} · {moeda.format(item.preco_centavos * item.quantidade / 100)}</span>
                    <div className="quantidade">
                      <button type="button" disabled={enviando} aria-label={`Diminuir quantidade de ${item.nome}`} onClick={() => alterarQuantidade(item.id, -1)}>−</button>
                      <span aria-live="polite">{item.quantidade}</span>
                      <button type="button" disabled={enviando} aria-label={`Aumentar quantidade de ${item.nome}`} onClick={() => alterarQuantidade(item.id, 1)}>+</button>
                    </div>
                  </li>
                ))}
              </ul>
              <p><strong>Total estimado {moeda.format(total / 100)}</strong></p>
              <button type="button" disabled={enviando} onClick={finalizarPedido}>
                {enviando ? "Enviando…" : "Finalizar pedido"}
              </button>
            </>
          )}
          {erroPedido && <p role="alert">{erroPedido}</p>}
          {pedido && (
            <p role="status">
              Pedido #{pedido.id} registrado. Total de {moeda.format(pedido.valor_total_centavos / 100)}.
            </p>
          )}
        </section>
      )}
    </section>
  );
}
