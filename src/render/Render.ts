import { AnimatedObject } from '../objects/AnimatedObject';
import { User } from '../objects/User';


export abstract class Render {

    protected readonly root: HTMLElement;

    constructor(root: HTMLElement) {
        this.root = root;

        Array.prototype.slice.call(root.childNodes).forEach(child => {
            root.removeChild(child);
        });
    }

    public abstract apply(state: IStateData, objects: AnimatedObject[], user: User): void;

}
