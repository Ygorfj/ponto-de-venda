import { IEvent } from '../interfaces/IEventBus';

export class CriticalStockEvent implements IEvent {
    public readonly eventName = 'CriticalStockEvent';
    public readonly timestamp = new Date();

    constructor(
        public readonly itemId: string,
        public readonly currentStock: number
    ) {}
}
