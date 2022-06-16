interface IHash<T> {
    [key: string]: T;
}

interface ILevelJSON {
    speed: number;
    tapPower: number;
    G: number;
    objects: {
        ground: Array<IGroundData>;
        block: Array<IBlockData>;
        bonus: Array<IBonusData>;
        background: Array<IBackground>;
        user: IUserData;
        finish: IObjectData;
    }
}

interface IObjectData {
    position: ICoordinates;
    size: ISize;
}

interface ICoordinates {
    x: number;
    y: number;
}

interface IRect {
    x: number;
    y: number;
    x1: number;
    y1: number;
}

interface ISize {
    width: number;
    height: number;
}

interface IGroundData extends IObjectData {
}

interface IBlockData extends IObjectData {
}

interface IBackground extends IObjectData {
    name: string;
}

interface IBonusData extends IObjectData {
    amount: number;
    bonusType?: TBonusType;
}

interface IUserData extends IObjectData {

}

interface IStateData {
    width: number;
    height: number;
    position: number;
    deltaTime: number;
    G: number;
}

interface IGameHandlers {
    resize: () => void;
}

interface IHTMLRenderFactory {
    (root: HTMLElement): IHTMLRender;
}

interface ICreateElementOptions {
    tag?: string;
    className?: string;
    parent?: HTMLElement;
}

interface IAnimatedObjectProps {
    width: number;
    height: number;
    x: number;
    y: number;
    over: boolean;
    isVisible: boolean;
    type: string;
    texture: string;
}

interface IHTMLRender {
    (list: Array<IAnimatedObjectProps>): void;
}

interface ICssFactory {
    (element: HTMLElement): ICss;
}

interface ICss {
    (key: string, value: string): void;
    (key: IHash<string>): void;
    (key: string): string;
}

interface ILevelOptions {
    index: number;
}

interface IConfig {
    factor: number;
    tapPower: number;
}

type TBonusType = 'bonus' | 'pay' | 'card';
type TConfigSet<T extends keyof IConfig> = (name: T, value: IConfig[T]) => void;
type TConfigGet<T extends keyof IConfig> = (name: T) => IConfig[T];
