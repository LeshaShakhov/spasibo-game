/// <reference path="../interface.d.ts"/>

export * from './Line';

import { get } from '../config';
import { AnimatedObject } from '../objects/AnimatedObject';
import { isEmpty } from 'ts-utils';
import { OBJECT_TYPE } from '../constants';


export const getJSON = <T>(path: string): Promise<T> => {
    return fetch(path)
        .then(r => {
            if (r.ok) {
                return r.json();
            } else {
                return r.text()
                    .then((response) => Promise.reject(response));
            }
        });
};

export const normalize = (coordinate: number) => Math.round(coordinate * get('factor'));

export const createElement = ({ tag, className, parent }: ICreateElementOptions) => {
    const element = document.createElement(tag || 'div');

    if (className) {
        className.trim().split(/\s+/).forEach(name => {
            element.classList.add(name);
        });
    }

    if (parent) {
        parent.appendChild(element);
    }

    return element;
};

export const cssFactory: ICssFactory = element => (key, value?) => {
    if (typeof key === 'object') {
        Object.keys(key).forEach(name => {
            const value = key[name];
            cssFactory(element)(name, value);
        });
        return null;
    }
    if (isEmpty(value)) {
        return getComputedStyle(element)[key];
    } else {
        element.style[key] = value;
    }
};

export const isGround = (object: AnimatedObject): boolean => object.type === OBJECT_TYPE.GROUND;
export const isNotBackground = (object: AnimatedObject): boolean => object.type !== OBJECT_TYPE.BACKGROUND;
