import * as express from "express";
import { injectable, inject } from "inversify";
import { ProductController } from './';
import { Symbols } from '../../config/symbols';

@injectable()
export class ProductRoutes{
    constructor(
        @inject(Symbols.ProductController) private productController: ProductController,
    ) {}

    public register(app: express.Application) {
        app.get('/product/all', this.productController.getAllProducts);
        app.post('/product/addtocart', this.productController.addToCart);
        app.get('/product/allcategories', this.productController.getAllCategories);

    }
}
