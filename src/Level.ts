/// <reference path="interface.d.ts"/>

import { User } from './objects';
import { getJSON, normalize } from './utils';
import { AnimatedObject } from './objects/AnimatedObject';
import { OBJECT_TYPE } from './constants';
import { Signal } from 'ts-utils';
import { RenderHTML } from './render/RenderHTML';
import { Bonus } from './objects/Bonus';
import { set } from './config';
import { Background } from './objects/Background';
import { win } from './sounds';


export class Level {

    public loose: Signal<{}> = new Signal();
    public changeScore: Signal<{ score: number, bonusType: TBonusType }> = new Signal();
    public levelWin: Signal<{ score: number }> = new Signal();

    private get canLoop() {
        return !this.isEnded && !this.isPaused;
    }

    private render: RenderHTML;
    private isPaused: boolean;
    private isEnded: boolean;
    private levelData: ILevelJSON;
    private position: number;
    private lastTime: number;
    private width: number;
    private height: number;
    private objects: Array<AnimatedObject>;
    private user: User;
    private handlers: IGameHandlers;
    private levelIndex: number;
    private finish: AnimatedObject;


    constructor(levelJSONPath: string, options: ILevelOptions) {
        this.levelIndex = options.index;
        this.position = 0;

        this.handlers = {
            resize: () => this.onResize()
        };

        this.setHandlers();
        this.onResize();
        this.levelWin.once(() => win.play());

        getJSON<ILevelJSON>(levelJSONPath).then(data => {
            this.levelData = data;

            set('tapPower', data.tapPower);

            this.render = new RenderHTML(data, document.querySelector('#root'), options);
            this.createGameObjects();
            this.createUser();

            this.runGame();
        });
    }

    public removeObject(ground: AnimatedObject): void {
        const index = this.objects.indexOf(ground);
        this.objects.splice(index, 1);
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        this.isPaused = false;
        this.runGame();
    }

    public destroy() {
        this.isEnded = true;
        this.objects = [];
        this.user.changeScore.off(null);
        this.user.gameOver.off(null);
        this.user.destroy();
        this.render.destroy();
        this.removeHandlers();
    }

    private createGameObjects(): void {
        this.objects = [
            ...this.levelData.objects.ground.map(ground => new AnimatedObject(ground, OBJECT_TYPE.GROUND)),
            ...this.levelData.objects.block.map(block => new AnimatedObject(block, OBJECT_TYPE.BLOCK)),
            ...this.levelData.objects.bonus.map(bonus => new Bonus(bonus) as AnimatedObject),
            ...this.levelData.objects.background.map(bg => new Background(bg))
        ];

        this.finish = new AnimatedObject(this.levelData.objects.finish, OBJECT_TYPE.FINISH);

        this.objects.push(this.finish);

        this.objects.sort((a, b) => a.x - b.x);
    }

    private createUser() {
        const userData = this.levelData.objects.user;
        this.user = new User(userData);
        this.user.gameOver.once(() => {
            this.isEnded = true;
            this.loose.dispatch({});
            this.render.gameOver();
        });

        this.user.changeScore.on(data => {
            this.changeScore.dispatch(data);
        });
    }

    private setHandlers() {
        Object.keys(this.handlers).forEach(name => {
            window.addEventListener(name, this.handlers[name], false);
        });
    }

    private removeHandlers() {
        Object.keys(this.handlers).forEach(name => {
            window.removeEventListener(name, this.handlers[name], false);
        });
    }

    private runGame() {
        this.lastTime = Date.now();
        requestAnimationFrame(() => this.loop());
    }

    private loop() {

        const { delta, position } = this.getDistance();
        this.position += position;

        this.currentNewState(delta);

        if (this.canLoop) {
            requestAnimationFrame(() => this.loop());
        }

        if (!this.isEnded && normalize(this.position) >= normalize(this.finish.x)) {
            this.render.done();
        }

        if (!this.isEnded && normalize(this.position) >= normalize(this.finish.x) + normalize(this.finish.width)) {
            this.isEnded = true;
            this.levelWin.dispatch({ score: this.user.score });

            return null;
        }
    }

    private currentNewState(deltaTime) {

        const state = {
            position: this.position,
            deltaTime,
            width: this.width,
            height: this.height,
            G: this.levelData.G
        };

        this.objects.slice().some(object => {
            const isVisible = object.currentNewState(state);

            if (object.over) {
                this.removeObject(object);
            }

            return isVisible === false;
        });

        this.user.currentNewUesrState(state, this.objects);
        this.render.apply(state, this.objects, this.user);
    }

    private getDistance() {
        const time = Date.now();
        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;
        return {
            delta,
            position: Math.round(delta * normalize(this.levelData.speed))
        };
    }

    private onResize(): void {
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;
    }
}