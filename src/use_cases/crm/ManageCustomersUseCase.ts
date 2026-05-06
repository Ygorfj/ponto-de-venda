import { Customer } from '../../core/interfaces/IModels';
import { ICustomerRepository } from '../../core/interfaces/IRepositories';

export class ManageCustomersUseCase {
    constructor(private customerRepository: ICustomerRepository) {}

    async registerCustomer(
        tenantId: string, 
        name: string, 
        documentNumber?: string, 
        contactEmail?: string, 
        contactPhone?: string
    ): Promise<Customer> {
        if (!name) {
            throw new Error('Customer name is required');
        }

        return this.customerRepository.create({
            tenant_id: tenantId,
            name,
            document_number: documentNumber,
            contact_email: contactEmail,
            contact_phone: contactPhone,
            loyalty_points: 0
        });
    }

    async listCustomers(tenantId: string): Promise<Customer[]> {
        return this.customerRepository.findByTenant(tenantId);
    }

    async addLoyaltyPoints(customerId: string, points: number): Promise<Customer> {
        if (points <= 0) {
            throw new Error('Points must be greater than zero');
        }
        return this.customerRepository.updateLoyaltyPoints(customerId, points);
    }
}
