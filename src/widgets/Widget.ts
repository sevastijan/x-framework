abstract class Widget implements IWidget {
    protected target!: Element;
    public initialized: boolean;

    constructor() {
        this.initialized = false;
    }

    async init(target: Element, done: (err?: Error) => void) {
        this.target = target;

        this.bindHandlers();

        await this.beforeInit();

        done();

        this.initialized = true;

        await this.afterInit();
    }

    async beforeInit(){}
    async afterInit(){}

    destroy() {
        this.initialized = false;
    }

    /**
     * Automatically binds methods ending with "Handler" to the current instance.
     *
     * The `bindHandlers` method is designed to ensure that any methods in the class
     * whose names end with "Handler" are automatically bound to the instance (`this`)
     * of the class. This is useful for preserving the correct `this` context when
     * such methods are passed as event handlers or callbacks, where `this` might
     * otherwise be reassigned.
     *
     * The method works by iterating over all the property names of the class's prototype,
     * filtering for methods that end with "Handler" and binding them to the instance.
     *
     * @returns void
     */
    private bindHandlers() {
        const proto = Object.getPrototypeOf(this);
        const handlerMethodNames = Object.getOwnPropertyNames(proto)
            .filter(name => typeof this[name as keyof this] === 'function' && name.endsWith('Handler'));

        handlerMethodNames.forEach((methodName) => {
            const fn = this[methodName as keyof this] as unknown as Function;
            this[methodName as keyof this] = fn.bind(this);
        });
    }


}

export default Widget;