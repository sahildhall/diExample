import * as Sequelize from 'sequelize';
import {DbInterface} from './DbInterface';
import {UserFactory} from '../models/user';
import {CategoryFactory} from '../models/category';
import {ProductFactory} from '../models/product';
import {CartFactory} from "../models/cart";

export class DBFactory {

    public static db: DbInterface;

    static reconnectOptions = {
        max_retries: 999,
        onRetry: (count) => console.log(`Connection lost trying to reconnect ${count}`)
    };

    public static createModels = (sequelizeConfig: any): DbInterface => {
        const {database, username, password, host, dialect, databaseLogger} = sequelizeConfig;
        const sequelize = new Sequelize(database, username, password, {
            host,
            dialect,
            logging: databaseLogger,
            // timezone: '+05:30', // for
            dialectOptions: {
                typeCast: function (field, next) {
                    if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
                        return new Date(field.string() + 'Z');
                    }
                    return next();
                }
            },
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            reconnect: DBFactory.reconnectOptions || true,
        });

        DBFactory.db = {
            sequelize,
            Sequelize,
            user: UserFactory(sequelize, Sequelize),
            category: CategoryFactory(sequelize, Sequelize),
            product: ProductFactory(sequelize, Sequelize),
            cart: CartFactory(sequelize, Sequelize),
        };

        Object.keys(DBFactory.db).forEach(modelName => {
            if (DBFactory.db[modelName].associate) {
                DBFactory.db[modelName].associate(DBFactory.db);
            }
        });

        return DBFactory.db;
    };
}