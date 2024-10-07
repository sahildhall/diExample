import * as Sequelize from 'sequelize';
// @ts-ignore
import {SequelizeAttributes} from 'lib/SequelizeAttributes/index.d.ts';

/**
 * Fields of a single database row
 * This interface defines all the attributes you specify when creating a new instance of the model. All the values will be database column.
 * */
export interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    contactNumber: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * a single database row
 * This represents a Sequelize instance for an actual database row. For example, the function User.find({ id: 1 }) returns an instance of the User model.
 * It will have the ModelAttributes we defined (i.e., the table columns)
 * as well as more Sequelize instance methods such as .validate, .save, .update.
 * */
export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
}

/**
 * A table in the database
 * Function that will actually define a Sequelize model for the Users table. The model should correspond to the UserAttributes and UserInstance types.
 * In typical Sequelize manner, this function will take your Sequelize instance and a DataTypes object,
 * and return the created Sequelize model. To define models in Sequelize, we use the sequelize.define<TInstance, TAttributes>() function.
 * The function takes an object which specifies the columns to create.
 * */
export const UserFactory = (sequelize: Sequelize.sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<UserInstance, UserAttributes> => {

    const attributes: SequelizeAttributes<UserAttributes> = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        contactNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    };
    const user = sequelize.define<UserInstance, UserAttributes>('user', attributes, {
        instanceMethods: {
            toJSON: function () {
                return this;
            },
        },
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
    });

    user.associate = models => {

    };
    return user;
};

