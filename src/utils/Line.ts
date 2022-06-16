import { AnimatedObject } from '../objects/AnimatedObject';


export class Line {

    private readonly x1: number;
    private readonly x2: number;
    private readonly object: AnimatedObject;

    constructor(object: AnimatedObject) {
        this.x1 = object.x;
        this.x2 = object.x + object.width;
        this.object = object;
    }

    public isInLine(x: number): boolean {
        return this.x1 <= x && x <= this.x2;
    }

    public getObject(): AnimatedObject {
        return this.object;
    }

}
