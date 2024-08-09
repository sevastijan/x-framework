abstract class Widget implements IWidget {
    protected target!: Element;
    public initialized: boolean;

    constructor() {
        this.initialized = false;
    }

    async init(target: Element, done: (err?: Error) => void) {
        this.target = target;

        await this.beforeInit();

        done();

        await this.afterInit();
    }

    async beforeInit() {}
    async afterInit(){}

    destroy() {
        this.initialized = false;
    }
}



export default Widget;