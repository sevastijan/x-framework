interface IWidgetFactory {
    createWidget(path: string): Promise<IWidget>;
}