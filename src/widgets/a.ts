import Widget from "./Widget";

class A extends  Widget {
    async init(target: Element, done: (err?: Error) => void) {
        await super.init(target, done);

        target.insertAdjacentHTML('afterbegin','<div>Hi! I&apos;m widget A 🤘</div>');
    }

    destroy() {
        super.destroy();
    }
}

export default A;