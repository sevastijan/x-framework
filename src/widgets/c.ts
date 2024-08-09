import Widget from "./Widget";

class C extends  Widget {
    async init(target: Element, done: (err?: Error) => void) {
        await super.init(target, done);

        target.insertAdjacentHTML('afterbegin','<div>Hi! I&apos;m widget C 🤘</div>');
    }

    destroy() {
        super.destroy();
    }
}

export default C;