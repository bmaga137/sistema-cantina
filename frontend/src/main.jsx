import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Cardapio from "./Cardapio.jsx";
import MeusPedidos from "./MeusPedidos.jsx";
import GerenciarProdutos from "./GerenciarProdutos.jsx";
import "./styles.css";

function App() {
  const [sessao, setSessao] = useState(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [versaoPedidos, setVersaoPedidos] = useState(0);
  const [cadastro, setCadastro] = useState(false);
  const [emailCadastrado, setEmailCadastrado] = useState("");
  const [aviso, setAviso] = useState("");

  function alternarCadastro() {
    setCadastro(!cadastro);
    setErro("");
    setAviso("");
    setEmailCadastrado("");
  }

  async function autenticar(event) {
    event.preventDefault();
    if (enviando) return;

    const dados = new FormData(event.currentTarget);
    const email = dados.get("email").trim();
    const senha = dados.get("senha");
    const nome = cadastro ? dados.get("nome").trim() : "";
    setErro("");
    setAviso("");

    if (cadastro && !nome) {
      setErro("Informe seu nome.");
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch(cadastro ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cadastro ? { nome, email, senha } : { email, senha })
      });
      const resultado = await resposta.json().catch(() => null);

      if (cadastro) {
        if (resposta.status !== 201 || !resultado?.usuario) {
          setErro(resultado?.error ?? "Não foi possível criar a conta. Tente novamente.");
          return;
        }

        setEmailCadastrado(resultado.usuario.email);
        setCadastro(false);
        setAviso("Conta criada. Entre com sua senha.");
        return;
      }

      if (!resposta.ok || !resultado?.token || !resultado.usuario) {
        setErro(resultado?.error ?? "O login está indisponível. Tente novamente.");
        return;
      }

      setSessao({ token: resultado.token, usuario: resultado.usuario });
      setEmailCadastrado("");
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  const mostrarCardapio = sessao?.usuario.tipo === "cliente";
  const administrador = sessao?.usuario.tipo === "administrador";

  return (
    <main className={mostrarCardapio || administrador ? "painel painel-cardapio" : "painel"}>
      <header><h1>CantinaFácil</h1></header>
      {sessao ? (
        <>
          <section className="sessao" aria-labelledby="sessao">
            <h2 id="sessao">Olá, {sessao.usuario.nome}!</h2>
            {administrador && <p>Administrador</p>}
            <button type="button" onClick={() => setSessao(null)}>Sair</button>
          </section>
          {mostrarCardapio && (
            <>
              <Cardapio
                token={sessao.token}
                aoRegistrarPedido={() => setVersaoPedidos((atual) => atual + 1)}
              />
              <MeusPedidos key={versaoPedidos} token={sessao.token} />
            </>
          )}
          {administrador && (
            <>
              <MeusPedidos token={sessao.token} administrador />
              <GerenciarProdutos token={sessao.token} />
            </>
          )}
        </>
      ) : (
        <form key={cadastro ? "cadastro" : "login"} onSubmit={autenticar}>
          <h2>{cadastro ? "Criar conta" : "Entre na sua conta"}</h2>
          {cadastro && (
            <label>
              Nome
              <input type="text" name="nome" autoComplete="name" required />
            </label>
          )}
          <label>
            E-mail
            <input type="email" name="email" autoComplete="username" defaultValue={emailCadastrado} required />
          </label>
          <label>
            Senha
            <input type="password" name="senha" autoComplete={cadastro ? "new-password" : "current-password"} required />
          </label>
          {erro && <p role="alert">{erro}</p>}
          {aviso && <p role="status">{aviso}</p>}
          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando…" : cadastro ? "Criar conta" : "Entrar"}
          </button>
          <button className="alternar-auth" type="button" disabled={enviando} onClick={alternarCadastro}>
            {cadastro ? "Voltar ao login" : "Criar conta"}
          </button>
        </form>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
