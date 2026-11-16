# CantinaFácil — Documentação da API REST

## 1. Visão geral

A API do CantinaFácil será desenvolvida utilizando Node.js e Express, seguindo o padrão REST.

A comunicação entre frontend e backend será realizada por meio de requisições HTTP, utilizando JSON para envio e recebimento de dados.

**URL-base:** `/api`

**Autenticação:** JWT (JSON Web Token).

As rotas protegidas deverão receber o token no cabeçalho:

```http
Authorization: Bearer TOKEN
```

## 2. Autenticação

### POST `/api/auth/register`

Cadastra um novo cliente.

**Dados enviados:**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta:** `201 Created`

```json
{
  "message": "Usuário cadastrado com sucesso."
}
```

O tipo de usuário será definido automaticamente como `cliente`. O cadastro público não poderá criar administradores.

### POST `/api/auth/login`

Realiza a autenticação de um usuário.

**Dados enviados:**

```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta:** `200 OK`

```json
{
  "message": "Login realizado com sucesso.",
  "token": "TOKEN_JWT",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "cliente"
  }
}
```

## 3. Produtos

### GET `/api/products`

Lista os produtos ativos e disponíveis para venda.

**Permissão:** Usuários autenticados.

**Resposta:** `200 OK`

```json
[
  {
    "id": 1,
    "nome": "Salgado",
    "descricao": "Salgado de frango",
    "preco_centavos": 550,
    "disponivel": true
  }
]
```

### GET `/api/products/:id`

Consulta os dados de um produto específico.

**Permissão:** Usuários autenticados.

**Resposta:** `200 OK`

Retorna os dados do produto solicitado.

### POST `/api/products`

Cadastra um novo produto.

**Permissão:** Administrador.

**Dados enviados:**

```json
{
  "nome": "Suco natural",
  "descricao": "Suco de laranja",
  "preco_centavos": 700,
  "disponivel": true
}
```

**Resposta:** `201 Created`

Retorna os dados do produto cadastrado.

### PUT `/api/products/:id`

Atualiza as informações de um produto existente.

**Permissão:** Administrador.

**Dados enviados:**

```json
{
  "nome": "Suco natural",
  "descricao": "Suco de laranja 300ml",
  "preco_centavos": 800,
  "disponivel": true
}
```

**Resposta:** `200 OK`

Retorna os dados atualizados.

### DELETE `/api/products/:id`

Desativa um produto.

**Permissão:** Administrador.

A exclusão será lógica: o produto terá seu campo `ativo` alterado para `0`, preservando o histórico de pedidos.

**Resposta:** `204 No Content`

## 4. Pedidos

### POST `/api/orders`

Registra um novo pedido.

**Permissão:** Cliente.

**Dados enviados:**

```json
{
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2
    },
    {
      "produto_id": 2,
      "quantidade": 1
    }
  ]
}
```

**Resposta:** `201 Created`

```json
{
  "message": "Pedido realizado com sucesso.",
  "pedido": {
    "id": 15,
    "status": "pendente",
    "valor_total_centavos": 1800
  }
}
```

O backend deverá consultar os preços atuais dos produtos e calcular o valor total. O frontend não poderá determinar o preço final do pedido.

### GET `/api/orders`

Lista os pedidos.

**Permissão:** Cliente ou administrador.

- Cliente: recebe somente seus próprios pedidos.
- Administrador: recebe todos os pedidos.

O backend deverá identificar o usuário pelo token JWT, sem confiar em um `usuario_id` enviado pelo cliente.

**Resposta:** `200 OK`

Retorna uma lista de pedidos com seus respectivos valores, datas e status.

### GET `/api/orders/:id`

Consulta os detalhes de um pedido específico.

**Permissão:** Dono do pedido ou administrador.

**Resposta:** `200 OK`

Retorna os dados do pedido e seus itens.

### PATCH `/api/orders/:id/status`

Atualiza o status de um pedido.

**Permissão:** Administrador.

**Dados enviados:**

```json
{
  "status": "concluido"
}
```

Os status permitidos são:

- `pendente`
- `concluido`
- `cancelado`

**Resposta:** `200 OK`

Retorna os dados atualizados do pedido.

## 5. Códigos de resposta HTTP

| Código | Significado | Situação |
|---|---|---|
| 200 | OK | Operação realizada |
| 201 | Created | Registro criado |
| 204 | No Content | Exclusão lógica realizada |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Usuário não autenticado |
| 403 | Forbidden | Sem permissão para a operação |
| 404 | Not Found | Registro não encontrado |
| 409 | Conflict | Conflito, como e-mail já cadastrado |
| 500 | Internal Server Error | Erro interno do servidor |

## 6. Regras de segurança e validação

1. Senhas deverão ser armazenadas utilizando hash com bcrypt.
2. O acesso às rotas protegidas deverá ser validado por JWT.
3. Clientes não poderão acessar funcionalidades administrativas.
4. Clientes somente poderão consultar seus próprios pedidos.
5. O backend deverá validar os dados recebidos antes de realizar operações.
6. Pedidos não poderão ser registrados sem itens.
7. Produtos inativos ou indisponíveis não poderão ser adicionados a novos pedidos.
8. O valor total deverá ser calculado pelo backend.
9. Somente administradores poderão cadastrar, editar ou desativar produtos.
10. Somente administradores poderão atualizar o status dos pedidos.