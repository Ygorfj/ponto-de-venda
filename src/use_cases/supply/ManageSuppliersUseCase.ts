import { Supplier } from '../../core/interfaces/IModels';
import { ISupplierRepository } from '../../core/interfaces/IRepositories';

export class ManageSuppliersUseCase {
    constructor(private supplierRepository: ISupplierRepository) {}

    async registerSupplier(
        tenantId: string, 
        name: string, 
        documentNumber?: string, 
        contactEmail?: string, 
        contactPhone?: string
    ): Promise<Supplier> {
        if (!name) {
            throw new Error('Supplier name is required');
        }

        return this.supplierRepository.create({
            tenant_id: tenantId,
            name,
            document_number: documentNumber,
            contact_email: contactEmail,
            contact_phone: contactPhone
        });
    }

    async listSuppliers(tenantId: string): Promise<Supplier[]> {
        return this.supplierRepository.findByTenant(tenantId);
    }
}
