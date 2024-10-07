// @ts-ignore
import * as configuration from './config.json';
const NODE_ENV = process.env.NODE_ENV;
const DEFAULT_ENV = 'development';

export const config = (): any => {
    return configuration[NODE_ENV || DEFAULT_ENV]
};
