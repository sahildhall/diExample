import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {DBFactory} from '../../db';
import {Symbols} from '../../config/symbols';
import {Util} from '../../lib/util';
import {MiddlewaresValidateBody, BodyTypes} from '../../middlewares/middlewares.validateBody'
import {ApiKeyCheck} from "../../authenticate/apiKeyCheck";
import {config} from "../../config";

const configuration = config();


@injectable()
export class UserController {

    constructor(
        @inject(Symbols.Util) private util: Util,
        @inject(Symbols.MiddlewaresValidateBody) private middlewaresValidateBody: MiddlewaresValidateBody,
        @inject(Symbols.ApiKeyCheck) private apiKeyCheck: ApiKeyCheck,
    ) {
    }

    login = async (req: Request, res: Response): Promise<any> => {
        try {
            let reqBody = await this.middlewaresValidateBody.validateBody(BodyTypes.LOGIN, req.body);

            let userProfile = await DBFactory.db.user.findOne({where: {email: reqBody.email}});

            if (!userProfile) throw new Error('User not found');
            userProfile = userProfile.toJSON();

            if (reqBody.password !== userProfile.password) throw new Error('Password is not same');

            const [newToken, newRefreshToken] = await this.apiKeyCheck.createTokens({email: userProfile.email}, configuration.validator, configuration.validator + userProfile.password);
            userProfile.token = newToken;
            userProfile.refreshToken = newRefreshToken;

            this.util.render(res, 201, userProfile);
        } catch (e) {
            this.util.renderError(res, 422, e);
        }
    };

    signup = async (req: Request, res: Response): Promise<any> => {
        try {
            const reqBody = await this.middlewaresValidateBody.validateBody(BodyTypes.USER_CREATE, req.body);

            let userProfile = await DBFactory.db.user.create(reqBody);

            this.util.render(res, 201, userProfile.toJSON());
        } catch (e) {
            this.util.renderError(res, 422, e);
        }
    };

    getCart = async (req: Request, res: Response): Promise<any> => {
        try {
            let cartList = await DBFactory.db.cart.findAll({
                where: {
                    userId: req['user'].id,
                },
                include: [{model: DBFactory.db.product}]
            });

            this.util.render(res, 200, cartList.map(val => val.toJSON()));
        } catch (e) {
            this.util.renderError(res, 422, e);
        }
    };
}