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
