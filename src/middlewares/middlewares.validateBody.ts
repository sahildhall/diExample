import * as Joi from 'joi';
import {injectable} from "inversify";

const JoiSchemas: any = {};

export enum BodyTypes {
    LOGIN,
    GET_USER,
    USER_CREATE,
    ADD_TO_CART,
    ALL_PRODUCTS,
}

@injectable()
export class MiddlewaresValidateBody {
    constructor() {
    }

    initValidationObject = async (): Promise<any> => {

        JoiSchemas[BodyTypes.LOGIN] = Joi.object().keys({
            email: Joi.string().email({minDomainSegments: 1, tlds: {allow: ['com']}}).required(),
            password: Joi.string().required(),
        });

        JoiSchemas[BodyTypes.GET_USER] = Joi.object().keys({
            agentId: Joi.number().required(),
        });

        JoiSchemas[BodyTypes.ADD_TO_CART] = Joi.object().keys({
            productId: Joi.number().required(),
            quantity: Joi.number().required(),
        });

        JoiSchemas[BodyTypes.ALL_PRODUCTS] = Joi.object().keys({
            categoryId: Joi.number().optional(),
        });

        JoiSchemas[BodyTypes.USER_CREATE] = Joi.object().keys({
            email: Joi.string().required(),
            firstName: Joi.string().required(),
            password: Joi.string().required(),
            lastName: Joi.string(),
            agentContactNumber: Joi.number(),
            contactNumber: Joi.number(),
            // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),//.required(),
        });
    };

    validateBody = async (type: any, requestBody: object): Promise<any> => {
        try {
            let schema: object = JoiSchemas[type];

            if (!schema) throw new Error('No validation schema has been implemented');
            return await Joi.validate(requestBody, schema);
        } catch (e) {
            throw e
        }
    }
}