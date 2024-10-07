import { injectable } from "inversify";
import {Response} from "express";
import {Result} from "../authenticate/Result";

// @ts-ignore
/**
 * Synchronously read the given directory and load modules of given type.
 * Provided handler is called for each loaded module.
 * Note: All modules in directory should be of given type.
 *
 * @param {String} rootPath - directory to walk.
 * @param {function} type - module class for "instance of" matching.
 * @param {function(*)} handler - module load handler.
 */

@injectable()
export class Util {

    render = (res: Response, statusCode: number, msg?: any, headers?: any): any => {
        //add constants
        res.locals.BASE_URL = "/";

        //render view
        let result = new Result(statusCode, msg, null);
        headers ? res.set(headers).status(statusCode).send(msg) : res.status(statusCode).send(result);
    };

    renderError = (res: Response, statusCode: number, err?: any): any => {
        if (res.headersSent) {
            // response sending already started
            res.end();
            console.log('warn', 'errorHandler: Request headers already sent. Cannot respond with error.');
        } else {
            // other error
            // errors.internal_error().withDetails(inspectDetails(err)).sendTo(res);
            let result = new Result(statusCode, null, err);
            res.status(statusCode).send(result);
        }
    };
}
