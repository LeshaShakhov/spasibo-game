import { Level } from './Level';
import { cssFactory, getJSON } from './utils';
import { Signal } from 'ts-utils';
import { set } from './config';

export * from './sounds';


export class Game {

    public levelDone: Signal<{ level: number }> = new Signal();
    public loose: Signal<{ level: number }> = new Signal();
    public changeScore: Signal<{ level: number, score: number, bonusType: TBonusType }> = new Signal();

    private level: number = 0;
    private activeGame: Level;
    private levelPathList: Array<string>;
    private targetSize: ISize;
    private loadPromise: Promise<void>;


    constructor() {
        this.loadPromise = getJSON<IGameInfo>('./game.json').then(info => {
            this.levelPathList = info.levels;
            this.targetSize = info.targetSize;

            this.setHandlers();
            this.onResize();
        });
    }

    public pause() {
        if (this.activeGame) {
            this.activeGame.pause();
        }
    }

    public resume() {
        if (this.activeGame) {
            this.activeGame.resume();
        }
    }

    public start(level?: number): void {
        const preload = document.querySelector('.preload');

        if (preload && preload.parentNode) {
            preload.parentNode.removeChild(preload);
        }

        this.loadPromise.then(() => {
            if (level != null) {
                this.level = Math.min(level, this.levelPathList.length - 1);
            }

            this.removeLevel();
            this.createLevel();
        });
    }

    public getActiveLevel(): number {
        return this.level;
    }

    private setHandlers(): void {
        window.addEventListener('resize', () => this.onResize(), false);
    }

    private onResize(): void {
        const width = innerWidth;
        const height = innerHeight;

        cssFactory(document.body)({
            width: `${innerWidth}px`,
            height: `${innerHeight}px`
        });

        const factor = Math.min(
            width / this.targetSize.width,
            height / this.targetSize.height
        );

        set('factor', factor);
    }

    private createLevel(): void {
        const options = {
            index: this.level
        };
        this.activeGame = new Level(this.levelPathList[this.level], options);

        this.activeGame.loose.once(() => {
            this.loose.dispatch({ level: this.level });
        });

        this.activeGame.levelWin.once(() => {
            this.levelDone.dispatch({ level: this.level });
        });

        this.activeGame.changeScore.on(data => {
            this.changeScore.dispatch({ level: this.level, ...data });
        });
    }

    private removeLevel(): void {
        if (!this.activeGame) {
            return null;
        }

        this.activeGame.destroy();
        this.activeGame.loose.off(null);
        this.activeGame.levelWin.off(null);
        this.activeGame.changeScore.off(null);
    }

}

export const game = new Game();

interface IGameInfo {
    levels: Array<string>;
    targetSize: ISize;
}
