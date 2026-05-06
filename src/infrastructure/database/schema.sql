-- Configuração base para o Tenant e White Label
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country_code VARCHAR(2) NOT NULL, 
    base_currency VARCHAR(3) NOT NULL,
    theme_config JSONB 
);

-- Tabela de Itens (Produtos e Serviços)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    type VARCHAR(20) NOT NULL, 
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON items
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Ficha Técnica (BOM) para Serviços
CREATE TABLE service_bom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    service_id UUID NOT NULL REFERENCES items(id),
    ingredient_id UUID NOT NULL REFERENCES items(id),
    quantity_required DECIMAL(10, 4) NOT NULL
);
ALTER TABLE service_bom ENABLE ROW LEVEL SECURITY;

-- Inteligência de Negócio: Materialized View para Heatmap de Vendas
CREATE MATERIALIZED VIEW mv_sales_heatmap AS
SELECT 
    tenant_id,
    EXTRACT(DOW FROM created_at) AS day_of_week,
    EXTRACT(HOUR FROM created_at) AS hour_of_day,
    COUNT(id) AS total_orders,
    SUM(total_amount) AS total_sales
FROM sales
GROUP BY tenant_id, day_of_week, hour_of_day;

CREATE UNIQUE INDEX idx_mv_sales_heatmap ON mv_sales_heatmap(tenant_id, day_of_week, hour_of_day);

-- Multi-currency: Log de Taxas de Câmbio
CREATE TABLE exchange_rates_log (
    id SERIAL PRIMARY KEY,
    currency_from VARCHAR(3) NOT NULL,
    currency_to VARCHAR(3) NOT NULL,
    rate DECIMAL(10, 6) NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Categorias de Produtos
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Fornecedores
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    document_number VARCHAR(50),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Clientes
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    document_number VARCHAR(50),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Usuários e Grupos de Permissões
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(50) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]'
);
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    role_id UUID REFERENCES roles(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Comandas
CREATE TABLE commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    command_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open', -- open, closed, cancelled
    opened_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP
);
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;

-- Vendas
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    customer_id UUID REFERENCES customers(id),
    user_id UUID REFERENCES users(id),
    command_id UUID REFERENCES commands(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Itens da Venda
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id),
    item_id UUID NOT NULL REFERENCES items(id),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);

-- Formas de Pagamento e Pagamentos
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- cash, credit_card, debit_card, pix
    fee_percentage DECIMAL(5, 2) DEFAULT 0,
    days_to_receive INT DEFAULT 0,
    active BOOLEAN DEFAULT true
);
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    sale_id UUID NOT NULL REFERENCES sales(id),
    payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, completed, failed
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Fluxo de Caixa / Contas a Pagar e Receber
CREATE TABLE cash_flow (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    type VARCHAR(20) NOT NULL, -- payable (pagar), receivable (receber)
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, overdue
    payment_id UUID REFERENCES payments(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE cash_flow ENABLE ROW LEVEL SECURITY;

