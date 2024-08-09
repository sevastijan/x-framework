import WidgetDestroyedException from "../exceptions/WidgetDestroyedException";
import Observer from "../observers/Observer";
import WidgetInstanceNotFoundException from "../exceptions/WidgetInstanceNotFoundException";
import WidgetFactory from "../factories/WidgetFactory";
import WidgetInitializationException from "../exceptions/WidgetInitializationException";
import widgetManager from "./WidgetManager";
import WidgetManager from "./WidgetManager";
import { Callback, EventData, EventType } from "./types";

class WidgetCore {
    private widgetManager: widgetManager;
    private widgetFactory: WidgetFactory;
    private observers: Observer[] = [];

    constructor() {
        this.widgetManager = new WidgetManager();
        this.widgetFactory = new WidgetFactory();
    }

    /**
     * Initializes all widgets within the specified target element.
     *
     * The `init` method searches for all elements within the provided target element that have a `widget` attribute.
     * It then iterates over each of these elements and initializes the corresponding widget. During the initialization
     * process, observers are notified of both individual widget initialization results and the overall initialization
     * status. If an error occurs during the initialization of any widget, the observers are notified, and the callback
     * is invoked with the error.
     *
     * @param target - The root DOM element that contains the elements to be initialized with widgets.
     * @param callback - A function to be called once the initialization process is complete. It takes an optional
     *                   error parameter that is provided if the initialization fails.
     * @returns void
     *
     * @throws {Error} If an error occurs during the initialization of any widget, this error is passed to the callback.
     *
     * @example
     * widgetCore.init(document.body, (error) => {
     *     if (error) {
     *         console.error('Widget initialization failed:', error);
     *     } else {
     *         console.log('All widgets initialized successfully');
     *     }
     * });
     */
    async init(target: Element, callback: Callback) {
        try {
            const elements = this.widgetManager.getElementsWithWidget(target);

            for (const element of elements) {
                await this.initWidget(element, callback);
            }
            this.notifyObservers("init_complete");
            callback();
        } catch(error) {
            if(error instanceof Error) {
                this.notifyObservers("init_error", error);
                callback(error);
            }

        }
    }

    /**
     * Destroys all widgets within the specified target element.
     *
     * The `destroy` method searches for all elements within the provided target element that have a `widget` attribute.
     * It then iterates over each of these elements in reverse order and destroys the corresponding widget, removing
     * it from the internal widget manager and cleaning up any associated DOM elements. After all widgets are destroyed,
     * the observers are notified that the destruction process is complete.
     *
     * @param target - The root DOM element containing the elements whose widgets should be destroyed.
     * @returns void
     *
     * @throws {WidgetInstanceNotFoundException} If a widget instance associated with an element is not found during the destruction process.
     *
     * @example
     * widgetCore.destroy(document.body);
     */
    destroy(target: Element) {
        const elements = this.widgetManager.getElementsWithWidget(target).reverse();

        for (const element of elements) {
            this.destroyWidget(element);
        }

        this.notifyObservers("destroy_complete")
    }

    /**
     * Registers an observer to receive updates from the widget core.
     *
     * The `addObserver` method adds the provided observer to the internal list of observers
     * that will be notified of events or changes within the widget core. Observers should
     * implement the `Observer` interface, which typically includes an `update` method that
     * will be called when an event occurs.
     *
     * @param observer - The observer instance to be registered for receiving updates.
     * @returns void
     *
     * @example
     * const myObserver = new CustomObserver();
     * widgetCore.addObserver(myObserver);
     */
    addObserver(observer: Observer) {
        this.observers.push(observer);
    }

    /**
     * Unregisters an observer from receiving updates from the widget core.
     *
     * The `removeObserver` method removes the specified observer from the internal list of observers.
     * After this method is called, the observer will no longer receive notifications of events or changes
     * occurring within the widget core.
     *
     * @param observer - The observer instance to be unregistered.
     * @returns void
     *
     * @example
     * widgetCore.removeObserver(myObserver);
     */
    removeObserver(observer: Observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    /**
     * Unregisters all observers from receiving updates from the widget core.
     *
     * The `clearObservers` method removes all observers from the internal list, effectively
     * stopping any further notifications from being sent to them. This is useful for resetting
     * the state of the widget core or cleaning up when observers are no longer needed.
     *
     * @returns void
     *
     * @example
     * widgetCore.clearObservers();
     */
    clearObservers() {
        this.observers = [];
    }

    /**
     * Notifies all registered observers of a specific event and passes the associated data.
     *
     * The `notifyObservers` method iterates over the list of registered observers and invokes
     * their `update` method, passing along the specified event and its associated data. This
     * allows observers to react to changes or events that occur within the system.
     *
     * @param event - The event type that occurred, constrained to the `EventType`.
     * @param data - The data associated with the event. This parameter defaults to an empty object
     *               if not provided, ensuring that `update` is always called with some data. The
     *               type of this data depends on the event type and can vary from an object with
     *               a `widgetPath` to `null` or an `Error`.
     *
     * @example
     * // This will notify all observers that the initialization was successful, passing the widgetPath.
     * this.notifyObservers('init_success', { widgetPath });
     *
     * @example
     * // This will notify all observers that there was an initialization error.
     * this.notifyObservers('init_error', new Error('Initialization failed'));
     *
     * @example
     * // This will notify all observers that the initialization process is complete without additional data.
     * this.notifyObservers('init_complete');
     */
    notifyObservers<T extends EventType>(event: T, data: EventData<T> = {} as EventData<T>) {
        this.observers.forEach(observer => observer.update(event, data));
    }

    /**
     * Destroys the widget associated with the specified DOM element.
     *
     * The `destroyWidget` method handles the cleanup process for a widget associated with
     * a given DOM element. It first checks if a widget instance exists for the element
     * using the widget manager. If no widget instance is found, a `WidgetInstanceNotFoundException`
     * is thrown. Otherwise, the method destroys the widget, removes its association from the
     * widget manager, and removes the widget's content container from the DOM.
     *
     * @param element - The DOM element associated with the widget that is to be destroyed.
     * @returns void
     *
     * @throws {WidgetInstanceNotFoundException} If no widget instance is found for the specified element.
     *
     * @example
     * widgetCore.destroyWidget(someElement);
     */
    private destroyWidget(element: Element) {
        const widgetInstance = this.widgetManager.getWidget(element);

        if(!widgetInstance) {
            throw new WidgetInstanceNotFoundException(`Widget instance not found for element: ${element}`);
        } else {
            widgetInstance.destroy();
            this.widgetManager.removeWidget(element);

            /**
             * Remove container with widget content, without HTML Markup needed to next initialization
             */
            const container = element.firstElementChild;
            if (container) {
                container.remove();
            }
        }
    }

    /**
     * Initializes a widget for the specified DOM element.
     *
     * The `initWidget` method handles the initialization process for a widget associated with
     * a given DOM element. It first checks if the element has a `widget` attribute and whether
     * a widget instance is already associated with it. If not, it creates a new widget instance
     * using the widget factory, adds it to the widget manager, and initializes the widget.
     *
     * During initialization, if an error occurs, the observers are notified, and the callback
     * is invoked with the error. If initialization is successful, the observers are notified of
     * the success.
     *
     * @param element - The DOM element that will be associated with the widget.
     * @param callback - A function that will be called once the widget initialization process is complete.
     *                   It takes an optional error parameter.
     * @returns void
     *
     * @throws {WidgetDestroyedException} If the widget is destroyed during initialization.
     *
     * @example
     * widgetCore.initWidget(someElement, (error) => {
     *     if (error) {
     *         console.error('Widget initialization failed:', error);
     *     } else {
     *         console.log('Widget initialized successfully');
     *     }
     * });
     */
    private async initWidget(element: Element, callback: Callback) {
        const widgetPath = element.getAttribute('widget');

        if(widgetPath && !this.widgetManager.getWidget(element)) {
            try {
                const widgetInstance = await this.widgetFactory.createWidget(widgetPath);
                this.widgetManager.addWidget(element, widgetInstance);

                await widgetInstance.init(element, (error) => {
                    if(error) this.handleInitError(widgetPath, error, callback);

                    return;
                });

                this.notifyObservers('init_success', { widgetPath });
            } catch (error) {
                if(error instanceof Error) this.handleInitError(widgetPath, error, callback);

                return;
            }
        } else if (widgetPath && !this.widgetManager.getWidget(element)?.initialized) {
            throw new WidgetDestroyedException("Widget destroyed during initialization");
        }
    }

    /**
     * Handles errors during widget initialization by notifying observers and invoking the callback.
     *
     * The `handleInitError` method is responsible for handling any errors that occur during the
     * widget initialization process. It creates a `WidgetInitializationException` with the given
     * error message and the widget path, then notifies all observers about the initialization error.
     * Finally, it invokes the provided callback function with the error.
     *
     * @param widgetPath - The path of the widget that encountered an error during initialization.
     * @param error - The error that occurred during the widget initialization.
     * @param callback - The callback function that will be called with the error to inform the caller
     *                   that an error has occurred.
     *
     * @returns void
     *
     * @example
     * try {
     *     // Some widget initialization logic
     * } catch (error) {
     *     if (error instanceof Error) {
     *         this.handleInitError(widgetPath, error, callback);
     *     }
     * }
     */
    private handleInitError(widgetPath: string, error: Error, callback: Callback) {
        this.notifyObservers("init_error", new WidgetInitializationException(widgetPath, error.message));
        callback(error);
    }
}

export default WidgetCore;