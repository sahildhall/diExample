import * as Sequelize from 'sequelize';
// @ts-ignore
import {SequelizeAttributes} from 'lib/SequelizeAttributes/index.d.ts';

/**
 * Fields of a single database row
 * This interface defines all the attributes you specify when creating a new instance of the model. All the values will be database column.
 * */
export interface ProductAttributes {
    id?: number;
    name: string;
    categoryId: number;
    description: string;
    price: number;
    make: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * a single database row
 * This represents a Sequelize instance for an actual database row. For example, the function Product.find({ id: 1 }) returns an instance of the Product model.
 * It will have the ModelAttributes we defined (i.e., the table columns)
 * as well as more Sequelize instance methods such as .validate, .save, .update.
 * */
export interface ProductInstance extends Sequelize.Instance<ProductAttributes>, ProductAttributes {
}

/**
 * A table in the database
 * Function that will actually define a Sequelize model for the Products table. The model should correspond to the UserAttributes and ProductInstance types.
 * In typical Sequelize manner, this function will take your Sequelize instance and a DataTypes object,
 * and return the created Sequelize model. To define models in Sequelize, we use the sequelize.define<TInstance, TAttributes>() function.
 * The function takes an object which specifies the columns to create.
 * */
export const ProductFactory = (sequelize: Sequelize.sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<ProductInstance, ProductAttributes> => {

    const attributes: SequelizeAttributes<ProductAttributes> = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        make: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    };
    const product = sequelize.define<ProductInstance, ProductAttributes>('product', attributes, {
        instanceMethods: {
            toJSON: function () {
                return this;
            },
        },
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
    });

    product.associate = models => {
        models.category.hasMany(product, {foreignKey: 'categoryId', foreignKeyConstraint: true, onDelete: 'cascade'});
        product.belongsTo(models.category, {foreignKey: 'categoryId', foreignKeyConstraint: true});
    };
    return product;
};

