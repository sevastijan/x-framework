class WidgetDestroyedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WidgetDestroyedError";
    }
}

export default WidgetDestroyedError;