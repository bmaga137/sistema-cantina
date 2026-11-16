# CantinaFácil — Modelagem do Banco de Dados

## 1. Introdução

Este documento apresenta a modelagem inicial do banco de dados do sistema CantinaFácil, desenvolvido para gerenciar usuários, produtos e pedidos de uma cantina universitária.

O banco de dados utilizará SQLite e será composto por quatro tabelas principais: usuarios, produtos, pedidos e itens_pedido.

## 2. Estrutura das tabelas

### 2.1. Tabela usuarios

Armazena as informações dos usuários cadastrados.

| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER | Identificador único do usuário. |
| nome | TEXT | Nome completo. |
| email | TEXT | E-mail de acesso. |
| senha_hash | TEXT | Hash da senha. |
| tipo | TEXT | Tipo de usuário: cliente ou administrador. |
| criado_em | TEXT | Data de criação da conta. |

### 2.2. Tabela produtos

Armazena os produtos comercializados pela cantina.

| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER | Identificador único do produto. |
| nome | TEXT | Nome do produto. |
| descricao | TEXT | Descrição do produto. |
| preco_centavos | INTEGER | Preço armazenado em centavos. |
| disponivel | INTEGER | Indica se o produto pode ser vendido. |
| ativo | INTEGER | Indica se o produto permanece ativo no catálogo. |
| criado_em | TEXT | Data de cadastro. |

### 2.3. Tabela pedidos

Armazena os pedidos realizados pelos clientes.

| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER | Identificador único do pedido. |
| usuario_id | INTEGER | Referência ao usuário responsável. |
| status | TEXT | Situação atual do pedido. |
| valor_total_centavos | INTEGER | Valor total armazenado em centavos. |
| criado_em | TEXT | Data de realização do pedido. |

### 2.4. Tabela itens_pedido

Armazena os produtos e suas respectivas quantidades em cada pedido.

| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER | Identificador único do item. |
| pedido_id | INTEGER | Referência ao pedido. |
| produto_id | INTEGER | Referência ao produto. |
| quantidade | INTEGER | Quantidade adquirida. |
| preco_unitario_centavos | INTEGER | Preço unitário registrado no momento da compra. |

## 3. Relacionamentos

- Um usuário poderá realizar vários pedidos (1:N).
- Um pedido poderá possuir vários itens (1:N).
- Um produto poderá aparecer em vários itens de pedidos (1:N).
- A tabela itens_pedido estabelece a relação entre pedidos e produtos.

## 4. Restrições de integridade

- O identificador de cada tabela será sua chave primária.
- Os campos de referência utilizarão chaves estrangeiras.
- O e-mail dos usuários deverá ser único.
- A quantidade de cada item deverá ser maior que zero.
- Os valores monetários deverão ser iguais ou superiores a zero.
- O tipo de usuário deverá ser cliente ou administrador.
- O status do pedido deverá ser pendente, concluído ou cancelado.
- A exclusão de produtos será lógica, preservando o histórico dos pedidos.

## 5. Considerações sobre valores monetários

Os valores monetários serão armazenados em centavos utilizando o tipo INTEGER.

Exemplo:
- R$ 5,00 = 500.
- R$ 5,50 = 550.
- R$ 12,90 = 1290.

Essa abordagem evita problemas de precisão em operações matemáticas com valores decimais.

## 6. Considerações finais

A estrutura proposta busca garantir organização, integridade e consistência dos dados. A modelagem permitirá implementar as operações de cadastro de usuários, gerenciamento de produtos, realização de pedidos e consulta ao histórico de compras.