/**
 * Created by daniil on 27.08.2018.
 */

const config: IConfig = Object.create(null);

export const set: TConfigSet<any> = (name, value) => {
    config[name] = value;
};

export const get: TConfigGet<any> = name => config[name];
