import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as errorHandler from "errorhandler";
import {config} from './config';
import container from "./config/inversify.config";
import {Bootstrap} from "./bootstarp";
import { Symbols } from './config/symbols';
import {DBFactory} from './db';
import {DbUploader} from './db/dbUploader';

import {Logger} from './lib/logger';

const bootstrap = container.get<Bootstrap>(Symbols.Bootstrap);
import {Middleware} from "./middlewares";
const configuration = config();
Logger.initLogger();

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;
    public sequelizeConnection: any = DBFactory;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //add routes
        this.routes();

        //add api
        this.api();
    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        //empty for now
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        //add static paths

        this.app.use(Logger.responseSuccessLogger);

        this.app.use(express.static(path.join(__dirname, "public")));

        //configure pug
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");

        //mount logger
        this.app.use(logger("dev"));

        //mount json form parser
        this.app.use(bodyParser.json({
            limit: '50mb',
        }));

        //mount query string parser
        this.app.use(bodyParser.urlencoded({
            limit: '50mb',
            extended: true
        }));

        //mount cookie parser middleware
        this.app.use(cookieParser("SECRET_GOES_HERE"));

        // catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        //error handling
        this.app.use(errorHandler());

        this.sequelizeConnection.createModels(configuration);
        this.sequelizeConnection.db.sequelize.sync()
            .then(async () => {
                console.log('Connected to DB successfully');
                return DbUploader.uploadDateInDb(this.sequelizeConnection.db);
            })
            .catch(error => console.log('Error in Connecting with DB', error));
    }

    /**
     * Create and return Router.
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes() {
        let router: express.Router;
        router = express.Router();

        // Middleware for cors
        Middleware.implementCors(this.app);

        bootstrap.init(this.app).catch(err => console.error('Error in attaching routes'));

        /* //use router middleware
         this.app.use(router);

       //IndexRoute
       IndexRoute.create(router);*/

    }

}
