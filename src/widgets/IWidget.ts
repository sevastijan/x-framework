interface IWidget {
    initialized: boolean;
    init(target: Element, done: (err?: Error) => void): Promise<void>;
    destroy(): void;
}