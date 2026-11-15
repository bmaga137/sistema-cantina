# CantinaFácil — Requisitos do Sistema

## 1. Identificação do projeto

- **Nome:** CantinaFácil
- **Tipo:** Sistema Web
- **Área:** Gerenciamento de cantina universitária
- **Desenvolvimento:** Individual
- **Frontend:** React, HTML, CSS e JavaScript
- **Backend:** Node.js e Express
- **Banco de dados:** SQLite
- **Comunicação:** API REST

## 2. Descrição do sistema

O CantinaFácil é um sistema web destinado ao gerenciamento de uma cantina universitária. A aplicação permitirá que clientes visualizem os produtos disponíveis, realizem pedidos e acompanhem seu andamento.

O sistema também contará com uma área administrativa, na qual usuários autorizados poderão cadastrar, editar e excluir produtos, consultar pedidos e atualizar seus respectivos status.

O objetivo é simplificar o processo de realização e gerenciamento de pedidos, centralizando as operações em uma única plataforma.

## 3. Objetivos

- Facilitar a consulta dos produtos disponíveis na cantina.
- Permitir que clientes realizem pedidos por meio de uma interface web.
- Centralizar o gerenciamento de produtos e pedidos.
- Controlar o acesso às funcionalidades de acordo com o tipo de usuário.
- Armazenar e organizar os dados em um banco de dados.

## 4. Público-alvo

O sistema será destinado a dois tipos de usuários:

- **Clientes:** pessoas que desejam consultar produtos e realizar pedidos na cantina.
- **Administradores:** responsáveis pelo gerenciamento dos produtos e pelo acompanhamento dos pedidos.

## 5. Requisitos funcionais

Os requisitos funcionais representam as funcionalidades que o sistema deverá oferecer.

| Código | Descrição |
|---|---|
| RF01 | O sistema deverá permitir o cadastro de novos usuários. |
| RF02 | O sistema deverá permitir que usuários realizem login e logout. |
| RF03 | O sistema deverá permitir a consulta dos produtos disponíveis. |
| RF04 | O sistema deverá permitir que administradores cadastrem produtos. |
| RF05 | O sistema deverá permitir que administradores editem e excluam produtos. |
| RF06 | O sistema deverá permitir que clientes adicionem produtos ao carrinho e realizem pedidos. |
| RF07 | O sistema deverá permitir que clientes consultem seus pedidos e respectivos detalhes. |
| RF08 | O sistema deverá permitir que administradores consultem todos os pedidos e atualizem seus status. |

## 6. Requisitos não funcionais

Os requisitos não funcionais estabelecem características técnicas e restrições do sistema.

| Código | Descrição |
|---|---|
| RNF01 | O sistema deverá possuir interface web responsiva e intuitiva. |
| RNF02 | As senhas deverão ser armazenadas utilizando algoritmo de hash seguro. |
| RNF03 | O acesso às funcionalidades administrativas deverá ser protegido por mecanismos de autenticação e autorização. |
| RNF04 | A comunicação entre frontend e backend deverá ocorrer por meio de uma API REST. |
| RNF05 | Os dados deverão ser persistidos em banco de dados SQLite. |
| RNF06 | Os serviços do backend deverão possuir testes automatizados. |

## 7. Controle de acesso

O sistema possuirá dois níveis de acesso:

### 7.1. Cliente

Poderá:
- Criar uma conta.
- Realizar login e logout.
- Consultar produtos disponíveis.
- Adicionar produtos ao carrinho.
- Realizar pedidos.
- Consultar seus próprios pedidos.

### 7.2. Administrador

Poderá:
- Realizar login e logout.
- Consultar produtos.
- Cadastrar produtos.
- Editar produtos.
- Excluir produtos.
- Consultar todos os pedidos.
- Visualizar detalhes dos pedidos.
- Atualizar o status dos pedidos.

O cadastro público permitirá apenas a criação de contas de clientes. Contas administrativas serão criadas ou configuradas separadamente.

## 8. Regras de negócio

- **RN01:** Um usuário deverá estar autenticado para acessar as funcionalidades restritas do sistema.
- **RN02:** Clientes não poderão acessar funcionalidades administrativas.
- **RN03:** Clientes somente poderão consultar seus próprios pedidos.
- **RN04:** Não será permitido finalizar pedidos sem produtos.
- **RN05:** Produtos indisponíveis não poderão ser adicionados a novos pedidos.
- **RN06:** O valor total do pedido deverá ser calculado e validado pelo backend.
- **RN07:** Apenas administradores poderão cadastrar, editar ou excluir produtos.
- **RN08:** Apenas administradores poderão atualizar o status dos pedidos.

## 9. Status dos pedidos

O sistema trabalhará inicialmente com três status:

- **Pendente:** pedido realizado e aguardando atendimento.
- **Concluído:** pedido finalizado.
- **Cancelado:** pedido cancelado.

## 10. Transações do sistema

Para atender ao requisito mínimo de seis transações individuais, serão implementadas as seguintes operações:

1. Cadastro de usuário.
2. Autenticação de usuário.
3. Cadastro de produto.
4. Edição de produto.
5. Exclusão de produto.
6. Realização de pedido.
7. Consulta de pedidos.
8. Atualização do status de pedido.

## 11. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| HTML | Estrutura das páginas. |
| CSS | Estilização das interfaces. |
| JavaScript | Linguagem principal do projeto. |
| React | Desenvolvimento do frontend. |
| Node.js | Ambiente de execução do backend. |
| Express | Construção dos serviços e rotas da API. |
| SQLite | Persistência dos dados. |
| Git e GitHub | Controle de versão e armazenamento do código. |
| Jest e Supertest | Testes automatizados dos serviços. |

## 12. Considerações finais

O CantinaFácil será desenvolvido com foco na simplicidade, organização e funcionalidade. A aplicação deverá atender aos requisitos definidos, oferecendo operações de gerenciamento de produtos e pedidos, controle de acesso e persistência dos dados.