class WidgetInitializationException extends Error {
    widgetPath: string;

    constructor(widgetPath: string, message: string) {
        super(message);
        this.widgetPath = widgetPath;
        this.name = "WidgetInitializationException";
    }
}

export default WidgetInitializationException;