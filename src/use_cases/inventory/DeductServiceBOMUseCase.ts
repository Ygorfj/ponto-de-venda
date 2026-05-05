import { IInventoryRepository } from '../../core/interfaces/IInventoryRepository';
import { IEventBus } from '../../core/interfaces/IEventBus';
import { CriticalStockEvent } from '../../core/events/CriticalStockEvent';

export class DeductServiceBOMUseCase {
    constructor(
        private inventoryRepo: IInventoryRepository, 
        private eventBus: IEventBus
    ) {}

    async execute(serviceId: string, quantitySold: number): Promise<void> {
        const bomItems = await this.inventoryRepo.getBOMForService(serviceId);
        
        // ⚡ Bolt: Execute BOM deductions concurrently and parallelize independent queries
        // Reduces latency from O(n) dependent requests to O(1) concurrent requests
        await Promise.all(bomItems.map(async (item) => {
            const deductionAmount = item.quantityRequired * quantitySold;
            await this.inventoryRepo.decrementStock(item.ingredientId, deductionAmount);
            
            // ⚡ Bolt: Parallelize independent database queries
            const [currentStock, reorderPoint] = await Promise.all([
                this.inventoryRepo.getStock(item.ingredientId),
                this.calculateReorderPoint(item.ingredientId)
            ]);
            
            if (currentStock <= reorderPoint) {
                this.eventBus.publish(new CriticalStockEvent(item.ingredientId, currentStock));
            }
        }));
    }

    private async calculateReorderPoint(itemId: string): Promise<number> {
        const avgDailySales = await this.inventoryRepo.getAverageDailySales(itemId, 30);
        const leadTime = 7; 
        return avgDailySales * leadTime;
    }
}
