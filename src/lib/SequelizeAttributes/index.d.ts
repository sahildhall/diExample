import {DataTypeAbstract, DefineAttributeColumnOptions} from "sequelize"

type SequelizeAttribute = string | DataTypeAbstract | DefineAttributeColumnOptions;

export type SequelizeAttributes<T extends{[key: string]: any}> = {
    [p in keyof T]: SequelizeAttribute
};
