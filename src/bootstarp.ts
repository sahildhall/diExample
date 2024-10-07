
import { injectable, inject } from "inversify";
import * as express from 'express';
import {config} from './config';
import { ProductRoutes } from './routes/product';
import { Symbols } from './config/symbols';
import { ApiKeyCheck } from './authenticate/apiKeyCheck';
import { MiddlewaresValidateBody } from './middlewares/middlewares.validateBody';
import {UserRoutes} from "./routes/user";

let configuration = config();

@injectable()
export class Bootstrap {
    public constructor(
        @inject(Symbols.ApiKeyCheck) private apiKeyCheck: ApiKeyCheck,
        @inject(Symbols.MiddlewaresValidateBody) private middlewaresValidateBody: MiddlewaresValidateBody,
        @inject(Symbols.ProductRoutes) private productRoutes: ProductRoutes,
        @inject(Symbols.UserRoutes) private userRoutes: UserRoutes,
    ){}

    async init(app: express.Application){
        await this.handleMiddlewares(app);
        await this.middlewaresValidateBody.initValidationObject();
        await this.registerRoutes(app);
    }

    async registerRoutes(app: express.Application){
        this.productRoutes.register(app);
        this.userRoutes.register(app);
    }

    async handleMiddlewares(app: express.Application){
        app.use(this.apiKeyCheck.authTokenMiddleware)
    }
}