class WidgetInstanceNotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WidgetInstanceNotFoundException";
    }
}

export default WidgetInstanceNotFoundException;