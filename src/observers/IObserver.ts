interface IObserver {
    update(event: string, data?: any): void;
}