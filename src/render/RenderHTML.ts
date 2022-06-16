import { Render } from './Render';
import { createElement, cssFactory, normalize } from '../utils';
import { AnimatedObject } from '../objects/AnimatedObject';
import { User } from '../objects/User';
import { Bonus } from '../objects/Bonus';
import { Background } from '../objects/Background';


export class RenderHTML extends Render {

    private readonly level: ILevelJSON;
    private moveContainer: HTMLElement;
    private user: HTMLElement;
    private drawnObjects: IHash<IRenderCache> = Object.create(null);
    private factor: number;


    constructor(level: ILevelJSON, root: HTMLElement, options: ILevelOptions) {
        super(root);
        this.level = level;
        root.className = `level-${options.index + 1}`;

        this.createContainers();
    }

    public gameOver() {
        this.user.id = 'dead';
    }

    public apply(state: IStateData, objects: AnimatedObject[], user: User): void {
        const moveContainerCss = cssFactory(this.moveContainer);
        const userCss = cssFactory(this.user);

        moveContainerCss('transform', `translate(-${state.position}px, 0px)`);
        userCss('transform', `translate(${user.x}px, -${user.y}px)`);

        const objectsHash = objects.reduce((acc, object) => {
            acc[object.id] = object;
            return acc;
        }, Object.create(null));

        Object.keys(this.drawnObjects).forEach(id => {
            if (!objectsHash[id]) {
                this.removeObject(id);
            }
        });

        objects.some(object => {
            if (!object.isVisible) {
                return true;
            }

            if (!this.drawnObjects[object.id]) {
                this.createObject(object);
            }
        });

        this.user.className = 'user';
        this.user.classList.add(`user__${user.mode}`);
    }

    public destroy() {
        this.root.innerText = '';
    }

    public done() {
        this.root.querySelector('.animated-object__finish').classList.add('done');
    }

    private removeObject(id: string) {
        const element = this.drawnObjects[id].element;
        setTimeout(() => {
            element.parentNode.removeChild(element);
        }, 1000);
        delete this.drawnObjects[id];
    }

    private createObject(object: AnimatedObject): void {
        let elementMod = '';

        if (object instanceof Bonus) {
            elementMod = object.bonusType;
            object.complete.once(state => {
                element.classList.toggle('completed', state);
            });
        } else if (object instanceof Background) {
            elementMod = object.name;
        }

        const element = createElement({
            className: `animated-object animated-object__${object.type} ${elementMod}`,
            parent: this.moveContainer
        });

        createElement({
            className: 'animated-object__body',
            parent: element
        });

        cssFactory(element)({
            width: `${object.width}px`,
            height: `${object.height}px`,
            transform: `translate(${object.x}px, -${object.y}px)`
        });

        this.drawnObjects[object.id] = { element, object };
    }

    private createContainers() {
        this.moveContainer = createElement({
            className: 'move-container',
            parent: this.root
        });

        this.user = createElement({
            className: 'user',
            parent: this.root
        });

        cssFactory(this.user)({
            width: `${normalize(this.level.objects.user.size.width)}px`,
            height: `${normalize(this.level.objects.user.size.height)}px`
        });

        cssFactory(this.moveContainer)('width', `${normalize(this.level.objects.finish.position.x) + innerWidth}px`);
    }

}

interface IRenderCache {
    object: AnimatedObject;
    element: HTMLElement;
}
