import WidgetDestroyedException from "./exceptions/WidgetDestroyedException";
import Observer from "./Observer";
import WidgetInstanceNotFoundException from "./exceptions/WidgetInstanceNotFoundException";
import WidgetFactory from "./factories/WidgetFactory";
import WidgetInitializationException from "./exceptions/WidgetInitializationException";

interface Callback {
    (error: Error | null, message?: string): void;
}

class WidgetCore {
    private widgets: Map<Element, IWidget>;
    private factory: WidgetFactory;
    private observers: Observer[] = [];

    constructor() {
        this.widgets = new Map();
        this.factory = new WidgetFactory();
    }

    /**
     * addObserver
     * @param observer
     */
    addObserver(observer: Observer) {
        this.observers.push(observer);
    }

    /**
     * notifyObservers
     * @param event
     * @param data
     */
    notifyObservers(event: string, data?: any) {
        this.observers.forEach(observer => observer.update(event, data));
    }

    /**
     * init
     * @param target
     * @param callback
     */
    async init(target: Element, callback: Callback) {
        try {
            const elements = target.querySelectorAll('[widget]');
            for(const element of elements) {
                const widgetPath = element.getAttribute('widget');
                if(widgetPath && !this.widgets.has(element)) {
                    try {
                        const widgetInstance = await this.factory.createWidget(widgetPath);
                        this.widgets.set(element, widgetInstance);
                        await widgetInstance.init(element, (err) => {
                            if (err) {
                                this.notifyObservers('init_error', new WidgetInitializationException(widgetPath, err.message));
                                callback(err);
                                return;
                            }
                        });
                        this.notifyObservers('init_success', { widgetPath });
                    } catch (error) {
                        const widgetError = new WidgetInitializationException(widgetPath, (error as Error).message || "Unknown error");
                        this.notifyObservers('init_error', widgetError);

                        callback(error as Error);
                        return;
                    }
                } else if (widgetPath && !this.widgets.get(element)?.initialized) {
                    throw new WidgetDestroyedException("Widget destroyed during initialization.");
                }
            }
            this.notifyObservers("init_complete")
            callback(null);
        } catch (err) {
            this.notifyObservers("init_error", err as Error)
            callback(err as Error);
        }
    }

    /**
     * destroy
     * @param target
     */
    destroy(target: Element) {
        const elements = Array.from(target.querySelectorAll('[widget]')).reverse();

        for (const element of elements) {
            const widgetInstance = this.widgets.get(element);
            if(widgetInstance) {
                widgetInstance.destroy();
                this.widgets.delete(element);

                const container = element.firstElementChild;
                if (container) {
                    container.remove();
                }
            } else {
                throw new WidgetInstanceNotFoundException(`Widget instance not found for element: ${element}`)
            }

        }


        this.notifyObservers("destroy_complete")
    }
}

export default WidgetCore;