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
        
        for (const item of bomItems) {
            const deductionAmount = item.quantityRequired * quantitySold;
            await this.inventoryRepo.decrementStock(item.ingredientId, deductionAmount);
            
            const currentStock = await this.inventoryRepo.getStock(item.ingredientId);
            const reorderPoint = await this.calculateReorderPoint(item.ingredientId);
            
            if (currentStock <= reorderPoint) {
                this.eventBus.publish(new CriticalStockEvent(item.ingredientId, currentStock));
            }
        }
    }

    private async calculateReorderPoint(itemId: string): Promise<number> {
        const avgDailySales = await this.inventoryRepo.getAverageDailySales(itemId, 30);
        const leadTime = 7; 
        return avgDailySales * leadTime;
    }
}
