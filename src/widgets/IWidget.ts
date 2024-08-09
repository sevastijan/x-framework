interface IWidget {
    initialized: boolean;
    init(target: Element, done: (err?: Error|undefined) => void): Promise<void>;
    destroy(): void;
}