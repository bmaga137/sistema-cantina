import React, { useEffect, useState } from "react";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const statusPedido = { pendente: "Pendente", concluido: "Concluído", cancelado: "Cancelado" };

function useConsultaPedidos(url, token, versao = 0) {
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function consultar() {
      setResultado(null);
      setErro("");

      try {
        const resposta = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });

        if (resposta.status === 401) {
          setErro("Sua sessão expirou. Saia e entre novamente.");
          return;
        }

        if (!resposta.ok) throw new Error("Falha na consulta.");
        const dados = await resposta.json();
        if (!controller.signal.aborted) setResultado(dados);
      } catch {
        if (!controller.signal.aborted) setErro("Não foi possível consultar os pedidos.");
      }
    }

    consultar();
    return () => controller.abort();
  }, [url, token, versao]);

  return { resultado, erro, setResultado };
}

function ItensDoPedido({ id, token }) {
  const { resultado, erro } = useConsultaPedidos(`/api/orders/${id}`, token);

  if (erro) return <p role="alert">{erro}</p>;
  if (!resultado) return <p role="status">Carregando itens…</p>;

  return (
    <ul>
      {resultado.itens.map((item) => (
        <li key={item.produto_id}>
          {item.quantidade} × {item.nome} · {moeda.format(item.preco_unitario_centavos / 100)} por unidade
        </li>
      ))}
    </ul>
  );
}

export default function MeusPedidos({ token, administrador = false }) {
  const [versao, setVersao] = useState(0);
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [salvando, setSalvando] = useState(null);
  const [retorno, setRetorno] = useState(null);
  const { resultado: pedidos, erro, setResultado: setPedidos } = useConsultaPedidos("/api/orders", token, versao);

  function atualizar() {
    setPedidoAberto(null);
    setRetorno(null);
    setVersao((atual) => atual + 1);
  }

  async function salvarStatus(event, pedido) {
    event.preventDefault();
    if (salvando !== null) return;

    const status = new FormData(event.currentTarget).get("status");
    if (status === pedido.status) return;

    setSalvando(pedido.id);
    setRetorno(null);

    try {
      const resposta = await fetch(`/api/orders/${pedido.id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => null);
        const mensagem = resposta.status === 401
          ? "Sua sessão expirou. Saia e entre novamente."
          : dados?.error ?? "Não foi possível salvar o status.";
        throw new Error(mensagem);
      }

      const atualizado = await resposta.json();
      setPedidos((atuais) => atuais.map((item) => item.id === pedido.id ? atualizado : item));
      setRetorno({ id: pedido.id, mensagem: "Status atualizado." });
    } catch (error) {
      setRetorno({ id: pedido.id, mensagem: error instanceof TypeError
        ? "Não foi possível conectar ao servidor."
        : error.message, falha: true });
    } finally {
      setSalvando(null);
    }
  }

  return (
    <section className="historico" aria-labelledby="titulo-pedidos">
      <h2 id="titulo-pedidos">{administrador ? "Pedidos da cantina" : "Meus pedidos"}</h2>
      <button type="button" disabled={salvando !== null || (!pedidos && !erro)} onClick={atualizar}>Atualizar pedidos</button>
      {erro && <p role="alert">{erro}</p>}
      {!erro && !pedidos && <p role="status">Carregando pedidos…</p>}
      {pedidos?.length === 0 && (
        <p>{administrador ? "Nenhum pedido registrado." : "Você ainda não fez pedidos."}</p>
      )}
      {pedidos?.length > 0 && (
        <ul className="lista-pedidos">
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <strong>Pedido #{pedido.id}</strong>
              <p>{statusPedido[pedido.status] ?? pedido.status} · {moeda.format(pedido.valor_total_centavos / 100)}</p>
              <button
                type="button"
                aria-expanded={pedidoAberto === pedido.id}
                onClick={() => setPedidoAberto(pedidoAberto === pedido.id ? null : pedido.id)}
              >
                {pedidoAberto === pedido.id ? "Ocultar itens" : "Ver itens"} do pedido #{pedido.id}
              </button>
              {pedidoAberto === pedido.id && <ItensDoPedido id={pedido.id} token={token} />}
              {administrador && (
                <form className="status-pedido" onSubmit={(event) => salvarStatus(event, pedido)}>
                  <label>
                    Status do pedido #{pedido.id}
                    <select name="status" key={pedido.status} defaultValue={pedido.status} disabled={salvando !== null}>
                      {Object.entries(statusPedido).map(([valor, rotulo]) => (
                        <option key={valor} value={valor}>{rotulo}</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" disabled={salvando !== null}>
                    {salvando === pedido.id ? "Salvando…" : "Salvar status"}
                  </button>
                  {retorno?.id === pedido.id && (
                    <p role={retorno.falha ? "alert" : "status"}>{retorno.mensagem}</p>
                  )}
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
