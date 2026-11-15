# CantinaFácil — Layout das Telas e Lista de Eventos

## 1. Introdução

Este documento apresenta a estrutura das interfaces do sistema CantinaFácil e descreve os eventos que deverão ser executados em cada tela.

A aplicação contará com duas áreas principais: uma destinada aos clientes e outra destinada aos administradores.

A interface seguirá um padrão visual acadêmico e simples, priorizando facilidade de utilização, organização e clareza das informações.

## 2. Identidade visual

A interface utilizará uma identidade visual simples e consistente.

### 2.1. Paleta de cores

| Cor | Código | Aplicação |
|---|---|---|
| Azul | #2563EB | Botões principais e elementos de destaque. |
| Branco | #FFFFFF | Fundo de cartões e áreas de conteúdo. |
| Cinza claro | #F3F4F6 | Fundo das páginas. |
| Grafite | #1F2937 | Textos e títulos. |

### 2.2. Características da interface

- Layout simples e intuitivo.
- Menu de navegação organizado.
- Formulários objetivos.
- Botões com identificação clara.
- Tabelas para apresentação de informações administrativas.
- Interface adaptável a computadores e dispositivos móveis.

## 3. Descrição das telas

### 3.1. Tela de Login

**Objetivo:** permitir que usuários cadastrados acessem o sistema.

**Elementos da interface:**
- Identificação visual do CantinaFácil.
- Campo de e-mail.
- Campo de senha.
- Botão Entrar.
- Link Criar conta.

**Lista de eventos:**

| Evento | Comportamento esperado |
|---|---|
| Digitar e-mail | Atualizar o campo de e-mail. |
| Digitar senha | Atualizar o campo de senha. |
| Clicar em Entrar | Enviar as credenciais para autenticação. |
| Login bem-sucedido | Redirecionar o usuário conforme seu tipo de acesso. |
| Login inválido | Exibir mensagem informando que as credenciais são inválidas. |
| Clicar em Criar conta | Redirecionar para a tela de cadastro. |

### 3.2. Tela de Cadastro de Usuário

**Objetivo:** permitir que novos clientes criem uma conta no sistema.

**Elementos da interface:**
- Campo de nome completo.
- Campo de e-mail.
- Campo de senha.
- Campo de confirmação de senha.
- Botão Cadastrar.
- Link Voltar ao login.

**Lista de eventos:**

| Evento | Comportamento esperado |
|---|---|
| Preencher formulário | Armazenar temporariamente os dados informados. |
| Clicar em Cadastrar | Enviar os dados ao backend para criação da conta. |
| Informar dados inválidos | Exibir mensagens de validação. |
| Utilizar e-mail já cadastrado | Informar que o e-mail já está em uso. |
| Cadastro bem-sucedido | Exibir confirmação e retornar à tela de login. |
| Clicar em Voltar ao login | Redirecionar para a tela de login. |

### 3.3. Tela de Catálogo de Produtos

**Objetivo:** permitir que clientes visualizem os produtos disponíveis na cantina.

**Elementos da interface:**
- Cabeçalho com identificação do sistema.
- Identificação do usuário autenticado.
- Listagem de produtos.
- Nome, descrição e preço dos produtos.
- Botão Adicionar ao carrinho.
- Botão Carrinho.
- Botão Meus pedidos.
- Botão Sair.

**Lista de eventos:**

| Evento | Comportamento esperado |
|---|---|
| Abrir catálogo | Carregar os produtos disponíveis. |
| Clicar em Adicionar ao carrinho | Adicionar o produto ao carrinho. |
| Adicionar produto já existente no carrinho | Incrementar sua quantidade. |
| Clicar em Carrinho | Redirecionar para a tela do carrinho. |
| Clicar em Meus pedidos | Redirecionar para o histórico de pedidos. |
| Clicar em Sair | Encerrar a sessão e retornar ao login. |

### 3.4. Tela de Carrinho e Finalização de Pedido

**Objetivo:** permitir que clientes revisem os produtos selecionados e confirmem seus pedidos.

**Elementos da interface:**
- Listagem dos produtos selecionados.
- Quantidade de cada produto.
- Preço unitário.
- Subtotal dos itens.
- Valor total do pedido.
- Botões para aumentar e diminuir quantidades.
- Botão Remover.
- Botão Finalizar pedido.

**Lista de eventos:**

| Evento | Comportamento esperado |
|---|---|
| Clicar em aumentar quantidade | Incrementar a quantidade do produto. |
| Clicar em diminuir quantidade | Reduzir a quantidade do produto. |
| Clicar em Remover | Excluir o produto do carrinho. |
| Alterar quantidade | Atualizar os subtotais e o valor total apresentado. |
| Clicar em Finalizar pedido | Enviar os produtos selecionados ao backend para validação e criação do pedido. |
| Pedido confirmado | Exibir confirmação e limpar o carrinho. |
| Tentar finalizar carrinho vazio | Impedir a operação e informar que não existem produtos selecionados. |

### 3.5. Tela de Meus Pedidos

**Objetivo:** permitir que clientes consultem seus pedidos realizados.

**Elementos da interface:**
- Listagem dos pedidos do cliente.
- Número de identificação do pedido.
- Data da realização.
- Valor total.
- Status atual.
- Opção para visualizar detalhes.

**Lista de eventos:**

| Evento | Comportamento esperado |
|---|---|
| Abrir histórico | Buscar os pedidos pertencentes ao usuário autenticado. |
| Clicar em um pedido | Exibir os detalhes do pedido. |
| Atualizar a página | Buscar novamente os pedidos. |
| Não possuir pedidos | Exibir mensagem informando que não existem pedidos registrados. |

### 3.6. Tela de Painel Administrativo

**Objetivo:** centralizar as funcionalidades de gerenciamento da cantina.

**Elementos da interface:**
- Cabeçalho com identificação do sistema.
- Menu lateral de navegação.
- Resumo da quantidade de produtos cadastrados.
- Resumo da quantidade de pedidos.
- Acesso ao gerenciamento de produtos.
- Acesso ao gerenciamento de pedidos.
- Botão Sair.

**Lista de eventos:**

| Evento | Comportamento esperado |
|---|---|
| Abrir painel | Carregar as informações gerais do sistema. |
| Clicar em Produtos | Redirecionar para o gerenciamento de produtos. |
| Clicar em Pedidos | Redirecionar para o gerenciamento de pedidos. |
| Clicar em Sair | Encerrar a sessão e retornar ao login. |

### 3.7. Tela de Gerenciamento de Produtos

**Objetivo:** permitir que administradores gerenciem os produtos cadastrados.

**Elementos da interface:**
- Tabela de produtos.
- Nome do produto.
- Descrição.
- Preço.
- Disponibilidade.
- Botão Novo produto.
- Botões Editar e Excluir.

**Lista de eventos:**

| Evento | Comportamento esperado |
|---|---|
| Abrir gerenciamento | Carregar os produtos cadastrados. |
| Clicar em Novo produto | Abrir formulário de cadastro. |
| Clicar em Salvar | Enviar os dados do novo produto ao backend. |
| Clicar em Editar | Carregar as informações do produto selecionado. |
| Confirmar edição | Enviar as alterações ao backend. |
| Clicar em Excluir | Solicitar confirmação da exclusão. |
| Confirmar exclusão | Solicitar ao backend a exclusão do produto. |

### 3.8. Tela de Gerenciamento de Pedidos

**Objetivo:** permitir que administradores consultem e atualizem os pedidos realizados pelos clientes.

**Elementos da interface:**
- Tabela de pedidos.
- Número de identificação.
- Nome do cliente.
- Data da realização.
- Valor total.
- Status atual.
- Opção para visualizar detalhes.
- Controle para alteração do status.

**Lista de eventos:**

| Evento | Comportamento esperado |
|---|---|
| Abrir gerenciamento | Carregar todos os pedidos registrados. |
| Clicar em Visualizar detalhes | Exibir os produtos e quantidades do pedido. |
| Selecionar novo status | Permitir selecionar o status desejado. |
| Confirmar alteração | Enviar a atualização ao backend. |
| Atualização bem-sucedida | Exibir mensagem de confirmação e atualizar a listagem. |

## 4. Navegação entre as telas

O fluxo de navegação será organizado da seguinte maneira:

### 4.1. Fluxo do cliente

1. O cliente acessa a tela de login.
2. Caso não possua uma conta, poderá acessar o cadastro.
3. Após autenticar-se, será direcionado ao catálogo.
4. Poderá selecionar produtos e adicioná-los ao carrinho.
5. Poderá revisar os produtos selecionados e finalizar o pedido.
6. Poderá acessar a tela Meus Pedidos para consultar suas compras.
7. Poderá encerrar a sessão por meio da opção Sair.

### 4.2. Fluxo do administrador

1. O administrador acessa a tela de login.
2. Após autenticar-se, será direcionado ao painel administrativo.
3. Poderá acessar o gerenciamento de produtos.
4. Poderá cadastrar, editar e excluir produtos.
5. Poderá acessar o gerenciamento de pedidos.
6. Poderá consultar detalhes e atualizar o status dos pedidos.
7. Poderá encerrar a sessão por meio da opção Sair.

## 5. Observações de implementação

- As telas deverão respeitar os níveis de autorização definidos para cada tipo de usuário.
- Os dados apresentados deverão ser obtidos por meio da API do backend.
- As operações de cadastro, edição, exclusão e atualização deverão apresentar feedback ao usuário.
- Os formulários deverão possuir validação dos dados.
- As operações que modificam informações persistidas deverão ser executadas pelo backend.
- A interface deverá apresentar mensagens adequadas para situações de erro, carregamento e ausência de dados.

## 6. Considerações finais

As telas e os eventos descritos neste documento representam a estrutura inicial da interface do CantinaFácil. A implementação deverá seguir essas especificações, mantendo a consistência visual e o comportamento esperado das funcionalidades.