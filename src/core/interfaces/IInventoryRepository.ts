export interface BOMItem {
    ingredientId: string;
    quantityRequired: number;
}

export interface IInventoryRepository {
    getBOMForService(serviceId: string): Promise<BOMItem[]>;
    decrementStock(itemId: string, amount: number): Promise<void>;
    getStock(itemId: string): Promise<number>;
    getAverageDailySales(itemId: string, days: number): Promise<number>;
}
