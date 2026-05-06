export interface Tenant {
    id: string;
    name: string;
    country_code: string;
    base_currency: string;
    theme_config?: Record<string, any>;
}

export interface Item {
    id: string;
    tenant_id: string;
    type: 'product' | 'service';
    name: string;
    price: number;
    stock_quantity: number;
    created_at: Date;
    updated_at: Date;
}

export interface Category {
    id: string;
    tenant_id: string;
    name: string;
    description?: string;
    created_at: Date;
}

export interface Supplier {
    id: string;
    tenant_id: string;
    name: string;
    document_number?: string;
    contact_email?: string;
    contact_phone?: string;
    created_at: Date;
}

export interface Customer {
    id: string;
    tenant_id: string;
    name: string;
    document_number?: string;
    contact_email?: string;
    contact_phone?: string;
    loyalty_points: number;
    created_at: Date;
}

export interface Role {
    id: string;
    tenant_id: string;
    name: string;
    permissions: string[];
}

export interface User {
    id: string;
    tenant_id: string;
    role_id?: string;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
}

export interface Command {
    id: string;
    tenant_id: string;
    command_number: string;
    status: 'open' | 'closed' | 'cancelled';
    opened_at: Date;
    closed_at?: Date;
}

export interface Sale {
    id: string;
    tenant_id: string;
    customer_id?: string;
    user_id?: string;
    command_id?: string;
    total_amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: Date;
}

export interface SaleItem {
    id: string;
    sale_id: string;
    item_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface PaymentMethod {
    id: string;
    tenant_id: string;
    name: string;
    type: 'cash' | 'credit_card' | 'debit_card' | 'pix';
    fee_percentage: number;
    days_to_receive: number;
    active: boolean;
}

export interface Payment {
    id: string;
    tenant_id: string;
    sale_id: string;
    payment_method_id: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    created_at: Date;
}

export interface CashFlowEntry {
    id: string;
    tenant_id: string;
    type: 'payable' | 'receivable';
    description: string;
    amount: number;
    due_date: Date;
    status: 'pending' | 'paid' | 'overdue';
    payment_id?: string;
    created_at: Date;
    updated_at: Date;
}
