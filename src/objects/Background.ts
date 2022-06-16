import { AnimatedObject } from './AnimatedObject';
import { OBJECT_TYPE } from '../constants';


export class Background extends AnimatedObject {

    public name: string;

    constructor(data: IBackground) {
        super(data, OBJECT_TYPE.BACKGROUND);
        this.name = data.name;
    }
}
