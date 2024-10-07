import * as Sequelize from 'sequelize';
import {CategoryInstance, CategoryAttributes} from "../../models/category";
import {UserInstance, UserAttributes} from "../../models/user";
import {ProductInstance, ProductAttributes} from "../../models/product";
import {CartInstance, CartAttributes} from "../../models/cart";

/**
 * Interface that will be pass to each http incoming request,
 * This will contain each model we have defined
 * */
export interface DbInterface {
    sequelize: Sequelize.Sequelize;
    Sequelize: Sequelize.SequelizeStatic;
    user: Sequelize.Model<UserInstance, UserAttributes>
    product: Sequelize.Model<ProductInstance, ProductAttributes>
    category: Sequelize.Model<CategoryInstance, CategoryAttributes>
    cart: Sequelize.Model<CartInstance, CartAttributes>
}