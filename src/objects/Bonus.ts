import { AnimatedObject } from './AnimatedObject';
import { OBJECT_TYPE } from '../constants';
import { Signal } from 'ts-utils';


export class Bonus extends AnimatedObject {

    public amount: number;
    public bonusType: TBonusType;
    public complete: Signal<boolean> = new Signal();


    constructor(data: IBonusData) {
        super(data, OBJECT_TYPE.BONUS);
        this.amount = data.amount;
        this.bonusType = data.bonusType || 'bonus';
    }

}
