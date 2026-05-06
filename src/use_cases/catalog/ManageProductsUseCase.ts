import { Item } from '../../core/interfaces/IModels';
import { IItemRepository } from '../../core/interfaces/IRepositories';

export class ManageProductsUseCase {
    constructor(private itemRepository: IItemRepository) {}

    async createProduct(tenantId: string, name: string, price: number, stockQuantity: number = 0): Promise<Item> {
        if (!name || price < 0) {
            throw new Error('Invalid product data');
        }

        return this.itemRepository.create({
            tenant_id: tenantId,
            type: 'product',
            name,
            price,
            stock_quantity: stockQuantity
        });
    }

    async updateStock(productId: string, quantityToAddOrRemove: number): Promise<Item> {
        const product = await this.itemRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const newStock = product.stock_quantity + quantityToAddOrRemove;
        if (newStock < 0) {
            throw new Error('Insufficient stock');
        }

        return this.itemRepository.update(productId, { stock_quantity: newStock });
    }

    async listProducts(tenantId: string): Promise<Item[]> {
        return this.itemRepository.findByTenant(tenantId);
    }
}
