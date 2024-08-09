import Widget from "./Widget";

class B extends  Widget {
    async init(target: Element, done: (err?: Error) => void) {
        await super.init(target, done);

        target.insertAdjacentHTML('afterbegin','<div>Hi! I&apos;m widget B 🤘</div>');
    }

    destroy() {
        super.destroy();
    }
}

export default B;