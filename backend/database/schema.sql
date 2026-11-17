
-- CantinaFácil
-- Criação inicial do banco de dados SQLite

PRAGMA foreign_keys = ON;

-- 1. Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'cliente'
        CHECK (tipo IN ('cliente', 'administrador')),
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco_centavos INTEGER NOT NULL
        CHECK (preco_centavos >= 0),
    disponivel INTEGER NOT NULL DEFAULT 1
        CHECK (disponivel IN (0, 1)),
    ativo INTEGER NOT NULL DEFAULT 1
        CHECK (ativo IN (0, 1)),
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente'
        CHECK (status IN ('pendente', 'concluido', 'cancelado')),
    valor_total_centavos INTEGER NOT NULL
        CHECK (valor_total_centavos >= 0),
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
);

-- 4. Itens dos pedidos
CREATE TABLE IF NOT EXISTS itens_pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL
        CHECK (quantidade > 0),
    preco_unitario_centavos INTEGER NOT NULL
        CHECK (preco_unitario_centavos >= 0),

    FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE RESTRICT,

    UNIQUE (pedido_id, produto_id)
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario
ON pedidos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_itens_pedido
ON itens_pedido(pedido_id);

CREATE INDEX IF NOT EXISTS idx_itens_produto
ON itens_pedido(produto_id);
