import Widget from "../widgets/Widget";

class WidgetFactory implements IWidgetFactory {
    private resolver: (path: string) => Promise<{default: new() => IWidget}>;

    constructor(resolver?: (path: string) => Promise<{ default: { new(): IWidget } }>) {
        this.resolver = resolver || this.defaultResolver;
    }

    /**
     * Asynchronously resolves the path to a module and imports the widget class.
     *
     * The `defaultResolver` method attempts to dynamically import a module based on the provided path.
     * In a browser environment, it uses `import()`, while in a Node.js environment, it uses `require()`.
     * It returns an object containing the default widget class, which can then be instantiated.
     *
     * @param path
     * @throws {Error} If the module import fails.
     * @private
     */
    private async defaultResolver(path: string): Promise<{ default: new () => IWidget}> {
        if(typeof window !== 'undefined' && typeof window.document !== 'undefined') {
            return import(`../${path}.ts`);
        } else {
            return require(`../${path}.ts`);
        }
    }

    /**
     * Asynchronously creates an instance of a widget based on the provided path.
     *
     * The `createWidget` method resolves the path to a module using the configured resolver
     * and instantiates the widget class defined as the default export of that module.
     *
     * @param path
     *
     * @throws {Error} If the module import fails or the widget class cannot be instantiated.
     */
    public async createWidget(path: string): Promise<IWidget> {
        const WidgetClass = (await this.resolver(path)).default;
        return new WidgetClass();
    }
}

export default WidgetFactory;