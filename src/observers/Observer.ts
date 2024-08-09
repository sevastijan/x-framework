import {EventData, EventType} from "../core/types";

class Observer {
    /**
     * Handles updates from observed events by logging the event and its associated data.
     *
     * The `update` method is responsible for processing events received by the observer.
     * It checks the type of event and its associated data to determine how to log the information.
     * If the event is an initialization error, it logs the error message. If the event contains
     * data with a `widgetPath` property, it logs the event along with the data. Otherwise, it
     * simply logs the event.
     *
     * @param event - The event type that is being observed, which is constrained to the `EventType`.
     * @param data - The data associated with the event, which can vary based on the event type. This data
     *               could be an `Error`, an object with a `widgetPath`, or `null`.
     *
     * @example
     * observer.update('init_error', new Error('Initialization failed'));
     * // Logs: "init_error: Initialization failed"
     *
     * @example
     * observer.update('init_success', { widgetPath });
     * // Logs: "init_success: { widgetPath: 'path/to/widget' }"
     *
     * @example
     * observer.update('init_complete',);
     * // Logs: "init_complete"
     */
    update<T extends EventType>(event: T, data: EventData<T>) {
        if (event === "init_error" && data instanceof Error) {
            console.error(`${event}:`, data.message);
        } else if (data && this.isWidgetPathData(data)) {
            console.log(`${event}:`, data);
        } else {
            console.log(`${event}`);
        }
    }

    /**
     * Checks if the provided data contains a `widgetPath` property.
     *
     * The `isWidgetPathData` method is a type guard that determines whether the given `data`
     * is an object that includes a `widgetPath` property. This method is used to safely
     * check if the `data` associated with an event can be treated as an object containing
     * the `widgetPath` string.
     *
     * @param data - The data to be checked, which is of type `EventData<EventType>`.
     * @returns A boolean value indicating whether the data is an object with a `widgetPath` property.
     *          If true, TypeScript will narrow the type of `data` to `{ widgetPath: string }`.
     *
     * @example
     * if (this.isWidgetPathData(data)) {
     *     console.log(data.widgetPath); // Safe to access `widgetPath`
     * }
     */
    private isWidgetPathData(data: EventData<EventType>): data is { widgetPath: string } {
        return typeof data === 'object' && data !== null && 'widgetPath' in data;
    }
}

export default Observer;