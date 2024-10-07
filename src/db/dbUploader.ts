import {DbInterface} from "./DbInterface";
import {config} from '../config';
import {CategoryAttributes} from "../models/category";
import {DEFAULT_ECDH_CURVE} from "tls";
import {ProductAttributes} from "../models/product";

const configuration = config();

export enum CAMERA_NAMES {
    NIKON = 'Nikon',
    CANON = 'Canon',
    KODAK = 'Kodak'
};

export enum CAMERA_TYPE {
    MIRRORLESS = 'Mirrorless',
    FULL_FRAME = 'full frame',
};

export enum DEFAULT_PRODUCTS {
    NIKON_D850 = 'Nikon D850',
    CANON_D850 = 'Canon N410',
    KODAK_D850 = 'Kodak MS20',
}


export class DbUploader {
    static documentTypes = async (db: DbInterface) => {
        let types: Array<any> = await db.category.findAll();
        let typesToAddInDB: Array<CategoryAttributes> = [];
        if (types.length == 0) {
            for (let i in CAMERA_NAMES) {

                let model: number = 1995;
                let type: string = CAMERA_TYPE.MIRRORLESS;

                if (CAMERA_NAMES[i] == CAMERA_NAMES.CANON) {
                    model = 1991;
                    type = CAMERA_TYPE.MIRRORLESS;
                } else if (CAMERA_NAMES[i] == CAMERA_NAMES.KODAK) {
                    model = 1996;
                    type = CAMERA_TYPE.FULL_FRAME;
                }

                typesToAddInDB.push({
                    model,
                    name: CAMERA_NAMES[i],
                    type,
                })
            }
            return await db.category.bulkCreate(typesToAddInDB)
        } else {
            /** If we have some types but not, add them*/
        }
    };
    static createProducts = async (db: DbInterface) => {
        let types: Array<any> = await db.product.findAll();
        let typesToAddInDB: Array<ProductAttributes> = [];
        if (types.length == 0) {
            let count =1
            for (let i in DEFAULT_PRODUCTS) {

                let model: number = 1995;
                let type: string = CAMERA_TYPE.MIRRORLESS;

                if (CAMERA_NAMES[i] == CAMERA_NAMES.CANON) {
                    model = 1991;
                    type = CAMERA_TYPE.MIRRORLESS;
                } else if (CAMERA_NAMES[i] == CAMERA_NAMES.KODAK) {
                    model = 1996;
                    type = CAMERA_TYPE.FULL_FRAME;
                }

                typesToAddInDB.push({
                    categoryId: count++,
                    price: Math.floor(Math.random() * 1000) + 10,
                    description: `It is ${DEFAULT_PRODUCTS[i]} camera`,
                    name: DEFAULT_PRODUCTS[i],
                    make: 1995
                })
            }
            return await db.product.bulkCreate(typesToAddInDB)
        } else {
            /** If we have some types but not, add them*/
        }
    };

    static uploadDateInDb = async (db: any): Promise<any> => {
        await DbUploader.documentTypes(db);
        await DbUploader.createProducts(db);
    };
}