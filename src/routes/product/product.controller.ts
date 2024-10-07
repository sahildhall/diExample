import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {DBFactory} from '../../db';
import {Symbols} from '../../config/symbols';
import {Util} from '../../lib/util';
import {BodyTypes, MiddlewaresValidateBody} from "../../middlewares/middlewares.validateBody";

@injectable()
export class ProductController {

    constructor(
        @inject(Symbols.Util) private util: Util,
        @inject(Symbols.MiddlewaresValidateBody) private middlewaresValidateBody: MiddlewaresValidateBody,
    ) {
    }

    addToCart = async (req: Request, res: Response): Promise<any> => {
        try {
            let {productId, quantity} = await this.middlewaresValidateBody.validateBody(BodyTypes.ADD_TO_CART, req.body);

            let product = await DBFactory.db.product.findOne({where: {id: productId}});
            if (!product) throw new Error('Product not find');

            await DBFactory.db.cart.create({
                userId: req['user'].id,
                productId,
                quantity
            });
            this.util.render(res, 201, 'Added successfully');

        } catch (e) {
            this.util.renderError(res, 422, e);
        }
    };

    getAllCategories = async (req: Request, res: Response): Promise<any> => {
        try {
            let categories = await DBFactory.db.category.findAll();
            this.util.render(res, 200, categories.map(val => val.toJSON()));

        } catch (e) {
            this.util.renderError(res, 422, e);
        }
    };

    getAllProducts = async (req: Request, res: Response): Promise<any> => {
        try {
            let {categoryId} = await this.middlewaresValidateBody.validateBody(BodyTypes.ALL_PRODUCTS, req.query);

            let where: object = {};
            if (categoryId) where['categoryId'] = categoryId;

            let products = await DBFactory.db.product.findAll({where});
            this.util.render(res, 200, products.map(val => val.toJSON()));

        } catch (e) {
            this.util.renderError(res, 422, e);
        }
    };
}