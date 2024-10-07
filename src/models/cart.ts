import * as Sequelize from 'sequelize';
// @ts-ignore
import {SequelizeAttributes} from 'lib/SequelizeAttributes/index.d.ts';

/**
 * Fields of a single database row
 * This interface defines all the attributes you specify when creating a new instance of the model. All the values will be database column.
 * */
export interface CartAttributes {
    id: number;
    productId: number
    userId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * a single database row
 * This represents a Sequelize instance for an actual database row. For example, the function Cart.find({ id: 1 }) returns an instance of the Cart model.
 * It will have the ModelAttributes we defined (i.e., the table columns)
 * as well as more Sequelize instance methods such as .validate, .save, .update.
 * */
export interface CartInstance extends Sequelize.Instance<CartAttributes>, CartAttributes {
}

/**
 * A table in the database
 * Function that will actually define a Sequelize model for the Carts table. The model should correspond to the UserAttributes and CartInstance types.
 * In typical Sequelize manner, this function will take your Sequelize instance and a DataTypes object,
 * and return the created Sequelize model. To define models in Sequelize, we use the sequelize.define<TInstance, TAttributes>() function.
 * The function takes an object which specifies the columns to create.
 * */
export const CartFactory = (sequelize: Sequelize.sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<CartInstance, CartAttributes> => {

    const attributes: SequelizeAttributes<CartAttributes> = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    };
    const cart = sequelize.define<CartInstance, CartAttributes>('cart', attributes, {
        instanceMethods: {
            toJSON: function () {
                return this;
            },
        },
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
    });

    cart.associate = models => {
        models.user.hasMany(cart, {foreignKey: 'userId', foreignKeyConstraint: true, onDelete: 'cascade'});
        cart.belongsTo(models.user, {foreignKey: 'userId', foreignKeyConstraint: true});
        models.product.hasMany(cart, {foreignKey: 'productId', foreignKeyConstraint: true, onDelete: 'cascade'});
        cart.belongsTo(models.product, {foreignKey: 'productId', foreignKeyConstraint: true});
    };
    return cart;
};

