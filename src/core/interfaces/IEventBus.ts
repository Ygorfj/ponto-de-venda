export interface IEvent {
    eventName: string;
    timestamp: Date;
}

export interface IEventBus {
    publish(event: IEvent): void;
}
