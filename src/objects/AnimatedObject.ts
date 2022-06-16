/// <reference path="../interface.d.ts"/>

import { uniqueId } from 'ts-utils';
import { OBJECT_TYPE } from '../constants';
import { normalize } from '../utils/index';


export class AnimatedObject {

    public readonly width: number;
    public readonly height: number;
    public readonly type: OBJECT_TYPE;
    public readonly id: string = uniqueId('animated_object');
    public x: number;
    public y: number;
    public over: boolean = false;
    public isVisible: boolean = false;


    constructor(data: IObjectData, type: OBJECT_TYPE) {
        this.width = normalize(data.size.width);
        this.height = normalize(data.size.height);
        this.x = normalize(data.position.x);
        this.y = normalize(data.position.y);
        this.type = type;
    }


    public currentNewState(data: IStateData): boolean {
        if (data.position > this.x + this.width) {
            this.over = true;
            this.isVisible = false;
            return null;
        }

        if (data.position + data.width >= this.x) {
            this.isVisible = true;
        }

        return this.isVisible;
    }
}
