import * as Sequelize from 'sequelize';
// @ts-ignore
import {SequelizeAttributes} from 'lib/SequelizeAttributes/index.d.ts';

/**
 * Fields of a single database row
 * This interface defines all the attributes you specify when creating a new instance of the model. All the values will be database column.
 * */
export interface CategoryAttributes {
    id?: number;
    name: string;
    type: string;
    model: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * a single database row
 * This represents a Sequelize instance for an actual database row. For example, the function User.find({ id: 1 }) returns an instance of the User model.
 * It will have the ModelAttributes we defined (i.e., the table columns)
 * as well as more Sequelize instance methods such as .validate, .save, .update.
 * */
export interface CategoryInstance extends Sequelize.Instance<CategoryAttributes>, CategoryAttributes {
}

/**
 * A table in the database
 * Function that will actually define a Sequelize model for the Users table. The model should correspond to the CategoryAttributes and CategoryInstance types.
 * In typical Sequelize manner, this function will take your Sequelize instance and a DataTypes object,
 * and return the created Sequelize model. To define models in Sequelize, we use the sequelize.define<TInstance, TAttributes>() function.
 * The function takes an object which specifies the columns to create.
 * */
export const CategoryFactory = (sequelize: Sequelize.sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<CategoryInstance, CategoryAttributes> => {

    const attributes: SequelizeAttributes<CategoryAttributes> = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        model: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    };
    const category = sequelize.define<CategoryInstance, CategoryAttributes>('category', attributes, {
        instanceMethods: {
            toJSON: function () {
                return this;
            },
        },
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
    });

    category.associate = models => {};
    return category;
};



