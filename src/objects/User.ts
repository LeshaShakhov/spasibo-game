import { AnimatedObject } from './AnimatedObject';
import { OBJECT_TYPE } from '../constants';
import { isGround, isNotBackground, Line, normalize } from '../utils';
import { Signal } from 'ts-utils';
import { Bonus } from './Bonus';
import { get } from '../config';
import { Howl } from 'howler';
import { jump, loose } from '../sounds';

const enum MODE {
    ON_GROUND = 'run',
    JUMP_UP = 'jump-up',
    JUMP_DOWN = 'jump-down'
}


export class User extends AnimatedObject {

    public changeScore: Signal<{ score: number, bonusType: TBonusType }> = new Signal();
    public score: number = 0;
    public mode: MODE = MODE.JUMP_DOWN;
    public gameOver: Signal<{}> = new Signal();

    private speedY: number = 0;
    private handlers: IHash<() => void>;
    private readonly jumpSound: Howl = jump;
    private readonly looseSound: Howl = loose;


    constructor(data: IObjectData) {
        super(data, OBJECT_TYPE.USER);

        this.handlers = {
            mousedown: () => this.onClick(),
            touchstart: () => this.onClick()
        };

        Object.keys(this.handlers).forEach(name => {
            document.body.addEventListener(name, this.handlers[name], false);
        });
    }

    public destroy(): void {
        Object.keys(this.handlers).forEach(name => {
            document.body.removeEventListener(name, this.handlers[name], false);
        });
    }

    public currentNewUesrState(data: IStateData, objects: Array<AnimatedObject>): boolean {
        const { deltaTime, G } = data;

        switch (this.mode) {
            case MODE.JUMP_UP:
            case MODE.JUMP_DOWN:
                this.speedY = this.speedY + normalize(G) * deltaTime;

                if (this.speedY < 0) {
                    this.mode = MODE.JUMP_DOWN;
                }

                const lastY = this.y;
                const y = Math.max(this.y + (this.speedY * deltaTime), 0);
                const ground = this.getGround(lastY, y, data.position + this.x, objects);

                if (ground) {
                    this.y = ground;
                    this.mode = MODE.ON_GROUND;
                } else {
                    this.y = y;
                }

                break;
            case MODE.ON_GROUND:
                const active = this.getGround(this.y, this.y, data.position + this.x, objects);
                if (!active) {
                    this.mode = MODE.JUMP_DOWN;
                }
                break;
        }

        this.hittest(data.position + this.x, this.y, objects);

        if (this.y === 0) {
            this.looseSound.play();
            this.gameOver.dispatch({});
        }

        return true;
    }

    private onClick() {
        if (this.mode === MODE.ON_GROUND) {
            this.mode = MODE.JUMP_UP;
            this.speedY = normalize(get('tapPower'));
            this.jumpSound.play();
        }
    }

    private getGround(lastY, y, position, objects: Array<AnimatedObject>) {
        return objects
            .filter(isGround)
            .map(ground => new Line(ground))
            .filter(line => line.isInLine(position) || line.isInLine(position + this.width))
            .map(line => {
                const obj = line.getObject();
                return obj.y + obj.height;
            })
            .sort((a, b) => b - a)
            .filter(h => lastY >= h && y <= h)[0];
    }

    private hittest(x, y, objects: AnimatedObject[]) {

        const userRect = {
            x: x + this.width * 0.3,
            y,
            x1: x + this.width - this.width * 0.3,
            y1: y + this.height
        };

        objects
            .filter(isNotBackground)
            .forEach(object => {
                if (object.type === OBJECT_TYPE.GROUND || object.isVisible === false) {
                    return null;
                }

                const rect = {
                    x: object.x, y: object.y,
                    x1: object.width + object.x,
                    y1: object.height + object.y
                };

                if (User.hittestRectInRect(userRect, rect) || User.hittestRectInRect(rect, userRect)) {
                    switch (object.type) {
                        case OBJECT_TYPE.BLOCK:
                            this.looseSound.play();
                            this.gameOver.dispatch({});
                            break;
                        case OBJECT_TYPE.BONUS:
                            object.over = true;
                            this.score += (object as Bonus).amount;
                            (object as Bonus).complete.dispatch(true);
                            this.changeScore.dispatch({
                                score: this.score,
                                bonusType: (object as Bonus).bonusType
                            });
                            break;
                    }
                }
            });
    }

    static hittest(point: ICoordinates, rect: IRect): boolean {
        return point.x >= rect.x && point.x <= rect.x1 &&
            point.y >= rect.y && point.y <= rect.y1;
    }

    static hittestRectInRect(rect: IRect, target: IRect): boolean {
        return [
            { x: rect.x, y: rect.y },
            { x: rect.x1, y: rect.y },
            { x: rect.x, y: rect.y1 },
            { x: rect.x1, y: rect.y1 }
        ].some(point => User.hittest(point, target));
    }

}
