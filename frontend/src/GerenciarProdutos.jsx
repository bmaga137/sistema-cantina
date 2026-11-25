import React, { useEffect, useState } from "react";

const url = "/api/produtos";
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

async function consultar(url, token, { method = "GET", dados, signal } = {}) {
  const headers = { Authorization: `Bearer ${token}` };
  if (dados) headers["Content-Type"] = "application/json";

  const resposta = await fetch(url, { method, headers, body: JSON.stringify(dados), signal });
  const resultado = await resposta.json().catch(() => null);

  if (resposta.status === 401) throw new Error("Sua sessão expirou. Saia e entre novamente.");
  if (!resposta.ok) throw new Error(resultado?.error ?? "Não foi possível acessar os produtos.");

  return resultado;
}

export default function GerenciarProdutos({ token }) {
  const [produtos, setProdutos] = useState(null);
  const [editando, setEditando] = useState(null);
  const [versao, setVersao] = useState(0);
  const [formulario, setFormulario] = useState(0);
  const [ocupado, setOcupado] = useState(false);
  const [erroLista, setErroLista] = useState("");
  const [retorno, setRetorno] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        const lista = await consultar(`${url}/admin`, token, { signal: controller.signal });
        if (!Array.isArray(lista)) throw new Error("Não foi possível carregar os produtos.");
        if (!controller.signal.aborted) setProdutos(lista);
      } catch (error) {
        if (!controller.signal.aborted) setErroLista(error.message);
      }
    }

    carregar();
    return () => controller.abort();
  }, [token, versao]);

  function abrirFormulario(produto) {
    setEditando(produto);
    setRetorno(null);
    setFormulario((atual) => atual + 1);
  }

  async function salvar(event) {
    event.preventDefault();
    const campos = new FormData(event.currentTarget);
    const nome = campos.get("nome").trim();
    const preco = campos.get("preco").trim();
    const partes = /^(\d+)(?:[,.](\d{1,2}))?$/.exec(preco);
    const centavos = partes ? Number(partes[1] + (partes[2] ?? "").padEnd(2, "0")) : NaN;

    if (!nome || !Number.isSafeInteger(centavos)) {
      setRetorno({ erro: true, texto: "Informe um nome e um preço válido, como 5,50." });
      return;
    }

    const dados = {
      nome,
      descricao: campos.get("descricao").trim(),
      preco_centavos: centavos,
      disponivel: campos.has("disponivel") ? 1 : 0
    };
    await alterar(editando ? `${url}/${editando.id}` : url, editando ? "PUT" : "POST", dados);
  }

  async function alterar(destino, method, dados) {
    if (ocupado) return;
    setOcupado(true);
    setRetorno(null);

    try {
      const resultado = await consultar(destino, token, { method, dados });
      abrirFormulario(null);
      setProdutos(null);
      setErroLista("");
      setVersao((atual) => atual + 1);
      setRetorno({ texto: resultado?.message ?? "Alteração salva." });
    } catch (error) {
      setRetorno({ erro: true, texto: error.message });
    } finally {
      setOcupado(false);
    }
  }

  function desativar(produto) {
    if (window.confirm(`Desativar ${produto.nome}? O produto sairá do cardápio.`)) {
      alterar(`${url}/${produto.id}`, "DELETE");
    }
  }

  return (
    <section className="historico" aria-labelledby="gerenciar-produtos">
      <h2 id="gerenciar-produtos">Gerenciar cardápio</h2>
      <form key={formulario} className="form-produto" onSubmit={salvar}>
        <h3>{editando ? `Editar ${editando.nome}` : "Cadastrar produto"}</h3>
        <label>Nome<input name="nome" defaultValue={editando?.nome} required /></label>
        <label>Descrição<input name="descricao" defaultValue={editando?.descricao ?? ""} /></label>
        <label>
          Preço em reais
          <input name="preco" inputMode="decimal" defaultValue={editando ? (editando.preco_centavos / 100).toFixed(2).replace(".", ",") : ""} placeholder="5,50" required />
        </label>
        <label className="produto-disponivel">
          <input type="checkbox" name="disponivel" defaultChecked={editando ? Boolean(editando.disponivel) : true} />
          Disponível no cardápio
        </label>
        <div className="acoes-produto">
          <button type="submit" disabled={ocupado}>{ocupado ? "Aguarde…" : editando ? "Salvar produto" : "Cadastrar produto"}</button>
          {editando && <button type="button" disabled={ocupado} onClick={() => abrirFormulario(null)}>Cancelar edição</button>}
        </div>
      </form>
      {retorno && <p role={retorno.erro ? "alert" : "status"}>{retorno.texto}</p>}
      {erroLista && (
        <>
          <p role="alert">{erroLista}</p>
          <button type="button" onClick={() => { setErroLista(""); setVersao((atual) => atual + 1); }}>
            Tentar carregar novamente
          </button>
        </>
      )}
      {!produtos && !erroLista && <p role="status">Carregando produtos…</p>}
      {produtos?.length === 0 && <p>Nenhum produto ativo.</p>}
      {produtos?.length > 0 && (
        <ul className="lista-pedidos">
          {produtos.map((produto) => (
            <li key={produto.id}>
              <strong>{produto.nome}</strong>
              <p>{moeda.format(produto.preco_centavos / 100)} · {produto.disponivel ? "Disponível" : "Indisponível"}</p>
              <div className="acoes-produto">
                <button type="button" disabled={ocupado} onClick={() => abrirFormulario(produto)}>Editar {produto.nome}</button>
                <button type="button" disabled={ocupado} onClick={() => desativar(produto)}>Desativar {produto.nome}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
