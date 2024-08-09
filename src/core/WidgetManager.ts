class WidgetManager {
    private widgets: Map<Element, IWidget> = new Map();

    /**
     * Associates a widget instance with a specified DOM element.
     *
     * The `addWidget` method adds a mapping between the provided DOM element and the given widget
     * instance to the internal `widgets` collection. If the element already has a widget associated
     * with it, this method will overwrite that association with the new widget.
     *
     * @param element - The DOM element to associate with the widget instance.
     * @param widget - The widget instance to be associated with the specified element.
     * @returns void
     *
     * @example
     * const widgetInstance = new MyWidget();
     * widgetManager.addWidget(someElement, widgetInstance);
     */
    addWidget(element: Element, widget: IWidget) {
        this.widgets.set(element, widget);
    }

    /**
     * Retrieves the widget instance associated with the specified element.
     *
     * The `getWidget` method returns the widget instance that is mapped to the given element
     * from the internal `widgets` collection. If no widget is associated with the element,
     * it returns `undefined`.
     *
     * @param element - The DOM element for which to retrieve the associated widget instance.
     * @returns The widget instance associated with the element, or `undefined` if no association exists.
     *
     * @example
     * const widgetInstance = widgetManager.getWidget(someElement);
     * if (widgetInstance) {
     *     widgetInstance.doSomething();
     * }
     */
    getWidget(element: Element): IWidget | undefined {
        return this.widgets.get(element);
    }

    /**
     * Removes the widget associated with the specified element from the internal collection.
     *
     * The `removeWidget` method deletes the mapping between the given element and its associated
     * widget instance from the internal `widgets` collection. This effectively disassociates
     * the widget from the element.
     *
     * @param element - The DOM element whose associated widget should be removed.
     * @returns void
     *
     * @example
     * widgetManager.removeWidget(someElement);
     */
    removeWidget(element: Element) {
        this.widgets.delete(element);
    }

    /**
     * Retrieves all elements within the target that have a `widget` attribute.
     *
     * The `getElementsWithWidget` method searches the provided target element for any child elements
     * that contain a `widget` attribute and returns them as an array.
     *
     * @param target - The root element within which to search for elements with the `widget` attribute.
     * @returns An array of elements that have a `widget` attribute.
     *
     * @example
     * const widgetElements = widgetManager.getElementsWithWidget(document.body);
     */
    getElementsWithWidget(target: Element): Element[] {
        return Array.from(target.querySelectorAll('[widget]'));
    }

}

export default WidgetManager;