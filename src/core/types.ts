export interface Callback {
    (error?: Error, message?: string): void;
}

export type EventDataMap = {
    init_success: { widgetPath: string };
    init_error: Error;
    init_complete: null;
    destroy_complete: null;
};

export type EventType = keyof EventDataMap;
export type EventData<T extends EventType> = EventDataMap[T];