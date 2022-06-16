import { Howl } from 'howler';


export const loose: Howl = new Howl({
    src: ['./sounds/lose.mp3', './sounds/lose.ogg']
});

export const win: Howl = new Howl({
    src: ['./sounds/win.mp3', './sounds/win.ogg']
});

export const jump: Howl = new Howl({
    src: ['./sounds/jump.mp3', './sounds/jump.ogg']
});

export const bonus: Howl = new Howl({
    src: ['./sounds/collect.mp3', './sounds/collect.ogg']
});
