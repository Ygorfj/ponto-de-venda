import { Sale, SaleItem } from '../../core/interfaces/IModels';
import { ISaleRepository, IItemRepository } from '../../core/interfaces/IRepositories';

export class ProcessSaleUseCase {
    constructor(
        private saleRepository: ISaleRepository,
        private itemRepository: IItemRepository
    ) {}

    async executeSale(
        tenantId: string, 
        userId: string, 
        items: { itemId: string; quantity: number }[],
        customerId?: string,
        commandId?: string
    ): Promise<Sale> {
        if (!items || items.length === 0) {
            throw new Error('Sale must contain at least one item');
        }

        let totalAmount = 0;
        const saleItems: Omit<SaleItem, 'id' | 'sale_id'>[] = [];

        // ⚡ Bolt Performance Optimization:
        // Cache fetched items to prevent duplicate DB queries in the second loop.
        // Reduces read queries from O(2n) to O(n) where n is the number of items.
        const itemCache = new Map<string, any>();

        // Validate items, calculate total and prepare sale items
        for (const reqItem of items) {
            const item = await this.itemRepository.findById(reqItem.itemId);
            if (!item || item.tenant_id !== tenantId) {
                throw new Error(`Item not found: ${reqItem.itemId}`);
            }

            itemCache.set(reqItem.itemId, item);

            if (item.type === 'product' && item.stock_quantity < reqItem.quantity) {
                throw new Error(`Insufficient stock for product: ${item.name}`);
            }

            const totalPrice = item.price * reqItem.quantity;
            totalAmount += totalPrice;

            saleItems.push({
                item_id: item.id,
                quantity: reqItem.quantity,
                unit_price: item.price,
                total_price: totalPrice
            });
        }

        // Create the sale
        const sale = await this.saleRepository.create({
            tenant_id: tenantId,
            user_id: userId,
            customer_id: customerId,
            command_id: commandId,
            total_amount: totalAmount,
            status: 'completed'
        }, saleItems);

        // Update stock (Simple immediate deduction for now)
        for (const reqItem of items) {
            const item = itemCache.get(reqItem.itemId);
            if (item && item.type === 'product') {
                await this.itemRepository.update(item.id, {
                    stock_quantity: item.stock_quantity - reqItem.quantity
                });
            }
        }

        return sale;
    }
}
