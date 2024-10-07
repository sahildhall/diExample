import * as jwt from 'jsonwebtoken';
import {config} from '../config';
import {NextFunction, Request, Response} from "express";
import {DBFactory} from "../db";
import {injectable} from "inversify";

const configuration = config();
/** All the public get apis that does't require token */
let publicGet = [
    '/',
];

/** All the public POST apis that does't require token */
let publicPost = [
    '/user/login',
    '/user/signup'
];


@injectable()
export class ApiKeyCheck {

    constructor() {
    }

    createTokens = async (user, secret, secret2): Promise<any[]> => {
        const token = jwt.sign(user, secret, {expiresIn: configuration.tokenLife});
        const refreshToken = jwt.sign(user, secret2, {expiresIn: configuration.refreshTokenLife});
        return Promise.all([token, refreshToken]);
    };

    refreshTokens = async (token, refreshToken, models?: any) => {
        let user_email: string = '';
        try {
            const { email } = jwt.decode(refreshToken);
            user_email = email;
        } catch (err) {
            return {};
        }

        let user = await DBFactory.db.user.findOne({
            where: {email: user_email},
        });
        if (!user) return {};

        user = user.toJSON();

        const refreshSecret = configuration.validator + user.password;

        const [newToken, newRefreshToken] = await this.createTokens({email: user_email}, configuration.validator, refreshSecret);
        return {
            token: newToken,
            refreshToken: newRefreshToken,
            user,
        };
    };

    authTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
        let isPublic = this.checkIsPublicAPI(req);
        if (isPublic) {
            req['isPublicRequest'] = true;
            next();
        } else {
            return this.verifyAuthToken(req, res, next)
        }
    };

    checkIsPublicAPI = (req: any) => {
        let isPublic = false;
        let path = req._parsedOriginalUrl ? req._parsedOriginalUrl.pathname : req.originalUrl;

        switch (req.method) {
            case 'GET':
                isPublic = publicGet.indexOf(path) !== -1;
                break;
            case 'POST':
                isPublic = publicPost.indexOf(path) !== -1;
                break;
        }
        return isPublic;
    };

    /**
     * Enforces request to have a valid auth token, and for given permissions.
     * If passed, the request is enriched with current user and userType, or anonymous flag.
     * @param {Object} req - express request.
     * @param {Object} res - express response.
     * @param {function(err)} next - express next.
     */

    verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.body.token || req.params['token'] || req.headers['x-access-token'];
        const refreshToken = req.headers['x-refresh-token'];

        if (token) {
            try {
                let decoded = await jwt.verify(token, configuration.validator);
                return DBFactory.db.user.findOne({
                    where: {email: decoded.email},
                }).then(result => {
                        if (!result) throw new Error('Invalid token, no admin user found');
                        req['user'] = result.toJSON();
                        return next();
                    })
                    .catch(next);

            } catch (e) {
                if (refreshToken) {
                    const newTokens = await this.refreshTokens(token, refreshToken);
                    if (newTokens.token && newTokens.refreshToken) {
                        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                        res.set('x-access-token', newTokens.token);
                        res.set('x-refresh-token', newTokens.refreshToken);
                    }
                    return res.status(403).send({
                        success: false,
                        message: 'Token Expired, new has been provided in response headers',
                    });
                } else {
                    return res.status(402).send({
                        success: false,
                        message: 'No token provided.',
                    });
                }
            }
        } else {
            // if there is no token
            // return an error
            return res.status(402).send({
                success: false,
                message: 'No token provided.',
            });
        }
    };
}