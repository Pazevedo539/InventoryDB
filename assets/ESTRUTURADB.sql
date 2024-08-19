CREATE DATABASE inventorydb;
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku INTEGER UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_name VARCHAR(255),
    status VARCHAR(50),
    word_keys TEXT,
    price NUMERIC(10, 2),
    promotional_price NUMERIC(10, 2),
    pricesite NUMERIC(10, 2),
    cost NUMERIC(10, 2),
    shippingTime INTEGER,
    weight NUMERIC(10, 2),
    width NUMERIC(10, 2),
    height NUMERIC(10, 2),
    length NUMERIC(10, 2),
    brand VARCHAR(255),
    url_youtube VARCHAR(255),
    google_description TEXT,
    manufacturing VARCHAR(255),
    nbm VARCHAR(50),
    model VARCHAR(255),
    gender VARCHAR(50),
    volumes INTEGER,
    warranty_time INTEGER,
    category VARCHAR(255),
    subcategory VARCHAR(255),
    endcategory VARCHAR(255)
);

CREATE TABLE product_attributes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    attribute_key VARCHAR(255),
    attribute_value TEXT
);

CREATE TABLE variations (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    ref VARCHAR(255),
    sku INTEGER,
    qty VARCHAR(50),
    ean VARCHAR(50)
);

CREATE TABLE variation_images (
    id SERIAL PRIMARY KEY,
    variation_id INTEGER REFERENCES variations(id) ON DELETE CASCADE,
    image_url VARCHAR(255)
);

CREATE TABLE specifications (
    id SERIAL PRIMARY KEY,
    variation_id INTEGER REFERENCES variations(id) ON DELETE CASCADE,
    specification_key VARCHAR(255),
    specification_value TEXT
);

CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    stores INTEGER,
    availableStock INTEGER,
    realStock INTEGER
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    numeroPedido INTEGER,
    idPedidoParceiro VARCHAR(255),
    valorFrete NUMERIC(10, 2),
    prazoEntrega INTEGER,
    valorTotalCompra NUMERIC(10, 2),
    formaPagamento VARCHAR(255),
    status VARCHAR(20)
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    pedidos_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    cpfCnpj VARCHAR(20),
    nomeRazao VARCHAR(255),
    fantasia VARCHAR(255),
    sexo CHAR(1),
    dataNascimento DATE DEFAULT NULL,
    email VARCHAR(255)
);

CREATE TABLE dados_entrega (
    id SERIAL PRIMARY KEY,
    clientes_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    cep VARCHAR(10),
    endereco VARCHAR(255),
    numero VARCHAR(50),
    bairro VARCHAR(255),
    complemento VARCHAR(255),
    cidade VARCHAR(255),
    uf CHAR(10),
    responsavelRecebimento VARCHAR(255)
);

CREATE TABLE telefones_cliente (
    id SERIAL PRIMARY KEY,
    clientes_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    residencial VARCHAR(20),
    comercial VARCHAR(20),
    celular VARCHAR(20)
);

CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    pedidos_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    valor NUMERIC(10, 2),
    quantidadeParcelas INTEGER,
    meioPagamento VARCHAR(255),
    autorizacao VARCHAR(255),
    nsu VARCHAR(255)
);

CREATE TABLE sefaz_info (
    id SERIAL PRIMARY KEY,
    pagamentos_id INTEGER REFERENCES pagamentos(id) ON DELETE CASCADE,
    idOperacao VARCHAR(1),
    idFormaPagamento VARCHAR(1),
    idMeioPagamento VARCHAR(2),
    cnpjInstituicaoPagamento VARCHAR(18),
    idBandeira VARCHAR(2),
    autorizacao VARCHAR(255),
    cnpjIntermediadorTransacao VARCHAR(20),
    intermediadorIdentificador VARCHAR(255),
    idPedidoParceiro VARCHAR(255)
);

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedidos_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    sku INTEGER,
    valorUnitario NUMERIC(10, 2),
    quantidade INTEGER
);