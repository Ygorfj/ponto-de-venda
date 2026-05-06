import {
    Item,
    Category,
    Supplier,
    Customer,
    Role,
    User,
    Command,
    Sale,
    SaleItem,
    PaymentMethod,
    Payment,
    CashFlowEntry
} from './IModels';

export interface IItemRepository {
    create(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item>;
    findById(id: string): Promise<Item | null>;
    findByTenant(tenantId: string): Promise<Item[]>;
    update(id: string, item: Partial<Item>): Promise<Item>;
    delete(id: string): Promise<boolean>;
}

export interface ICategoryRepository {
    create(category: Omit<Category, 'id' | 'created_at'>): Promise<Category>;
    findByTenant(tenantId: string): Promise<Category[]>;
}

export interface ISupplierRepository {
    create(supplier: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier>;
    findByTenant(tenantId: string): Promise<Supplier[]>;
}

export interface ICustomerRepository {
    create(customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer>;
    findByTenant(tenantId: string): Promise<Customer[]>;
    updateLoyaltyPoints(id: string, points: number): Promise<Customer>;
}

export interface IUserRepository {
    create(user: Omit<User, 'id' | 'created_at'>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByTenant(tenantId: string): Promise<User[]>;
}

export interface IRoleRepository {
    create(role: Omit<Role, 'id'>): Promise<Role>;
    findByTenant(tenantId: string): Promise<Role[]>;
}

export interface ICommandRepository {
    create(command: Omit<Command, 'id' | 'opened_at' | 'closed_at'>): Promise<Command>;
    findByTenantAndStatus(tenantId: string, status: Command['status']): Promise<Command[]>;
    closeCommand(id: string): Promise<Command>;
}

export interface ISaleRepository {
    create(sale: Omit<Sale, 'id' | 'created_at'>, items: Omit<SaleItem, 'id' | 'sale_id'>[]): Promise<Sale>;
    findById(id: string): Promise<Sale | null>;
    findByTenant(tenantId: string): Promise<Sale[]>;
}

export interface IPaymentMethodRepository {
    create(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod>;
    findById(id: string): Promise<PaymentMethod | null>;
    findByTenant(tenantId: string): Promise<PaymentMethod[]>;
}

export interface IPaymentRepository {
    create(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment>;
}

export interface ICashFlowRepository {
    create(entry: Omit<CashFlowEntry, 'id' | 'created_at' | 'updated_at'>): Promise<CashFlowEntry>;
    findByTenantAndPeriod(tenantId: string, startDate: Date, endDate: Date): Promise<CashFlowEntry[]>;
    markAsPaid(id: string): Promise<CashFlowEntry>;
}
