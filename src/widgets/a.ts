import Widget from "./Widget";

class A extends Widget {
    async init(target: Element, done: (err?: Error) => void) {
        await super.init(target, done);

        const container = document.createElement('div');
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "Hi! I'm widget A 🤘";

        const button = document.createElement('button');
        button.textContent = 'Click Me';
        button.addEventListener('click', this.clickHandler);

        container.appendChild(messageDiv);
        container.appendChild(button);

        target.prepend(container);
    }

    clickHandler(event: Event) {
        alert("Hello 👋, widget A! Check binding in console");
        console.log(this)
    }

    destroy() {
        super.destroy();
    }
}

export default A;