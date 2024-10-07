import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import * as winston_file from 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const logDir = path.resolve(__dirname,'../applicationlog');

// success logger for result.log

function formatArgs(args) {
    return util.format.apply(util.format, Array.prototype.slice.call(args));
}

export class Logger{
    static successLogger;
    static errorLogger;
    static responseSuccessLogger;
    static initLogger = () => {

        /** Create the log directory if it does not exist */
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        if (process.env.NODE_ENV !== 'production') {
            Logger.successLogger = winston.createLogger({
                transports: [
                    // colorize the output to the console
                    new (winston.transports.Console)({
                        // colorize: true,
                        level: 'info',
                    }),
                    new (winston_file)({
                        filename: `${logDir}/results-%DATE%.log`,
                        datePattern: 'DD-MM-YYYY',
                        // prepend: true,
                        level: 'info',
                        maxSize: '20m',
                        maxFiles: '14d',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.json()
                        ),
                    }),
                ],
            });

            // error logger for error.log
            Logger.errorLogger = winston.createLogger({
                transports: [
                    // colorize the output to the console
                    new (winston.transports.Console)({
                        // colorize: true,
                        level: 'error',
                    }),

                    new (winston_file)({
                        filename: `${logDir}/error-%DATE%.log`,
                        datePattern: 'DD-MM-YYYY',
                        // prepend: true,
                        level: 'error',
                        maxSize: '20m',
                        maxFiles: '14d',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.json()
                        ),
                    }),
                ],
            });

            // response success logger for response-result.log
            Logger.responseSuccessLogger = new (expressWinston.logger)({
                transports: [
                    // colorize the output to the console

                    new winston.transports.Console({
                        // json: true,
                        // colorize: true,
                    }),

                    new (winston_file)({
                        filename: `${logDir}/response-result-%DATE%.log`,
                        datePattern: 'DD-MM-YYYY',
                        // prepend: true,
                        level: 'info',
                        maxSize: '20m',
                        maxFiles: '14d',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.json()
                        ),
                    }),
                ],
                meta: true,
                requestWhitelist: ['url', 'ip', 'method', 'headers', 'connection', 'body'],
                requestFilter: function (req, propName) {
                    switch (propName) {
                        case 'url':
                            return req[propName];
                        case 'method':
                            return req[propName];
                        case 'headers':
                            return {host: req[propName]['host'], 'x-real-ip': req.headers['x-real-ip']};
                        case 'ip':
                            return req[propName];
                        case 'connection':
                            return req[propName].remoteAddress;
                    }
                },
            });
        }
        else {

            Logger.successLogger = winston.createLogger({
                transports: [
                    // colorize the output to the console
                    new (winston.transports.Console)({
                        // colorize: true,
                        level: 'info',
                    }),
                ],
            });

            // error logger for error.log
            Logger.errorLogger = winston.createLogger({
                transports: [
                    // colorize the output to the console

                    new (winston.transports.Console)({
                        // colorize: true,
                        level: 'error',
                    }),
                ],
            });

            // response success logger for response-result.log
            Logger.responseSuccessLogger = new (expressWinston.logger)({
                transports: [
                    // colorize the output to the console
                    new winston.transports.Console({
                        // json: true,
                        // colorize: true,
                    }),
                ],
                meta: true,
                requestWhitelist: ['url', 'ip', 'method', 'headers', 'connection', 'body'],
                requestFilter: function (req, propName) {
                    switch (propName) {
                        case 'url':
                            return req[propName];
                        case 'method':
                            return req[propName];
                        case 'headers':
                            return {host: req[propName]['host'], 'x-real-ip': req.headers['x-real-ip']};
                        case 'ip':
                            return req[propName];
                        case 'connection':
                            return req[propName].remoteAddress;
                    }
                },
            });
        }

        /** Writing wrapper over console, so in case console.log/ error has been called, we will directly log this in our logging file
         * */
       /* console.log = function () {
            let args = [formatArgs(arguments).toString().replace(/\r?\n|\r/g, '')];
            Logger.successLogger.info.apply(Logger.successLogger, args);
        };

        console.error = function () {
            let args = [formatArgs(arguments).toString().replace(/\r?\n|\r/g, '')];
            Logger.errorLogger.error.apply(Logger.errorLogger, args);
        };*/
    }
};
