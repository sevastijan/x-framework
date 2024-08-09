import Widget from "../widgets/Widget";

class WidgetFactory {
    private resolver: (path: string) => Promise<{default: new() => IWidget}>;

    constructor(resolver?: (path: string) => Promise<{ default: { new(): IWidget } }>) {
        this.resolver = resolver || this.defaultResolver;
    }

    /**
     * defaultResolver
     * @param path
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
     * createWidget
     * @param path
     */
    public async createWidget(path: string): Promise<IWidget> {
        const WidgetClass = (await this.resolver(path)).default;
        return new WidgetClass();
    }
}

export default WidgetFactory;