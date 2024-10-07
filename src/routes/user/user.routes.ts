import * as express from "express";
import { injectable, inject } from "inversify";
import { UserController } from './';
import { Symbols } from '../../config/symbols';

@injectable()
export class UserRoutes{
    constructor(
        @inject(Symbols.UserController) private userController: UserController,
    ) {}

    public register(app: express.Application) {
        app.post('/user/login', this.userController.login);
        app.post('/user/signup', this.userController.signup);
        app.get('/user/cart', this.userController.getCart);
    }
}
